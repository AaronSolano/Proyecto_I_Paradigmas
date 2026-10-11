## 1. Infraestructura de Observabilidad en Docker

- [x] 1.1 Agregar servicio `loki` (`grafana/loki:2.9.8`) en puerto 3100 dentro de `refund-network` en `docker-compose.yml`
- [x] 1.2 Agregar servicio `grafana` (`grafana/grafana:10.4.6`) en puerto host 3001 dentro de `docker-compose.yml`
- [x] 1.3 Crear `./grafana/provisioning/datasources/datasources.yaml` montado en el contenedor para autoconectar Loki (`http://loki:3100`)

## 2. Ingestión y Estandarización de Logs en NestJS

- [x] 2.1 Configurar logger en `refund-service` con salida dual (Consola + HTTP hacia `http://loki:3100/loki/api/v1/push`) y labels `{ app: "refund-service", env: "dev" }`
- [x] 2.2 Estandarizar bitácoras de `refund-service` con prefijos `[REFUND-JOB]` y `[WEBHOOK]` incluyendo `transactionId`
- [x] 2.3 Configurar logger en `fake-provider` con salida dual hacia Loki con label `{ app: "fake-provider", env: "dev" }`
- [x] 2.4 Estandarizar bitácoras de `fake-provider` con prefijo `[PROVIDER]` incluyendo `transactionId`

## 3. Validación y Consultas LogQL

- [ ] 3.1 Validar flujo extremo a extremo levantando el stack con `docker compose up`
- [x] 3.2 Documentar y verificar las consultas LogQL en `http://localhost:3001` (Explore) para filtrar transacciones durante la defensa en vivo
