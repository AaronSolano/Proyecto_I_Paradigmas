## 1. Componentes Visuales y Formulario

- [ ] 1.1 Crear encabezado y panel de control con métricas en `frontend-dashboard`
- [ ] 1.2 Implementar componente de formulario para generar reembolsos con ID aleatorio y toggle de simulación de fallos

## 2. Tabla Reactiva y Polling

- [ ] 2.1 Implementar componente de tabla con columnas: ID, Monto, Estado, Reintentos, Último Intento, ID Proveedor
- [ ] 2.2 Diseñar badges de estado (`REFUND_PENDING` amarillo, `REFUND_PROCESSING` azul, `REFUNDED` verde, `REFUND_FAILED` rojo)
- [ ] 2.3 Implementar consulta periódica automática (polling cada 2.5 segundos) a `GET /api/refunds`
