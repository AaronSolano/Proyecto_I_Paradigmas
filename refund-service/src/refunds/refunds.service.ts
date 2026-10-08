import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  RefundTransaction,
  RefundStatus,
} from './entities/refund-transaction.entity';
import { CreateRefundDto } from './dto/create-refund.dto';
import { WebhookRefundDto } from './dto/webhook-refund.dto';

@Injectable()
export class RefundsService {
  private readonly logger = new Logger(RefundsService.name);

  constructor(
    @InjectRepository(RefundTransaction)
    private readonly refundRepository: Repository<RefundTransaction>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Crea una nueva transacción de reembolso en estado REFUND_PENDING.
   */
  async createRefund(
    createRefundDto: CreateRefundDto,
  ): Promise<RefundTransaction> {
    const existing = await this.refundRepository.findOne({
      where: { transactionId: createRefundDto.transactionId },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe una transacción de reembolso con transactionId: ${createRefundDto.transactionId}`,
      );
    }

    const refund = this.refundRepository.create({
      transactionId: createRefundDto.transactionId,
      amount: createRefundDto.amount,
      status: RefundStatus.REFUND_PENDING,
      attempts: 0,
      lastAttempt: null,
      providerRefundId: null,
    });

    const saved = await this.refundRepository.save(refund);
    this.logger.log(
      `Reembolso registrado exitosamente: ${saved.transactionId} por $${saved.amount}`,
    );
    return saved;
  }

  /**
   * Obtiene la lista completa de reembolsos ordenados por fecha de creación descendente.
   */
  async findAll(): Promise<RefundTransaction[]> {
    return this.refundRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Procesa la notificación asíncrona del proveedor externo vía Webhook.
   */
  async handleWebhook(
    dto: WebhookRefundDto,
  ): Promise<{ acknowledged: boolean; message?: string }> {
    const refund = await this.refundRepository.findOne({
      where: { transactionId: dto.transactionId },
    });

    if (!refund) {
      this.logger.warn(
        `Webhook recibido para transacción inexistente: ${dto.transactionId}`,
      );
      throw new NotFoundException(
        `Transacción ${dto.transactionId} no encontrada`,
      );
    }

    // Protección de idempotencia si ya se encuentra en un estado terminal
    if (
      refund.status === RefundStatus.REFUNDED ||
      refund.status === RefundStatus.REFUND_FAILED
    ) {
      this.logger.log(
        `Webhook ignorado para transacción ya finalizada: ${dto.transactionId} (${refund.status})`,
      );
      return { acknowledged: true, message: 'Transacción ya finalizada' };
    }

    if (dto.status === 'SUCCESS') {
      refund.status = RefundStatus.REFUNDED;
      if (dto.providerRefundId) {
        refund.providerRefundId = dto.providerRefundId;
      }
      await this.refundRepository.save(refund);
      this.logger.log(
        `Reembolso completado exitosamente: ${refund.transactionId} (Provider ID: ${refund.providerRefundId})`,
      );
      return { acknowledged: true };
    }

    // Si status === 'FAILURE'
    const newAttempts = refund.attempts + 1;
    refund.attempts = newAttempts;
    refund.lastAttempt = new Date();

    if (newAttempts >= 3) {
      refund.status = RefundStatus.REFUND_FAILED;
      await this.refundRepository.save(refund);
      this.logger.error(
        `Reembolso ${refund.transactionId} falló definitivamente tras agotar ${newAttempts} reintentos.`,
      );
    } else {
      refund.status = RefundStatus.REFUND_PENDING;
      await this.refundRepository.save(refund);
      this.logger.warn(
        `Reembolso ${refund.transactionId} falló temporalmente. Reintento programado (${newAttempts}/3).`,
      );
    }

    return { acknowledged: true };
  }

  /**
   * Procesa lotes de reembolsos pendientes despachando la solicitud al proveedor externo.
   * Método invocado por la tarea programada periódica.
   */
  async processPendingRefunds(): Promise<void> {
    // Seleccionar transacciones en REFUND_PENDING con menos de 3 intentos
    const pendingRefunds = await this.refundRepository.find({
      where: {
        status: RefundStatus.REFUND_PENDING,
        attempts: LessThan(3),
      },
      order: { createdAt: 'ASC' },
      take: 20,
    });

    if (pendingRefunds.length === 0) {
      return;
    }

    this.logger.log(
      `Procesando lote de ${pendingRefunds.length} reembolso(s) pendiente(s)...`,
    );

    const providerUrl =
      this.configService.get<string>('PROVIDER_URL') ?? 'http://localhost:5000';
    const webhookCallbackUrl =
      this.configService.get<string>('WEBHOOK_CALLBACK_URL') ??
      'http://localhost:4000/api/webhooks/refund';

    for (const refund of pendingRefunds) {
      // Transición atómica preventiva a REFUND_PROCESSING
      refund.status = RefundStatus.REFUND_PROCESSING;
      await this.refundRepository.save(refund);

      const payload = {
        transactionId: refund.transactionId,
        amount: Number(refund.amount),
        webhookCallbackUrl,
        forceFailure: false,
      };

      try {
        await firstValueFrom(
          this.httpService.post(`${providerUrl}/provider/refunds`, payload, {
            timeout: 5000,
          }),
        );
        this.logger.log(
          `Despachado a proveedor con éxito: ${refund.transactionId}`,
        );
      } catch (error: any) {
        // En caso de fallo inmediato de red o indisponibilidad del proveedor
        this.logger.error(
          `Error despachando reembolso ${refund.transactionId} al proveedor: ${error?.message}`,
        );
        const newAttempts = refund.attempts + 1;
        refund.attempts = newAttempts;
        refund.lastAttempt = new Date();
        refund.status =
          newAttempts >= 3
            ? RefundStatus.REFUND_FAILED
            : RefundStatus.REFUND_PENDING;
        await this.refundRepository.save(refund);
      }
    }
  }
}
