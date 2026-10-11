## Purpose

Define los requerimientos de contenedorización multi-stage, comunicación sobre red privada de Docker y scripts de despliegue reproducible en un solo paso.

## ADDED Requirements

### Requirement: Contenedores multi-stage optimizados
El sistema SHALL proveer un archivo `Dockerfile` multi-stage por cada servicio para separar las etapas de compilación de las imágenes finales de ejecución, minimizando el peso de las imágenes.

#### Scenario: Construcción de imágenes Docker
- **WHEN** se ejecuta el comando `docker build` sobre cada servicio
- **THEN** la imagen final solo contiene los artefactos de producción y dependencias de runtime

### Requirement: Comunicación por red interna de Docker
El archivo `docker-compose.yml` SHALL definir una red interna dedicada donde los servicios se resuelvan entre sí por sus nombres de servicio (`db`, `refund-service`, `fake-provider`) sin emplear `localhost` en la comunicación entre contenedores.

#### Scenario: Resolución de nombres interna
- **WHEN** `refund-service` despacha una petición a `fake-provider` o a la base de datos `db`
- **THEN** las peticiones se completan exitosamente resolviendo el DNS interno provisto por Docker Compose

### Requirement: Ejecución reproducible en un solo comando
El proyecto SHALL incluir scripts `run.sh` y `run.ps1` que permitan construir y levantar todos los servicios automáticamente.

#### Scenario: Arranque de la solución
- **WHEN** un usuario ejecuta `./run.sh` o `.\run.ps1`
- **THEN** Docker Compose levanta todos los contenedores en orden correcto con sus puertos mapeados y dependencias resueltas
