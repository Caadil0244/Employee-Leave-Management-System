Write-Host "Starting Postgres via Docker Compose..." -ForegroundColor Cyan
if (-Not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker not found. Install Docker Desktop and try again."
    exit 1
}
docker-compose up -d db
Write-Host "Postgres started (container: db)." -ForegroundColor Green
Write-Host "Postgres user: elmsuser  password: 1234  database: elms" -ForegroundColor Yellow
