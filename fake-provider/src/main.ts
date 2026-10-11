import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LokiLogger } from './common/loki.logger';

async function bootstrap(): Promise<void> {
  const lokiLogger = new LokiLogger('Bootstrap', 'fake-provider');
  const app = await NestFactory.create(AppModule, {
    logger: lokiLogger,
  });

  // Las rutas del proveedor se exponen bajo /provider (ver contratos-api-y-webhooks.md)
  app.setGlobalPrefix('provider');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const port = Number(process.env.PORT ?? 5000);
  await app.listen(port);
  lokiLogger.log(`Fake Provider escuchando en el puerto ${port}`, 'Bootstrap');
}

void bootstrap();

