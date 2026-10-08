## Why

Los requerimientos no funcionales (`RNF-02`, `RNF-03`, `RNF-04`) exigen que cada microservicio cuente con su propio `Dockerfile` multi-stage optimizado, que la solución se orqueste en `docker-compose.yml` resolviendo la comunicación exclusivamente por la red interna de Docker sin `localhost`, y que existan scripts `run.sh` y `run.ps1` para clonar y ejecutar todo en un solo paso.

## What Changes

- `Dockerfile` multi-stage para `refund-service`.
- `Dockerfile` multi-stage para `fake-provider`.
- `Dockerfile` multi-stage para `frontend-dashboard`.
- `docker-compose.yml` configurando base de datos PostgreSQL, los 3 servicios y red interna compartida `refund-network`.
- Scripts de automatización y arranque reproducible `run.sh` (Linux/macOS) y `run.ps1` (Windows PowerShell).

## Capabilities

### New Capabilities
- `container-orchestration`: Orquestación multi-contenedor reproducible, red aislada Docker y scripts de ejecución en un solo paso.

### Modified Capabilities
<!-- No modified capabilities -->

## Impact

- Permite levantar toda la infraestructura y microservicios con un único comando (`docker compose up --build`).
- No requiere instalar Node ni Postgres en la máquina anfitriona para ejecutar la solución.
