from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User, UserRole

SEED_USERS = [
    {
        "employee_id": "EMP-001",
        "email": settings.ADMIN_EMAIL,
        "password": settings.ADMIN_PASSWORD,
        "name": settings.ADMIN_NAME,
        "telephone": "0611000001",
        "department": "Administration",
        "role": UserRole.ADMIN,
    },
    {
        "employee_id": "EMP-002",
        "email": settings.MANAGER_EMAIL,
        "password": settings.MANAGER_PASSWORD,
        "name": settings.MANAGER_NAME,
        "telephone": "0611000002",
        "department": "Human Resources",
        "role": UserRole.MANAGER,
    },
    {
        "employee_id": "EMP-003",
        "email": settings.EMPLOYEE_EMAIL,
        "password": settings.EMPLOYEE_PASSWORD,
        "name": settings.EMPLOYEE_NAME,
        "telephone": "0611000003",
        "department": "IT",
        "role": UserRole.EMPLOYEE,
    },
]


def seed_users(db: Session) -> None:
    for data in SEED_USERS:
        user = db.query(User).filter(User.email == data["email"]).first()
        if user:
            user.employee_id = data["employee_id"]
            user.name = data["name"]
            user.telephone = data["telephone"]
            user.department = data["department"]
            user.role = data["role"]
            user.password_hash = hash_password(data["password"])
        else:
            user = User(
                employee_id=data["employee_id"],
                name=data["name"],
                email=data["email"],
                telephone=data["telephone"],
                department=data["department"],
                password_hash=hash_password(data["password"]),
                role=data["role"],
            )
            db.add(user)
    db.commit()


def seed_admin(db: Session) -> None:
    seed_users(db)
