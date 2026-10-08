## Context

`refund-service` implementa el patrón Time Trigger sobre PostgreSQL utilizando `@nestjs/schedule` y TypeORM. La lógica debe prevenir llamadas concurrentes duplicadas y garantizar transiciones deterministas de estados. Véase `proposal.md` para motivación.

## Goals / Non-Goals

**Goals:**
- Tarea `@Cron('*/10 * * * * *')` segura ante solapamientos.
- Endpoint de creación con validación de entradas mediante DTOs.
- Recepción de Webhooks con manejo estricto de máximo 3 intentos.

**Non-Goals:**
- Comunicación directa con pasarelas de pago reales.
- Manejo de UI frontend.

## Decisions

- **Transición Atómica:** En el Job, seleccionar registros con `status = 'REFUND_PENDING' AND attempts < 3` y actualizar inmediatamente a `REFUND_PROCESSING`.
- **Inyección de Dependencias:** Uso de `HttpService` de `@nestjs/axios` para despachar la petición a `POST /provider/refunds`.
- **Configuración Dinámica:** Inyección de URL del proveedor mediante variable de entorno `PROVIDER_URL`.

## Risks / Trade-offs

- **[Fallo de red al llamar al proveedor]** → Mitigación: Capturar errores HTTP en el despacho del Job; si la llamada falla al enviarse, revertir a `REFUND_PENDING` incrementando el contador de intentos.
