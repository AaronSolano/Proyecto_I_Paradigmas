## Purpose

Define la estructura de directorios, dependencias y scripts requeridos para inicializar y compilar de manera independiente los microservicios y la interfaz de usuario.

## ADDED Requirements

### Requirement: Estructura de servicios y soporte de compilación
El proyecto SHALL proveer tres directorios independientes (`refund-service`, `fake-provider`, `frontend-dashboard`) cada uno con su propio manifiesto de dependencias y configuración de compilación de TypeScript.

#### Scenario: Compilación independiente de microservicios
- **WHEN** un desarrollador ejecuta el script de compilación en `refund-service`, `fake-provider` o `frontend-dashboard`
- **THEN** cada proyecto compila sin errores de tipos ni dependencias no resueltas
