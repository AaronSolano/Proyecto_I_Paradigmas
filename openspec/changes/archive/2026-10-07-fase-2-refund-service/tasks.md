## 1. Persistencia y Configuración

- [x] 1.1 Configurar módulo TypeORM con PostgreSQL y variables de entorno en `refund-service`
- [x] 1.2 Implementar entidad `RefundTransaction` (`id`, `transactionId`, `amount`, `status`, `attempts`, `lastAttempt`, `providerRefundId`, `createdAt`, `updatedAt`)

## 2. API REST y DTOs

- [x] 2.1 Implementar DTOs con `class-validator` para creación de reembolsos
- [x] 2.2 Implementar controlador y servicio para `POST /api/refunds` y `GET /api/refunds`

## 3. Background Job y Webhooks

- [x] 3.1 Implementar tarea programada `@Cron('*/10 * * * * *')` con selección atómica y despacho HTTP
- [x] 3.2 Implementar controlador `POST /api/webhooks/refund` con transiciones de reintento (`attempts < 3`) y estados finales
