## Why

Se requiere establecer la base estructural y técnica del monorepo distribuido para alojar de forma independiente los tres servicios principales del proyecto (`refund-service`, `fake-provider` y `frontend-dashboard`), garantizando que cada uno cuente con su propia configuración de TypeScript, dependencias y scripts de ejecución.

## What Changes

- Configuración y estructura base de `refund-service` (NestJS).
- Configuración y estructura base de `fake-provider` (NestJS).
- Configuración y estructura base de `frontend-dashboard` (Next.js con Tailwind CSS).
- Configuración de dependencias esenciales (`package.json`, `tsconfig.json`).

## Capabilities

### New Capabilities
- `project-scaffold`: Estructura base de directorios y dependencias de compilación para los tres componentes del sistema.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Inicializa los tres directorios de aplicaciones en la raíz del proyecto.
- Permite la posterior instalación y compilación independiente de cada servicio.
