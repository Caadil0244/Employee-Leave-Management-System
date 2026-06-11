# Employee Leave Management System (ELMS)

This repository contains a simple Employee Leave Management System built with:
- Backend: FastAPI, SQLAlchemy
- Frontend: Next.js + Tailwind + React
- Database: PostgreSQL

Quick Start (Docker Postgres)

1. Start Postgres with Docker:

```powershell
docker compose up -d
```


2. Backend (Windows PowerShell):

```powershell
cd backend
# create and activate venv (example)
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# copy example env and edit if needed
copy .env.example .env
# initialize database and seed (development only)
python init_db.py
# run server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

3. Frontend:

```powershell
# from repo root
npm install --prefix frontend
# optionally change port
$env:PORT=3001; npm run dev --prefix frontend
# or default
npm run dev --prefix frontend
```

4. Login (dev seeds created by `init_db.py`):
- Admin: admin@elms.com / admin123
- Manager: manager@elms.com / manager123
- Employee: employee@elms.com / employee123

Configuration

- Backend env example: `backend/.env.example`. Copy to `backend/.env` and customise.
- Frontend env example: `frontend/.env.example`.

Notes & Recommendations

- SECRET_KEY in `backend/.env` must be changed for production.
- If using Docker Postgres, avoid binding to host 5432 if you already run Postgres locally.
- For schema migrations use Alembic (not included) instead of `init_db.py` in production.

If you want, I can:
- Add a `scripts/` folder to automate dev start (PowerShell + Bash helpers).
- Create a GitHub Actions workflow to run lint/build on push.
- Scaffold Alembic for migrations.

Tell me which of these you'd like next.
