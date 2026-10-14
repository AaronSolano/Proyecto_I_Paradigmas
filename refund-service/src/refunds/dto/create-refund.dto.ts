import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

// Cuerpo de POST /api/refunds.
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

  @IsOptional()
  @IsBoolean({ message: 'forceFailure debe ser un booleano' })
  forceFailure?: boolean;
}

