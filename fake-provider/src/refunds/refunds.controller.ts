import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { ProcessRefundDto } from './dto/process-refund.dto';

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  processRefund(@Body() dto: ProcessRefundDto) {
    // Inicia el procesamiento asíncrono no bloqueante
    this.refundsService.processRefundAsync(dto);

    // Retorna HTTP 202 Accepted inmediatamente
    return {
      status: 'ACCEPTED',
      message: 'Reembolso en proceso de validación externa',
    };
  }
}
