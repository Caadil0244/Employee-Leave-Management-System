# How to Run ELMS

This project has **two folders** — do NOT run `npm` from the wrong place.

## Quick Start (2 terminals)

### Terminal 1 — Backend (API)
```powershell
cd backend
.\venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```
API: http://localhost:8000

### Terminal 2 — Frontend (UI)
```powershell
cd frontend
npm run dev
```
App: http://localhost:3000

**OR from project root:**
```powershell
npm run dev
```

---

## Login Credentials (3 Roles)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@elms.com` | `admin123` |
| **Manager** | `manager@elms.com` | `manager123` |
| **Employee** | `employee@elms.com` | `employee123` |

### Reset database & users
```powershell
cd backend
.\venv\Scripts\python init_db.py
```

To create your own account → go to **Register** page (creates Employee role).
