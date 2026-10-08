## Why

El servicio `refund-service` es el componente central de la solución y requiere gestionar de forma confiable el ciclo de vida de los reembolsos mediante persistencia en PostgreSQL, una tarea periódica en segundo plano (`@Cron`) y recepción de notificaciones Webhook con reintentos finitos.

## What Changes

- Creación de entidad `RefundTransaction` en TypeORM/PostgreSQL.
- Endpoints `POST /api/refunds` (creación con estado `REFUND_PENDING`) y `GET /api/refunds` (consulta general).
- Background Job con `@nestjs/schedule` (`@Cron('*/10 * * * * *')`) que selecciona lotes de `REFUND_PENDING`, los actualiza de forma atómica a `REFUND_PROCESSING` y despacha petición HTTP hacia `fake-provider`.
- Endpoint `POST /api/webhooks/refund` para recibir resultados: si `SUCCESS` pasa a `REFUNDED`, si `FAILURE` incrementa intentos y retorna a `REFUND_PENDING` (o `REFUND_FAILED` si supera 3 intentos).

## Capabilities

### New Capabilities
- `refund-orchestration`: Orquestación completa de estados de reembolso, background job periódico y recepción de webhooks con límite de 3 reintentos.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Modifica el microservicio `refund-service` (puerto 4000).
- Requiere instancia funcional de PostgreSQL.
