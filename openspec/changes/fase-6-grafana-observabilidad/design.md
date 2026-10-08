## Context

Para la defensa técnica de 10 minutos se requiere demostrar en vivo la trazabilidad de los reembolsos. El bono de 2.5 puntos evalúa la bitácora de errores, alertas y seguimiento extremo a extremo. Véase `proposal.md` para motivación.

## Goals / Non-Goals

**Goals:**
- Configuración de Grafana y Loki en Docker Compose mediante provisión estática (`provisioning/datasources`).
- Estandarización de `Logger` de NestJS con prefijos en corchetes.
- Configurar puerto accesible (3001 para no colisionar con Next.js en 3000).

**Non-Goals:**
- Configuración de alertas por correo electrónico o Slack.
- Instrumentación pesada con OpenTelemetry (Loki + logs correlacionados satisface plenamente el objetivo del laboratorio).

## Decisions

- **Logging nativo estructurado:** Usar `new Logger('REFUND-JOB')`, `new Logger('PROVIDER')`, etc., en NestJS para generar logs en stdout con colores y timestamps.
- **Docker Logging Driver hacia Loki:** Driver Loki o Promtail ligero para ingestión directa.

## Risks / Trade-offs

- **[Consumo de memoria adicional de contenedores]** → Mitigación: Loki y Grafana están desacoplados; el sistema base funciona independientemente incluso si Grafana se detiene.
