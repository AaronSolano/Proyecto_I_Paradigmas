#!/usr/bin/env bash
set -euo pipefail

# Colores informativos
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}  Sistema de Reembolsos Automáticos - Despliegue Docker${NC}"
echo -e "${BLUE}======================================================${NC}"

# 1. Comprobación de instalación de Docker
if ! command -v docker &> /dev/null; then
  echo -e "${RED}[ERROR] Docker no está instalado en el sistema.${NC}"
  echo "Por favor, instala Docker antes de continuar: https://docs.docker.com/get-docker/"
  exit 1
fi

# 2. Comprobación del daemon de Docker
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}[ERROR] El daemon de Docker no está en ejecución.${NC}"
  echo "Asegúrate de haber iniciado Docker Desktop o el servicio dockerd."
  exit 1
fi

# 3. Detección de Docker Compose
COMPOSE_CMD=""
if docker compose version &> /dev/null; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
else
  echo -e "${RED}[ERROR] Ni 'docker compose' ni 'docker-compose' están disponibles.${NC}"
  exit 1
fi

echo -e "${GREEN}[OK] Docker y Compose verificados exitosamente.${NC}"
echo -e "${YELLOW}Descargando imagenes de Docker Hub y levantando contenedores...${NC}"
echo ""
echo -e "Servicios expuestos al finalizar el arranque:"
echo -e " - ${BLUE}Frontend Dashboard:${NC}    http://localhost:3000"
echo -e " - ${BLUE}Refund Service API:${NC}    http://localhost:4000/api"
echo -e " - ${BLUE}Fake Provider:${NC}         http://localhost:5000/provider"
echo -e " - ${BLUE}PostgreSQL:${NC}            localhost:5432"
echo -e " - ${BLUE}Grafana Observability:${NC} http://localhost:3001 (admin/admin)"
echo -e " - ${BLUE}Loki Logs API:${NC}         http://localhost:3100"
echo ""

# 4. Descarga las imagenes publicadas y levanta el stack sin reconstruir.
$COMPOSE_CMD pull
exec $COMPOSE_CMD up -d "$@"
