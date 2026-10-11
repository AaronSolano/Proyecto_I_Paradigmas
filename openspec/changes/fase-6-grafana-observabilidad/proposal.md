## Why

Para optar por el bono académico de 2.5 puntos y cumplir con los lineamientos del laboratorio de Monitoreo de Logs (Ing. Alex Villegas Carranza, UNA), se requiere integrar observabilidad centralizada con Grafana y Loki en el entorno local de Docker, estandarizando los logs estructurados entre microservicios mediante prefijos claros e identificadores de correlación (`transactionId`).

## What Changes

- Adición de contenedores oficiales Grafana (`grafana/grafana:10.4.6` en puerto 3001) y Loki (`grafana/loki:2.9.8` en puerto 3100) en `docker-compose.yml`.
- Configuración de aprovisionamiento estático (`datasources.yaml`) para autoconectar Loki en Grafana sin configuración manual durante la defensa técnica.
- Ingestión directa de logs estructurados desde NestJS (`refund-service` y `fake-provider`) hacia Loki vía HTTP, equivalente al enfoque `.NET -> Serilog -> Loki` provisto por la cátedra.
- Estandarización de formato de logs con prefijos contextuales `[REFUND-JOB]`, `[PROVIDER]`, `[WEBHOOK]` y correlación obligatoria por `transactionId`.
- Documentación de consultas LogQL listas para la demostración en vivo de 10 minutos.

## Capabilities

### New Capabilities
- `observability-monitoring`: Monitoreo centralizado de logs en tiempo real, correlación por ID de transacción y visualización en dashboards de Grafana.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Agrega Grafana (puerto host 3001) y Loki (puerto 3100) en `docker-compose.yml`.
- Se selecciona el enfoque local on-premise en Docker, descartando Grafana Cloud OTLP por ser un entorno de desarrollo y evaluación local.
- No modifica la lógica de negocio de los servicios, únicamente instrumenta la capa de logging.
