import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundsModule } from './refunds/refunds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const dbSsl = configService.get<string>('DB_SSL');

        const isSslEnabled =
          dbSsl === 'true' ||
          (databaseUrl
            ? databaseUrl.includes('supabase.co') ||
              databaseUrl.includes('supabase.com') ||
              databaseUrl.includes('sslmode=require')
            : false);

        const sslConfig = isSslEnabled ? { rejectUnauthorized: false } : false;

        const baseOptions = {
          type: 'postgres' as const,
          autoLoadEntities: true,
          synchronize:
            configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
          retryAttempts: 10,
          retryDelay: 3000,
          ssl: sslConfig,
          extra: isSslEnabled ? { ssl: { rejectUnauthorized: false } } : {},
        };

        if (databaseUrl) {
          return {
            ...baseOptions,
            url: databaseUrl,
          };
        }

        return {
          ...baseOptions,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<number>('DB_PORT', 5432)),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'postgres'),
        };
      },
    }),
    RefundsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
