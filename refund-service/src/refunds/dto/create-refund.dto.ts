import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateRefundDto {
  @IsString({ message: 'transactionId debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'transactionId es requerido' })
  transactionId: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'amount debe ser un número válido con hasta 2 decimales' },
  )
  @IsPositive({ message: 'amount debe ser mayor a 0' })
  amount: number;
}
