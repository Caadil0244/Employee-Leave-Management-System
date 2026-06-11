# Employee Leave Management System

A simple web application for managing employee leave requests with role-based access for Admin, Manager, and Employee.

**What it does**
- Allows employees to apply for leave and view their leave history.
- Lets managers review and approve or reject leave requests for their team.
- Provides admin tools to manage users and seed initial demo accounts.
- Exposes a backend API with health checks and role-based authentication.

**Key features**
- Role-based authentication (Admin, Manager, Employee)
- Apply, approve, and track leave requests
- User and employee management endpoints
- Database seeding and reset utilities for development
- CORS-enabled FastAPI backend with a simple health endpoint

**Technologies used**
- Backend: Python, FastAPI, Uvicorn
- Database: PostgreSQL, SQLAlchemy
- Auth & Security: Pydantic, python-jose (JWT), passlib/bcrypt
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Dev / tooling: Docker / docker-compose (optional), scripts and PowerShell helpers

If you want, I can also add a quick-start section with exact commands to run the backend and frontend.

**Quick Start**
Follow these steps (PowerShell) from the repository root.

- Backend (Python, FastAPI):

```powershell
# activate existing venv (or create one in `backend`)
& .\.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt

# create Postgres DB/user if needed (you will be prompted for superuser creds)
python create_postgres_db.py

# initialize schema and seed demo users (drops and recreates tables)
python init_db.py

# run the backend server (Hot reload)
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- Frontend (Next.js):

```powershell
cd frontend
npm install
npm run dev
# frontend runs at http://localhost:3100 by default
```

- Alternatively, run helpers from repo root:

```powershell
# start backend via provided script
.\start-backend.ps1

# start postgres (if you use local script)
.\start-postgres.ps1
```

Health-check: http://127.0.0.1:8000/health

Default seeded accounts are printed by `init_db.py` (admin/manager/employee).
