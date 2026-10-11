# Proyecto 1: Sistema de Reembolsos con Background Jobs y Webhooks

**Curso:** Paradigmas de Programación / Seguridad Informática  
**Docente:** Ing. Alex Villegas Carranza  
**Ponderación:** 20% (+ 2.5 pts bono por Observabilidad en Grafana)  
**Técnica:** Background Jobs / Time Triggers + Webhooks Asíncronos  
**Stack:** NestJS 10, Next.js 14, PostgreSQL 16, Docker Compose, Loki, Grafana  

---

## 📌 Descripción del Proyecto

Sistema distribuido y resiliente para la gestión de reembolsos automáticos tras cancelaciones de órdenes. Diseñado para desacoplar temporalmente la solicitud del usuario de la interacción con pasarelas bancarias externas de alta latencia o fallos transitorios de red, implementando:

1. **Desacoplamiento asíncrono:** La API responde de inmediato (`HTTP 201 Created`) en milisegundos con estado `REFUND_PENDING`.
2. **Background Job (Time Trigger):** Procesa por lotes las órdenes pendientes cada 10 segundos (`@Cron('*/10 * * * * *')`).
3. **Bloqueo preventivo atómico:** Transiciona las órdenes a `REFUND_PROCESSING` para evitar ejecuciones concurrentes duplicadas.
4. **Simulación de pasarela externa:** Microservicio desacoplado con retardo de 2 a 4 segundos y soporte para simular fallos (`forceFailure`).
5. **Comunicación por Webhook:** La pasarela notifica el resultado de vuelta de forma asíncrona sin necesidad de sondeo saliente continuo.
6. **Retry Pattern y Dead Letter State:** Hasta 3 reintentos automáticos tras fallos temporales. Al superar el umbral, la orden pasa a `REFUND_FAILED` para auditoría.
7. **Observabilidad con Grafana y Loki (Bono 2.5 pts):** Centralización de bitácoras estructuradas correlacionadas por `TRX:` y consultas LogQL listas para inspección en vivo.

---

## 🏗️ Arquitectura de Servicios

| Servicio | Contenedor | Puerto Host | Puerto Red Docker | Descripción |
|---|---|:---:|:---:|---|
| **Frontend** | `refund-frontend-dashboard` | `3000` | `3000` | Dashboard web en Next.js 14 con Tailwind CSS y polling reactivo (2.5s) |
| **Backend API** | `refund-service` | `4000` | `4000` | API REST, Background Job y receptor de Webhooks en NestJS |
| **Simulador Pasarela** | `refund-fake-provider` | `5000` | `5000` | Proveedor externo simulado con latencia no bloqueante |
| **Base de Datos** | `refund-db` | `5432` | `5432` | PostgreSQL 16 con healthcheck y persistencia de volumen |
| **Ingestor de Logs** | `refund-loki` | `3100` | `3100` | Receptor HTTP para logs estructurados de NestJS |
| **Observabilidad** | `refund-grafana` | `3001` | `3000` | Visualizador de logs y métricas con datasource provisionado |

---

## 🚀 Puesta en Marcha en un Solo Paso

### En Windows (PowerShell)
```powershell
.\run.ps1
```

### En Linux / macOS / WSL2 (Bash)
```bash
chmod +x run.sh
./run.sh
```

### Con Docker Compose directo
```bash
docker compose up -d --build
```

---

## 🌐 Enlaces de Acceso Local

* **Dashboard Web:** [http://localhost:3000](http://localhost:3000)
* **API de Reembolsos:** [http://localhost:4000/api/refunds](http://localhost:4000/api/refunds)
* **Pasarela Simulada:** [http://localhost:5000/provider/refunds](http://localhost:5000/provider/refunds)
* **Grafana (Explore):** [http://localhost:3001](http://localhost:3001) *(Usuario: `admin` / Clave: `admin`)*

