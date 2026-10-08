import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Todas las rutas del servicio se exponen bajo /api (ver contratos-api-y-webhooks.md)
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  Logger.log(`Refund Service escuchando en el puerto ${port}`, 'Bootstrap');
}

void bootstrap();
