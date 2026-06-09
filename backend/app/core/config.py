from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Allow either full SQLAlchemy URL or components for Postgres
    DATABASE_URL: str | None = None
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "elms"
    DATABASE_USER: str = "elmsuser"
    DATABASE_PASSWORD: str = "1234"

    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Admin
    ADMIN_EMAIL: str = "admin@elms.com"
    ADMIN_PASSWORD: str = "admin123"
    ADMIN_NAME: str = "System Admin"

    # Manager
    MANAGER_EMAIL: str = "manager@elms.com"
    MANAGER_PASSWORD: str = "manager123"
    MANAGER_NAME: str = "Team Manager"

    # Employee
    EMPLOYEE_EMAIL: str = "employee@elms.com"
    EMPLOYEE_PASSWORD: str = "employee123"
    EMPLOYEE_NAME: str = "John Employee"

    class Config:
        env_file = ".env"


settings = Settings()

# If a full DATABASE_URL isn't provided, construct one for Postgres
if not settings.DATABASE_URL:
    settings.DATABASE_URL = os.environ.get(
        "DATABASE_URL",
        f"postgresql+psycopg://{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}",
    )
