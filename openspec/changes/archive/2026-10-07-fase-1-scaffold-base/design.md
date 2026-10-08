## Context

El proyecto requiere tres servicios desacoplados: dos aplicaciones de backend con NestJS y un cliente web con Next.js. Se busca una configuración sin monorepos pesados (como Turborepo o Nx), manteniendo carpetas independientes en la raíz con su respectivo `package.json`. Véase `proposal.md` para motivación.

## Goals / Non-Goals

**Goals:**
- Configuración minimalista y explícita para cada aplicación.
- Configurar TypeScript y decoradores requeridos por NestJS.
- Configurar Tailwind CSS en Next.js.

**Non-Goals:**
- Implementar la lógica de negocio o endpoints en esta fase.
- Orquestación en Docker (reservada para la Fase 5).

## Decisions

- **Estructura en raíz:** Carpetas `/refund-service`, `/fake-provider`, `/frontend-dashboard`.
- **Compatibilidad Node:** TypeScript 5.x y Node.js 22.x LTS.

## Risks / Trade-offs

- **[Duplicación de node_modules]** → Mitigación: Mantiene el aislamiento estricto de cada aplicación de cara al posterior empaquetado en Docker.
