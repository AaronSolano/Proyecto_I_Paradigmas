## Purpose

Establece las directrices de recolección, ingestión y correlación de bitácoras de logs en un entorno centralizado con Grafana y Loki para monitorear el ciclo de vida completo de los reembolsos distribuidos, según los lineamientos del laboratorio de Monitoreo de Logs.

## ADDED Requirements

### Requirement: Trazabilidad y correlación de registros por transacción
Todos los servicios backend (`refund-service` y `fake-provider`) SHALL emitir bitácoras estructuradas que incluyan el identificador de la transacción (`transactionId`) y un prefijo identificador del componente emisor (`[REFUND-JOB]`, `[PROVIDER]`, `[WEBHOOK]`).

#### Scenario: Correlación de flujo completo en logs
- **WHEN** se consulta un `transactionId` específico en Grafana mediante LogQL (`{app=~"refund-service|fake-provider"} |= "<transactionId>"`)
- **THEN** los registros reflejan secuencialmente: creación del reembolso, despacho del job cron, recepción en el proveedor simulado y recepción del webhook con el estado final.

### Requirement: Ingestión directa de logs a Loki vía HTTP
Los servicios NestJS SHALL despachar sus logs a la API HTTP de Loki (`http://loki:3100/loki/api/v1/push`) usando labels de bajo cardinalidad (`app` y `env`), manteniendo simultáneamente la salida en consola (`stdout`).

#### Scenario: Fallback resiliente si Loki no responde
- **WHEN** el contenedor de Loki no está disponible o tarda en iniciar
- **THEN** los servicios continúan ejecutándose normalmente registrando en consola sin interrumpir los endpoints de la API ni los background jobs.

### Requirement: Panel visual en Grafana con aprovisionamiento automático
El entorno Docker Compose SHALL proveer una instancia preconfigurada de Grafana en el puerto 3001 autoconectada a Loki como fuente de datos predeterminada mediante aprovisionamiento declarativo (`datasources.yaml`).

#### Scenario: Visualización de eventos en vivo para defensa técnica
- **WHEN** un evaluador accede a `http://localhost:3001` durante la ejecución del sistema y entra a la sección *Explore*
- **THEN** el data source *Loki* aparece seleccionado por defecto y listo para ejecutar consultas LogQL sin requerir configuración manual de red o credenciales.
