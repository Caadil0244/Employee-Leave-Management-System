from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class EmployeeCreate(BaseModel):
    employee_id: str = Field(min_length=2, max_length=50)
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    telephone: str = Field(min_length=5, max_length=20)
    department: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=6, max_length=100)
    role: UserRole = UserRole.EMPLOYEE


class EmployeeUpdate(BaseModel):
    employee_id: str | None = Field(default=None, min_length=2, max_length=50)
    name: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None
    telephone: str | None = Field(default=None, min_length=5, max_length=20)
    department: str | None = Field(default=None, min_length=2, max_length=100)
    password: str | None = Field(default=None, min_length=6, max_length=100)
    role: UserRole | None = None


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    name: str
    email: str
    telephone: str
    department: str
    role: str

    class Config:
        from_attributes = True
