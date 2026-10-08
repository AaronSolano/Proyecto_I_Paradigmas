## Purpose

Establece las directrices de recolección y correlación de registros de logs en un entorno centralizado con Grafana y Loki para monitorear el flujo distribuido de reembolsos.

## ADDED Requirements

### Requirement: Trazabilidad y correlación de registros por transacción
Todos los servicios del backend SHALL emitir bitácoras formateadas que incluyan el identificador de la transacción y un prefijo identificador del componente emisor (`[REFUND-JOB]`, `[PROVIDER]`, `[WEBHOOK]`).

#### Scenario: Correlación de flujo completo en logs
- **WHEN** se consulta un `transactionId` específico en la herramienta de observabilidad
- **THEN** los registros reflejan secuencialmente la creación, el despacho del cron, la recepción en el proveedor y la respuesta en el webhook

### Requirement: Panel visual en Grafana para monitoreo en vivo
El entorno SHALL proveer una instancia preconfigurada de Grafana conectada a la fuente de logs que permita visualizar y filtrar eventos en tiempo real.

#### Scenario: Visualización de eventos en vivo
- **WHEN** un evaluador accede al puerto de Grafana durante la ejecución del sistema
- **THEN** se visualiza el flujo de logs en tiempo real sin requerir configuración manual previa de data sources
