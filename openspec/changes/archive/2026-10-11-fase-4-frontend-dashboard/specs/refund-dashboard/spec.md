## Purpose

Proporciona una interfaz gráfica de usuario reactiva para solicitar nuevos reembolsos, monitorear el progreso de las transacciones y verificar visualmente los estados de reintento.

## ADDED Requirements

### Requirement: Registro interactivo de órdenes de reembolso
El sistema frontend SHALL ofrecer un formulario accesible para registrar nuevas solicitudes de reembolso con montos e identificadores, incluyendo opción para simular escenarios de fallo.

#### Scenario: Creación de reembolso desde la interfaz
- **WHEN** el usuario completa el formulario y presiona el botón de confirmación de reembolso
- **THEN** la interfaz envía la solicitud al backend y muestra retroalimentación de registro pendiente

### Requirement: Visualización de estados y reintentos en tiempo real
El sistema frontend SHALL presentar una tabla interactiva con refresco periódico que detalle el estado de cada transacción, el contador de intentos y marcas temporales.

#### Scenario: Visualización diferenciada por estados
- **WHEN** la tabla renderiza las transacciones obtenidas del backend
- **THEN** cada transacción exhibe su estado actual con indicadores visuales diferenciados (`REFUND_PENDING`, `REFUND_PROCESSING`, `REFUNDED`, `REFUND_FAILED`) y el número de reintentos acumulados
