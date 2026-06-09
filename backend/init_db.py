"""Reset database, create tables, seed Admin / Manager / Employee."""

from app.db.base import Base
from app.db.seed import seed_users
from app.db.session import SessionLocal, engine
from app.models import leave, user  # noqa: F401


def main() -> None:
    print("Resetting database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        seed_users(db)
        users = db.query(user.User).all()
        print("\nDatabase ready! Users:")
        for u in users:
            print(f"  [{u.role.value}] {u.employee_id} | {u.name} | {u.email} | {u.department}")
        print("\nLogin credentials:")
        print("  Admin    -> admin@elms.com     / admin123")
        print("  Manager  -> manager@elms.com   / manager123")
        print("  Employee -> employee@elms.com  / employee123")
    finally:
        db.close()


if __name__ == "__main__":
    main()
