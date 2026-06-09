from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import EmployeeCreate, EmployeeUpdate


def list_employees(db: Session) -> list[User]:
    return db.query(User).order_by(User.id).all()


def create_employee(db: Session, data: EmployeeCreate) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    if db.query(User).filter(User.employee_id == data.employee_id).first():
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    user = User(
        employee_id=data.employee_id,
        name=data.name,
        email=data.email,
        telephone=data.telephone,
        department=data.department,
        password_hash=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_employee(db: Session, employee_id: int, data: EmployeeUpdate) -> User:
    user = db.query(User).filter(User.id == employee_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")

    if data.employee_id and data.employee_id != user.employee_id:
        if db.query(User).filter(User.employee_id == data.employee_id).first():
            raise HTTPException(status_code=400, detail="Employee ID already exists")
        user.employee_id = data.employee_id

    if data.email and data.email != user.email:
        if db.query(User).filter(User.email == data.email).first():
            raise HTTPException(status_code=400, detail="Email already exists")
        user.email = data.email

    if data.name is not None:
        user.name = data.name
    if data.telephone is not None:
        user.telephone = data.telephone
    if data.department is not None:
        user.department = data.department
    if data.role is not None:
        user.role = data.role
    if data.password:
        user.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(user)
    return user


def delete_employee(db: Session, employee_id: int) -> None:
    user = db.query(User).filter(User.id == employee_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(user)
    db.commit()
