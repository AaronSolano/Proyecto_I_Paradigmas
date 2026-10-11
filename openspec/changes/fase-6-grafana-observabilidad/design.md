## Context

Para la defensa técnica de 10 minutos se requiere demostrar en vivo la trazabilidad de los reembolsos. El bono de 2.5 puntos y el Laboratorio de Monitoreo de Logs (Ing. Alex Villegas Carranza, M.Sc.) evalúan la observabilidad mediante el stack de Grafana y Loki. El profesor presentó dos alternativas en clase y en el material entregado:
1. **Camino Local con Docker (Seleccionado):** Levantar contenedores de Loki y Grafana en `docker-compose.yml`, enviando logs estructurados directamente vía HTTP.
2. **Camino Cloud con OpenTelemetry / OTLP (Descartado):** Usar Grafana Cloud SaaS con endpoints OTLP y tokens `glc_...`. Se descarta porque el proyecto corre 100% en local con Docker Compose y no debe depender de conectividad a internet ni cuentas externas en la defensa.

## Goals / Non-Goals

**Goals:**
- Configuración de contenedores `loki` (2.9.8) y `grafana` (10.4.6) en `docker-compose.yml`.
- Aprovisionamiento estático mediante `./grafana/provisioning/datasources/datasources.yaml` para autoconectar Loki en Grafana al arrancar.
- Puerto de Grafana mapeado a `3001:3000` para evitar colisión con `frontend-dashboard` (Next.js en puerto 3000).
- Envío de logs directo desde NestJS (`refund-service` y `fake-provider`) hacia `http://loki:3100/loki/api/v1/push` usando `winston-loki` (equivalente en Node/NestJS al `Serilog.Sinks.Grafana.Loki` de .NET explicado por el profesor).
- Estandarización de prefijos (`[REFUND-JOB]`, `[PROVIDER]`, `[WEBHOOK]`) y correlación por `transactionId`.

**Non-Goals:**
- Despliegue en Grafana Cloud o configuración de credenciales OTLP (`grafana-otlp`).
- Instalación de plugins de Docker daemon para Windows (evita fallos de permisos al usar ingestión por HTTP en la app).
- Alertas externas por correo o Slack (fuera del alcance del laboratorio).

## Decisions

- **Ingestión directa vía HTTP (Winston + Loki):** En lugar de Promtail o Docker Logging Drivers (que en Docker Desktop para Windows requieren plugins daemon con permisos especiales), se adopta el "Camino simple" del profesor adaptado a NestJS: la aplicación usa Winston con el transport `winston-loki` que despacha JSON estructurado asíncronamente al endpoint HTTP de Loki (`http://loki:3100/loki/api/v1/push`).
- **Labels estables y bajo cardinalidad:** Siguiendo las buenas prácticas del profesor, se asignan labels fijos `{ app: "refund-service", env: "dev" }` y `{ app: "fake-provider", env: "dev" }`. El `transactionId` viaja en el cuerpo del mensaje para permitir búsquedas LogQL sin degradar los índices de Loki.
- **Datasource provisionado por volumen:** Se monta `./grafana/provisioning/datasources` dentro del contenedor de Grafana para que al iniciar ya tenga Loki como fuente por defecto sin requerir intervención manual.

## Risks / Trade-offs

- **[Loki no disponible al iniciar el servicio]** → Mitigación: El transport de Winston maneja reintentos y degrada gracefully imprimiendo en `Console` sin tirar el proceso de la app si Loki tarda en responder.
- **[Consumo de memoria de contenedores]** → Mitigación: Loki 2.9.8 y Grafana 10.4.6 en configuración minimal consumen menos de 150MB combinados.

