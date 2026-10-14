param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$ComposeArgs
)

$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Sistema de Reembolsos Automáticos - Despliegue Docker" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Comprobación de instalación de Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Docker no está instalado en este equipo." -ForegroundColor Red
    Write-Host "Por favor, instala Docker Desktop antes de continuar: https://docs.docker.com/desktop/setup/install/windows-install/"
    exit 1
}

# 2. Comprobación de ejecución del Daemon de Docker
$dockerInfo = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] El servicio de Docker (daemon) no está en ejecución." -ForegroundColor Red
    Write-Host "Inicia Docker Desktop en Windows y vuelve a ejecutar este script." -ForegroundColor Yellow
    exit 1
}

# 3. Detección del comando Compose
$composeCmd = ""
$composeVersion = docker compose version 2>&1
if ($LASTEXITCODE -eq 0) {
    $composeCmd = "docker-compose-v2"
} elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    $composeCmd = "docker-compose-v1"
} else {
    Write-Host "[ERROR] Ni 'docker compose' ni 'docker-compose' se encuentran disponibles." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Docker y Docker Compose detectados correctamente." -ForegroundColor Green
Write-Host "Descargando imagenes de Docker Hub y levantando contenedores..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Servicios expuestos al finalizar el arranque:" -ForegroundColor White
Write-Host " - Frontend Dashboard:    http://localhost:3000" -ForegroundColor Cyan
Write-Host " - Refund Service API:    http://localhost:4000/api" -ForegroundColor Cyan
Write-Host " - Fake Provider:         http://localhost:5000/provider" -ForegroundColor Cyan
Write-Host " - PostgreSQL:            localhost:5432" -ForegroundColor Cyan
Write-Host " - Grafana Observability: http://localhost:3001 (admin/admin)" -ForegroundColor Cyan
Write-Host " - Loki Logs API:         http://localhost:3100" -ForegroundColor Cyan
Write-Host ""

# 4. Descarga las imagenes publicadas y levanta el stack sin reconstruir.
if ($composeCmd -eq "docker-compose-v2") {
    & docker compose pull
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    $finalArgs = @("up", "-d")
    if ($ComposeArgs) { $finalArgs += $ComposeArgs }
    & docker compose @finalArgs
} else {
    & docker-compose pull
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    $finalArgs = @("up", "-d")
    if ($ComposeArgs) { $finalArgs += $ComposeArgs }
    & docker-compose @finalArgs
}
