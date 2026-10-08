import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class ProcessRefundDto {
  @IsString({ message: 'transactionId debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'transactionId es requerido' })
  transactionId: string;

  @IsNumber({}, { message: 'amount debe ser un número válido' })
  @IsPositive({ message: 'amount debe ser un monto positivo mayor a cero' })
  amount: number;

  @IsString({ message: 'webhookCallbackUrl debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'webhookCallbackUrl es requerido' })
  webhookCallbackUrl: string;

  @IsOptional()
  @IsBoolean({ message: 'forceFailure debe ser un booleano' })
  forceFailure?: boolean;
}
