$root = $PSScriptRoot
Write-Host "=== Starting ELMS ===" -ForegroundColor Cyan

# Stop old processes on 8000 and 3000
foreach ($port in 8001, 3000) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 2

# Init database
Write-Host "Setting up database..." -ForegroundColor Yellow
Set-Location "$root\backend"
& .\venv\Scripts\python.exe init_db.py

# Start backend in new window
Write-Host "Starting BACKEND on http://127.0.0.1:8001" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; Write-Host 'BACKEND running on http://127.0.0.1:8001' -ForegroundColor Green; .\venv\Scripts\uvicorn.exe app.main:app --reload --host 127.0.0.1 --port 8001"

Start-Sleep -Seconds 4

# Test backend
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:8001/health" -TimeoutSec 5
    Write-Host "Backend OK: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Backend not responding yet. Wait a few seconds." -ForegroundColor Red
}

# Start frontend in new window
Write-Host "Starting FRONTEND on http://localhost:3000" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; npm run dev"

Write-Host ""
Write-Host "Open: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Login: admin@elms.com / admin123" -ForegroundColor Yellow
Write-Host "       manager@elms.com / manager123" -ForegroundColor Yellow
Write-Host "       employee@elms.com / employee123" -ForegroundColor Yellow
