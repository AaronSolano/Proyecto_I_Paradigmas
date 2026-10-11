# Guía de Observabilidad y Monitoreo con Grafana y Loki

Esta guía documenta la infraestructura de observabilidad local configurada para el **Proyecto I: Reembolsos Automáticos con Background Jobs** (Paradigmas de Programación / Seguridad Informática - Ing. Alex Villegas Carranza).

---

## 1. Arquitectura de Observabilidad Local

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARQUITECTURA DE LOGS                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌─────────────────────┐       ┌──────────────────────┐               │
│   │   refund-service    │       │    fake-provider     │               │
│   │   (NestJS - 4000)   │       │   (NestJS - 5000)    │               │
│   └──────────┬──────────┘       └──────────┬───────────┘               │
│              │ Logs estructurados          │ Logs estructurados        │
│              │ [REFUND-JOB] [WEBHOOK]      │ [PROVIDER]                │
│              └──────────────┬──────────────┘                           │
│                             │ HTTP Push                                │
│                             ▼                                          │
│                  ┌──────────────────────┐                              │
│                  │     Loki (3100)      │ ◄── Ingestión de bitácoras   │
│                  └──────────┬───────────┘                              │
│                             │ Datasource declarativo                   │
│                             ▼                                          │
│                  ┌──────────────────────┐                              │
│                  │    Grafana (3001)    │ ◄── http://localhost:3001    │
│                  └──────────────────────┘     (admin / admin)          │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

- **Loki (`grafana/loki:2.9.8`):** Expuesto en el puerto `3100`. Recibe logs directamente vía HTTP en `/loki/api/v1/push`.
- **Grafana (`grafana/grafana:10.4.6`):** Expuesto en `http://localhost:3001` (para evitar colisión con el puerto 3000 del dashboard de Next.js).
- **Datasource Provisioning:** Autoconecta Loki (`http://loki:3100`) mediante `./grafana/provisioning/datasources/datasources.yaml`.
- **LokiLogger en NestJS:** Escribe simultáneamente en consola (`stdout`) y despacha asíncronamente a Loki con labels estables (`app` y `env`).

---

## 2. Puesta en Marcha

Para iniciar todo el ecosistema (Base de datos, Backend, Proveedor, Frontend y Observabilidad):

```bash
docker compose up -d --build
```

Verificar que los contenedores estén corriendo:
```bash
docker compose ps
```

---

## 3. Acceso a Grafana

1. Abre en tu navegador: **[http://localhost:3001](http://localhost:3001)**
2. Credenciales por defecto:
   - **Usuario:** `admin`
   - **Contraseña:** `admin`
3. Ve al menú lateral izquierdo y selecciona **Explore** (ícono de brújula).
4. El Data Source **Loki** ya estará seleccionado por defecto.

---

## 4. Consultas LogQL para la Demostración en Vivo (Defensa Técnica)

### A. Trazabilidad Extremo a Extremo de una Transacción
Muestra el ciclo de vida completo de un reembolso a través de todos los microservicios:
```logql
{app=~"refund-service|fake-provider"} |= "TRX:"
```
Para filtrar una transacción específica (ej. `TRX: 550e8400-e29b-41d4-a716-446655440000`):
```logql
{app=~"refund-service|fake-provider"} |= "550e8400-e29b-41d4-a716-446655440000"
```

Secuencia visible en Grafana:
1. `[REFUND-JOB]` Transacción registrada exitosamente en estado `REFUND_PENDING`.
2. `[REFUND-JOB]` Despachando reembolso al proveedor (Intento 1/3).
3. `[PROVIDER]` Solicitud recibida. Simulando retardo asíncrono.
4. `[PROVIDER]` Veredicto calculado y despacho de Webhook.
5. `[WEBHOOK]` Notificación recibida y transición terminal a `REFUNDED` o reintento.

### B. Monitoreo Exclusivo de Background Jobs
```logql
{app="refund-service", context="REFUND-JOB"}
```

### C. Monitoreo Exclusivo de Notificaciones Webhook
```logql
{app="refund-service", context="WEBHOOK"}
```

### D. Monitoreo de Pasarela Simulada (Provider)
```logql
{app="fake-provider", context="PROVIDER"}
```

### E. Detección Inmediata de Errores y Reintentos
```logql
{app=~"refund-service|fake-provider"} |= "ERROR"
```
O filtrando advertencias de reintento:
```logql
{app="refund-service"} |= "falló temporalmente"
```
