import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { WebhookRefundDto } from './dto/webhook-refund.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post('refund')
  @HttpCode(HttpStatus.OK)
  async handleRefundWebhook(
    @Body() dto: WebhookRefundDto,
  ): Promise<{ acknowledged: boolean; message?: string }> {
    return this.refundsService.handleWebhook(dto);
  }
}
