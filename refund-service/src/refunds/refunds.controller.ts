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

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRefund(
    @Body() createRefundDto: CreateRefundDto,
  ): Promise<RefundTransaction> {
    return this.refundsService.createRefund(createRefundDto);
  }

  @Get()
  async getRefunds(): Promise<RefundTransaction[]> {
    return this.refundsService.findAll();
  }
}
