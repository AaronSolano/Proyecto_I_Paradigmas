import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RefundsModule } from './refunds/refunds.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RefundsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
