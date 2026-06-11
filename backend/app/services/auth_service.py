from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, RegisterRequest
import re


def _generate_employee_id(db: Session) -> str:
    # Find existing EMP-### ids and increment the max
    users = db.query(User.employee_id).all()
    max_num = 0
    for (eid,) in users:
        if not eid:
            continue
        m = re.search(r"EMP-(\d+)$", eid)
        if m:
            n = int(m.group(1))
            if n > max_num:
                max_num = n
    next_num = max_num + 1
    return f"EMP-{next_num:03d}"


def register_user(db: Session, data: RegisterRequest) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    # Auto-generate employee_id when not provided
    eid = data.employee_id
    if not eid:
        eid = _generate_employee_id(db)
    else:
        if db.query(User).filter(User.employee_id == eid).first():
            raise HTTPException(status_code=400, detail="Employee ID already exists")

    user = User(
        employee_id=eid,
        name=data.name,
        email=data.email,
        telephone=data.telephone,
        department=data.department,
        password_hash=hash_password(data.password),
        role=UserRole.EMPLOYEE,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(db: Session, data: LoginRequest) -> str:
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return create_access_token(str(user.id))


def get_profile(user: User) -> User:
    return user
