import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { RefundTransaction } from './entities/refund-transaction.entity';

// POST y GET /api/refunds. El alta responde 201 sin esperar al proveedor.
@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  // Registra la orden en REFUND_PENDING.
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRefund(
    @Body() createRefundDto: CreateRefundDto,
  ): Promise<RefundTransaction> {
    return this.refundsService.createRefund(createRefundDto);
  }

  // Lista usada por el dashboard.
  @Get()
  async getRefunds(): Promise<RefundTransaction[]> {
    return this.refundsService.findAll();
  }
}
