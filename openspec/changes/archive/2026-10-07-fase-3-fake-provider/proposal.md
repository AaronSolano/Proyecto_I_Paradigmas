## Why

El sistema requiere simular una pasarela bancaria externa desacoplada (`fake-provider`) para procesar las solicitudes de reembolso que despacha el background job, emular latencia real y emitir resultados mediante llamadas asíncronas de retorno (Webhooks).

## What Changes

- Implementación de microservicio independiente en NestJS (puerto 5000).
- Endpoint `POST /provider/refunds` que valida la petición entrante y retorna inmediatamente HTTP 202 Accepted.
- Mecanismo asíncrono no bloqueante con retardo (2 a 4 segundos) mediante Promesa.
- Lógica de resolución configurable (`SUCCESS`, `FAILURE`, o forzado por bandera `forceFailure`).
- Cliente HTTP (`@nestjs/axios`) para notificar la resolución a la URL de callback del `refund-service`.

## Capabilities

### New Capabilities
- `payment-provider-simulation`: Simulación de pasarela externa de pagos con latencia no bloqueante, veredictos aleatorios/forzados y notificación vía Webhook.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Microservicio `fake-provider` en ejecución en el puerto 5000.
- Despacha llamadas hacia `refund-service` (puerto 4000).
