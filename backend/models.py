from sqlalchemy import Column, Integer, String, Date
from database import Base

class Patient(Base):
    """
    SQLAlchemy Model representing the 'patients' table in SQLite.
    Each attribute corresponds to a column in the database table.
    """
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    ward = Column(String(50), nullable=False)
    department = Column(String(50), nullable=False)
    doctor = Column(String(100), nullable=False)
    admission_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="Admitted")
