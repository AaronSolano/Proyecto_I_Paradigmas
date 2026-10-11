## Why

Para evaluar y presentar la solución distribuida en vivo, se requiere una interfaz web en Next.js con Tailwind CSS que permita generar fácilmente transacciones de reembolso y visualizar de forma reactiva y clara las transiciones de estado y los reintentos.

## What Changes

- Creación de página principal en Next.js (App Router, puerto 3000).
- Formulario interactivo para registrar reembolsos con montos aleatorios o personalizados y casilla de verificación para forzar fallos en el proveedor.
- Tabla reactiva de reembolsos con refresco automático/polling cada 2.5 segundos.
- Badges visuales coloreados según el estado (`REFUND_PENDING`, `REFUND_PROCESSING`, `REFUNDED`, `REFUND_FAILED`).
- Visualización de número de reintentos e historial de último intento.

## Capabilities

### New Capabilities
- `refund-dashboard`: Interfaz gráfica interactiva para emitir reembolsos y monitorear transiciones de estado en tiempo real.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Servicio frontend en el puerto 3000.
- Consume `POST /api/refunds` y `GET /api/refunds` de `refund-service`.
