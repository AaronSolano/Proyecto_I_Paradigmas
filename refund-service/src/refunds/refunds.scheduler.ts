import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RefundsService } from './refunds.service';

@Injectable()
export class RefundsScheduler {
  private readonly logger = new Logger(RefundsScheduler.name);
  private isRunning = false;

  constructor(private readonly refundsService: RefundsService) {}

  /**
   * Tarea programada cada 10 segundos para procesar reembolsos en estado REFUND_PENDING
   */
  @Cron('*/10 * * * * *')
  async handleCron(): Promise<void> {
    if (this.isRunning) {
      this.logger.debug(
        'Ciclo anterior de Background Job aún en progreso. Saltando tick...',
      );
      return;
    }

    this.isRunning = true;
    try {
      await this.refundsService.processPendingRefunds();
    } catch (error: any) {
      this.logger.error(
        `Error inesperado en Background Job de reembolsos: ${error?.message}`,
      );
    } finally {
      this.isRunning = false;
    }
  }
}
