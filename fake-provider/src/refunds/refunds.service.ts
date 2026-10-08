import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ProcessRefundDto } from './dto/process-refund.dto';

export interface ProviderRefundResult {
  transactionId: string;
  providerRefundId: string;
  status: 'SUCCESS' | 'FAILURE';
  message: string;
}

@Injectable()
export class RefundsService {
  private readonly logger = new Logger(RefundsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Ejecuta el procesamiento de reembolso en segundo plano de manera no bloqueante.
   */
  processRefundAsync(dto: ProcessRefundDto): void {
    this.executeAsyncSimulation(dto).catch((error: any) => {
      this.logger.error(
        `[PROVIDER] Error no controlado durante simulación para transacción ${dto.transactionId}: ${error?.message}`,
        error?.stack,
      );
    });
  }

  /**
   * Simula retardo asíncrono no bloqueante, calcula el veredicto y despacha el webhook.
   */
  async executeAsyncSimulation(
    dto: ProcessRefundDto,
  ): Promise<ProviderRefundResult> {
    const minDelay = Number(
      this.configService.get<number>('PROVIDER_MIN_DELAY_MS') ?? 2000,
    );
    const maxDelay = Number(
      this.configService.get<number>('PROVIDER_MAX_DELAY_MS') ?? 4000,
    );
    const delayMs =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    this.logger.log(
      `[PROVIDER] Solicitud de reembolso recibida para TRX: ${dto.transactionId}. Simulando retardo de ${delayMs}ms...`,
    );

    // Retardo no bloqueante con Promesa (2 a 4 segundos)
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Resolución de veredicto
    let status: 'SUCCESS' | 'FAILURE' = 'SUCCESS';
    let message = 'Operación autorizada con éxito';

    if (dto.forceFailure) {
      status = 'FAILURE';
      message = 'Operación rechazada por forceFailure solicitado por el cliente';
    } else {
      const failureRate = Number(
        this.configService.get<number>('PROVIDER_FAILURE_RATE') ?? 0,
      );
      if (failureRate > 0 && Math.random() < failureRate) {
        status = 'FAILURE';
        message = 'Fallo simulado por tasa de error aleatoria del proveedor';
      }
    }

    const providerRefundId = `PROV-REF-${Math.floor(1000 + Math.random() * 9000)}`;

    const result: ProviderRefundResult = {
      transactionId: dto.transactionId,
      providerRefundId,
      status,
      message,
    };

    this.logger.log(
      `[PROVIDER] Notificando Webhook en ${dto.webhookCallbackUrl} con estado ${status} (ID: ${providerRefundId}) para TRX: ${dto.transactionId}`,
    );

    // Despacho HTTP POST con Axios hacia la URL de callback del Webhook
    try {
      const response = await firstValueFrom(
        this.httpService.post(dto.webhookCallbackUrl, result, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      this.logger.log(
        `[PROVIDER] Webhook entregado con éxito a ${dto.webhookCallbackUrl} (HTTP ${response.status}) para TRX: ${dto.transactionId}`,
      );
    } catch (error: any) {
      this.logger.error(
        `[PROVIDER] Fallo al entregar Webhook a ${dto.webhookCallbackUrl} para TRX: ${dto.transactionId}: ${error?.message}`,
      );
    }

    return result;
  }
}
