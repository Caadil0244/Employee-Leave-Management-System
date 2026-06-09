Write-Host "=== ELMS Startup ===" -ForegroundColor Cyan

# Free ports 3000 and 8000
foreach ($port in 3000, 8000) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        Write-Host "Stopping process on port $port (PID $($c.OwningProcess))..."
        Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

Start-Sleep -Seconds 2

$root = $PSScriptRoot

# Start backend
Write-Host "`nStarting backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; .\venv\Scripts\uvicorn.exe app.main:app --reload --host 127.0.0.1 --port 8000"

Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend on http://localhost:3000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; npm run dev"

Write-Host "`nDone! Open http://localhost:3000" -ForegroundColor Yellow
Write-Host "Login: admin@elms.com / admin123" -ForegroundColor Yellow
