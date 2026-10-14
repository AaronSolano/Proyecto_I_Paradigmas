import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RefundsService } from './refunds.service';

@Injectable()
export class RefundsScheduler {
  private readonly logger = new Logger('REFUND-JOB');
  // Evita que dos ticks del cron procesen el mismo lote a la vez.
  private isRunning = false;

  constructor(private readonly refundsService: RefundsService) {}

  /**
   * Tarea programada cada 10 segundos para procesar reembolsos en estado REFUND_PENDING
   */
  @Cron('*/10 * * * * *')
  async handleCron(): Promise<void> {
    if (this.isRunning) {
      this.logger.debug(
        '[REFUND-JOB] Ciclo anterior de Background Job aún en progreso. Saltando tick...',
      );
      return;
    }

    this.isRunning = true;
    try {
      await this.refundsService.processPendingRefunds();
    } catch (error: any) {
      this.logger.error(
        `[REFUND-JOB] Error inesperado en Background Job de reembolsos: ${error?.message}`,
      );
    } finally {
      this.isRunning = false;
    }
  }
}
