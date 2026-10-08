import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { RefundTransaction } from './entities/refund-transaction.entity';
import { RefundsService } from './refunds.service';
import { RefundsController } from './refunds.controller';
import { WebhooksController } from './webhooks.controller';
import { RefundsScheduler } from './refunds.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([RefundTransaction]), HttpModule],
  controllers: [RefundsController, WebhooksController],
  providers: [RefundsService, RefundsScheduler],
  exports: [RefundsService],
})
export class RefundsModule {}
