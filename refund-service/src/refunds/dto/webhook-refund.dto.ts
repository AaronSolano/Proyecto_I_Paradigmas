import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WebhookRefundDto {
  @IsString({ message: 'transactionId debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'transactionId es requerido' })
  transactionId: string;

  @IsIn(['SUCCESS', 'FAILURE'], {
    message: 'status debe ser SUCCESS o FAILURE',
  })
  status: 'SUCCESS' | 'FAILURE';

  @IsOptional()
  @IsString({ message: 'providerRefundId debe ser una cadena de texto' })
  providerRefundId?: string;

  @IsOptional()
  @IsString({ message: 'message debe ser una cadena de texto' })
  message?: string;
}
