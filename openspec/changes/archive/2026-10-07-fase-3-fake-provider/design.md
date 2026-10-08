## Context

El microservicio `fake-provider` simula proveedores reales (como Stripe, PayPal o Bac Credomatic). Debe responder de inmediato al llamador con código 202 Accepted y ejecutar la lógica pesada o diferida fuera del ciclo síncrono de la petición inicial. Véase `proposal.md` para motivación.

## Goals / Non-Goals

**Goals:**
- Desacoplar la petición HTTP del envío del Webhook.
- Simular latencia mediante `setTimeout` encapsulado en una Promesa.
- Permitir forzar el fallo con la propiedad `forceFailure: true` en el payload para facilitar las pruebas del ciclo de reintentos.

**Non-Goals:**
- Almacenamiento persistente en base de datos en este servicio (es un simulador sin estado).
- Procesar tarjetas de crédito o pasarelas reales.

## Decisions

- **Simulación asíncrona:** Una función asíncrona invocada sin `await` dentro del controlador ejecuta el retardo de 2 a 4 segundos y luego dispara la petición HTTP POST hacia `webhookCallbackUrl`.
- **Estructura del payload de Webhook:** `{ transactionId, providerRefundId, status, message }`.

## Risks / Trade-offs

- **[Pérdida de tareas si el contenedor se apaga durante el delay]** → Mitigación: Comportamiento aceptable para un simulador de laboratorio; el `refund-service` considerará el reintento si no recibe el Webhook.
