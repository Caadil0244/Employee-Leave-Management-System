from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    employee_id: Optional[str] = Field(default=None, min_length=2, max_length=50)
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    telephone: str = Field(min_length=5, max_length=20)
    department: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=6, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    employee_id: str
    name: str
    email: str
    telephone: str
    department: str
    role: str

    class Config:
        from_attributes = True
