import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Las rutas del proveedor se exponen bajo /provider (ver contratos-api-y-webhooks.md)
  app.setGlobalPrefix('provider');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const port = Number(process.env.PORT ?? 5000);
  await app.listen(port);
  Logger.log(`Fake Provider escuchando en el puerto ${port}`, 'Bootstrap');
}

void bootstrap();
