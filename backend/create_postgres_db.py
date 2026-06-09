"""Create PostgreSQL role and database programmatically.

Usage:
  Set environment variables `PG_SUPERUSER`, `PG_SUPERPASS` (or provide via input),
  and `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `DATABASE_HOST`, `DATABASE_PORT`.

  Then run:
    python create_postgres_db.py

This script attempts to connect to the server using the superuser credentials
and will create the user and database if they do not already exist.
"""
import os
import sys
import psycopg
from psycopg import sql


def main():
    pg_superuser = os.getenv("PG_SUPERUSER") or input("Postgres superuser (e.g. postgres): ")
    pg_superpass = os.getenv("PG_SUPERPASS") or input("Postgres superuser password: ")

    db_user = os.getenv("DATABASE_USER", "elmsuser")
    db_pass = os.getenv("DATABASE_PASSWORD", "1234")
    db_name = os.getenv("DATABASE_NAME", "elms")
    db_host = os.getenv("DATABASE_HOST", "localhost")
    db_port = int(os.getenv("DATABASE_PORT", 5432))

    dsn_admin = f"host={db_host} port={db_port} dbname=postgres user={pg_superuser} password={pg_superpass}"

    try:
        with psycopg.connect(dsn_admin, autocommit=True) as conn:
            with conn.cursor() as cur:
                # Create role if not exists
                cur.execute("SELECT 1 FROM pg_roles WHERE rolname=%s", (db_user,))
                if cur.fetchone() is None:
                    print(f"Creating role '{db_user}'")
                    cur.execute(sql.SQL("CREATE ROLE {} LOGIN PASSWORD %s").format(sql.Identifier(db_user)), (db_pass,))
                else:
                    print(f"Role '{db_user}' already exists")

                # Create database if not exists
                cur.execute("SELECT 1 FROM pg_database WHERE datname=%s", (db_name,))
                if cur.fetchone() is None:
                    print(f"Creating database '{db_name}' owned by '{db_user}'")
                    cur.execute(sql.SQL("CREATE DATABASE {} OWNER {}").format(sql.Identifier(db_name), sql.Identifier(db_user)))
                else:
                    print(f"Database '{db_name}' already exists")

        print("Done. You can now run `python init_db.py` to create tables and seed data.")
    except Exception as e:
        print("Failed to create database/user:", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
