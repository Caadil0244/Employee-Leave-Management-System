Write-Host "Setting up backend virtualenv, installing deps, and initializing DB..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\backend"

if (-Not (Test-Path .\venv)) {
    python -m venv venv
}
& .\venv\Scripts\python.exe -m pip install --upgrade pip
& .\venv\Scripts\python.exe -m pip install -r requirements.txt

Write-Host "Running init_db.py to create tables and seed users..." -ForegroundColor Cyan
& .\venv\Scripts\python.exe init_db.py

Write-Host "Done. If successful you should see seeded users printed above." -ForegroundColor Green
