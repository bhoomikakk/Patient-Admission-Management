import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get the directory where this database.py file is located
# This ensures patients.db is stored consistently in the backend folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, "patients.db")
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{DB_FILE}")

# SQLite requires check_same_thread=False for multithreaded access in FastAPI
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# SessionLocal is the factory for creating new database sessions for requests
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our SQLAlchemy models
Base = declarative_base()

def get_db():
    """
    Dependency function for FastAPI routes.
    Yields a database session and ensures it closes after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
