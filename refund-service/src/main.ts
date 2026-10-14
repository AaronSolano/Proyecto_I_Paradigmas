import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LokiLogger } from './common/loki.logger';

// Arranque de la API de reembolsos: prefijo /api, validación y logs hacia Loki.
async function bootstrap(): Promise<void> {
  const lokiLogger = new LokiLogger('Bootstrap', 'refund-service');
  const app = await NestFactory.create(AppModule, {
    logger: lokiLogger,
  });

  // Todas las rutas del servicio se exponen bajo /api (ver contratos-api-y-webhooks.md)
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  lokiLogger.log(`Refund Service escuchando en el puerto ${port}`, 'Bootstrap');
}

void bootstrap();

