## Context

El frontend debe permitir al profesor o evaluador observar sin esfuerzo la evolución de las transacciones (desde `REFUND_PENDING` a `REFUND_PROCESSING` y finalmente `REFUNDED` o `REFUND_FAILED`). Se construye sobre Next.js con Tailwind CSS para una experiencia de usuario moderna y limpia. Véase `proposal.md` para motivación.

## Goals / Non-Goals

**Goals:**
- UI atractiva y funcional con Tailwind CSS.
- Polling cada 2.5s mediante `setInterval` en Client Component de React para actualización en tiempo real sin recargar la página.
- Formulario con botón de acción rápida para generar IDs y montos de prueba con un solo clic.

**Non-Goals:**
- Autenticación o roles de usuario.
- Gestión de pagos o checkout del usuario final.

## Decisions

- **Client Components:** Usar un componente principal `'use client'` que maneje el estado de la lista y el formulario para simplificar el ciclo de vida del polling reactivo.
- **Configuración de API Backend:** Variable de entorno `NEXT_PUBLIC_API_URL` que apunte al `refund-service`.

## Risks / Trade-offs

- **[CORS entre Frontend y Backend en local]** → Mitigación: Habilitar `app.enableCors()` en el `main.ts` de `refund-service`.
