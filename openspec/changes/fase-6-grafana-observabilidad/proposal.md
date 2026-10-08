## Why

Para optar por el bono académico de 2.5 puntos y asegurar la auditabilidad en vivo durante la defensa técnica, se requiere integrar observabilidad con Grafana y Loki, estandarizando los logs estructurados entre servicios mediante prefijos claros e identificadores de correlación (`transactionId`).

## What Changes

- Adición de contenedores Grafana y Loki en `docker-compose.yml`.
- Configuración de aprovisionamiento automático de data source Loki en Grafana.
- Estandarización de formato de logs en `refund-service` y `fake-provider` con prefijos `[REFUND-JOB]`, `[PROVIDER]`, `[WEBHOOK]`.
- Creación de dashboard o panel de exploración en Grafana para filtrar y correlacionar eventos por `transactionId`.

## Capabilities

### New Capabilities
- `observability-monitoring`: Monitoreo centralizado de logs, correlación por ID de transacción y visualización en dashboards de Grafana.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Agrega Grafana (puerto 3001) y Loki (puerto 3100) en `docker-compose.yml`.
- No afecta la lógica de negocio de los servicios principales.
