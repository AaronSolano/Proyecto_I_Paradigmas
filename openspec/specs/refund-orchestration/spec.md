# refund-orchestration Specification

## Purpose

Proporciona la orquestación asíncrona y resiliente para el ciclo de vida de transacciones de reembolso mediante tareas en segundo plano periódicas y recepción de webhooks con política de reintentos.

## Requirements

### Requirement: Registro de transacciones pendientes
El sistema SHALL permitir el registro de una nueva transacción de reembolso mediante un endpoint HTTP REST y persistirla en estado pendiente sin bloquear la respuesta al cliente.

#### Scenario: Registro exitoso de reembolso
- **WHEN** un cliente envía una petición POST a `/api/refunds` con `transactionId` y `amount` válidos
- **THEN** el sistema persiste la transacción con estado `REFUND_PENDING`, contador de intentos en 0, y responde con código HTTP 201 Created

### Requirement: Ejecución periódica del Background Job
El sistema SHALL ejecutar una tarea periódica cada 10 segundos que identifique las transacciones en estado `REFUND_PENDING` con menos de 3 intentos y despache la solicitud al proveedor externo.

#### Scenario: Procesamiento de lote pendiente
- **WHEN** el temporizador del background job despierta y existen registros con estado `REFUND_PENDING` e intentos menores a 3
- **THEN** el sistema actualiza de manera atómica el estado a `REFUND_PROCESSING` y despacha la petición HTTP al endpoint del proveedor de pagos externo

### Requirement: Recepción de Webhooks y reintentos
El sistema SHALL procesar notificaciones asíncronas de resultados de reembolso vía Webhook, actualizando el estado a completado si fue exitoso o reintentando hasta 3 veces si ocurrió un fallo temporal.

#### Scenario: Notificación exitosa recibida
- **WHEN** el endpoint `/api/webhooks/refund` recibe un payload con estado `SUCCESS` y un identificador del proveedor
- **THEN** el sistema transiciona la transacción a `REFUNDED` y almacena el `providerRefundId`

#### Scenario: Fallo temporal con intentos disponibles
- **WHEN** el endpoint `/api/webhooks/refund` recibe un payload con estado `FAILURE` y el contador de intentos actual es menor a 2
- **THEN** el sistema incrementa el contador de intentos en 1, actualiza la fecha de último intento y transiciona el estado de vuelta a `REFUND_PENDING`

#### Scenario: Fallo definitivo tras agotar reintentos
- **WHEN** el endpoint `/api/webhooks/refund` recibe un payload con estado `FAILURE` y el contador de intentos alcanza o supera el límite de 3
- **THEN** el sistema transiciona de forma permanente la transacción al estado `REFUND_FAILED`
