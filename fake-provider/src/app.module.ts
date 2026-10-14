import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RefundsModule } from './refunds/refunds.module';

// Proveedor simulado: solo configuración y el módulo de reembolsos.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RefundsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
