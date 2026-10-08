## 1. Controlador y DTOs del Proveedor

- [x] 1.1 Implementar DTO de entrada para `POST /provider/refunds` (`transactionId`, `amount`, `webhookCallbackUrl`, `forceFailure`)
- [x] 1.2 Implementar controlador `POST /provider/refunds` retornando HTTP 202 Accepted inmediato

## 2. Simulación Asíncrona y Webhook Callback

- [x] 2.1 Implementar servicio con Promesa no bloqueante para retardo configurable (2 a 4 segundos)
- [x] 2.2 Implementar resolución de estados (`SUCCESS` / `FAILURE`) respetando `forceFailure`
- [x] 2.3 Implementar despacho HTTP POST con Axios hacia la URL de callback del Webhook
