## 1. Configuración de Grafana y Loki

- [ ] 1.1 Configurar definiciones de contenedores para Loki y Grafana en `docker-compose.yml`
- [ ] 1.2 Crear archivo de aprovisionamiento de fuente de datos `datasources.yaml` para autoconectar Loki en Grafana

## 2. Estandarización de Logs y Correlación

- [ ] 2.1 Configurar logs con contexto y prefijos `[REFUND-JOB]` y `[WEBHOOK]` en `refund-service`
- [ ] 2.2 Configurar logs con contexto y prefijos `[PROVIDER]` en `fake-provider`
- [ ] 2.3 Crear o documentar consulta LogQL en Grafana para filtrar por `transactionId` durante la demo
