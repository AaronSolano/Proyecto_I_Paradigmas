## Context

El entorno debe garantizar que la solución funcione de manera idéntica tanto en entornos locales de desarrollo como en la máquina del evaluador o en un VPS público. Véase `proposal.md` para motivación.

## Goals / Non-Goals

**Goals:**
- Separar capas con multi-stage Dockerfiles (`node:22-alpine`).
- Red puente `refund-network` en `docker-compose.yml`.
- Configurar `depends_on` con healthcheck o comprobación de arranque para PostgreSQL.
- Scripts multiplataforma (`run.sh` y `run.ps1`).

**Non-Goals:**
- Configuración de clústeres Kubernetes.
- Servidores web externos tipo NGINX reverse proxy (cada servicio expone directamente su puerto mapeado).

## Decisions

- **Imágenes Alpine:** Usar `node:22-alpine` para compilar y ejecutar, manteniendo imágenes ligeras y seguras.
- **Topología de red:**
  - `db`: PostgreSQL en red interna (puerto 5432 expuesto para debugging opcional).
  - `refund-service`: Expuesto en 4000.
  - `fake-provider`: Expuesto en 5000.
  - `frontend-dashboard`: Expuesto en 3000.

## Risks / Trade-offs

- **[Condición de carrera al arrancar Postgres]** → Mitigación: Configurar `restart: always` y reintento de conexión en TypeORM, o healthcheck en el servicio `db`.
