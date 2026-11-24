import re
from datetime import date
from typing import Optional, List
from pydantic import BaseModel, field_validator, ConfigDict

# Predefined valid options - kept in one clear place for easy maintenance
VALID_GENDERS = ["Male", "Female", "Other"]
VALID_WARDS = ["General Ward", "ICU", "Private Ward", "Emergency Ward"]
VALID_DEPARTMENTS = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine"]
VALID_DOCTORS = [
    "Dr. Aisha Patel",
    "Dr. Arjun Mehta",
    "Dr. Daniel Kim",
    "Dr. Grace Wilson",
    "Dr. Maya Chen",
    "Dr. Sarah Johnson",
    "Dr. Michael Chen",
    "Dr. Robert Williams",
    "Dr. Emily Davis",
    "Dr. James Wilson",
]
VALID_STATUSES = ["Admitted", "Discharged"]

class PatientBase(BaseModel):
    """
    Base Pydantic schema with shared fields and strict validations.
    """
    name: str
    age: int
    gender: str
    ward: str
    department: str
    doctor: str
    admission_date: date
    status: Optional[str] = "Admitted"

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        clean_name = v.strip()
        if not clean_name:
            raise ValueError("Patient name cannot be empty.")
        # Only alphabetic characters and spaces
        if not re.fullmatch(r"^[A-Za-z\s]+$", clean_name):
            raise ValueError("Patient name must contain only alphabetic characters and spaces (no numbers or special characters).")
        return clean_name

    @field_validator("age")
    @classmethod
    def validate_age(cls, v: int) -> int:
        if v is None:
            raise ValueError("Age is required.")
        if v < 0 or v > 120:
            raise ValueError("Age must be a valid integer between 0 and 120.")
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v: str) -> str:
        if v not in VALID_GENDERS:
            raise ValueError(f"Invalid gender '{v}'. Allowed options: {', '.join(VALID_GENDERS)}")
        return v

    @field_validator("ward")
    @classmethod
    def validate_ward(cls, v: str) -> str:
        if v not in VALID_WARDS:
            raise ValueError(f"Invalid ward '{v}'. Allowed options: {', '.join(VALID_WARDS)}")
        return v

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        if v not in VALID_DEPARTMENTS:
            raise ValueError(f"Invalid department '{v}'. Allowed options: {', '.join(VALID_DEPARTMENTS)}")
        return v

    @field_validator("doctor")
    @classmethod
    def validate_doctor(cls, v: str) -> str:
        if v not in VALID_DOCTORS:
            raise ValueError(f"Invalid doctor '{v}'. Allowed options: {', '.join(VALID_DOCTORS)}")
        return v

    @field_validator("admission_date")
    @classmethod
    def validate_admission_date(cls, v: date) -> date:
        today = date.today()
        if v > today:
            raise ValueError(f"Admission date cannot be in the future. Today is {today.isoformat()}.")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> str:
        if not v:
            return "Admitted"
        if v not in VALID_STATUSES:
            raise ValueError(f"Invalid status '{v}'. Allowed options: {', '.join(VALID_STATUSES)}")
        return v


class PatientCreate(PatientBase):
    """Schema for creating a new patient record."""
    pass


class PatientUpdate(PatientBase):
    """Schema for updating an existing patient record."""
    pass


class PatientResponse(PatientBase):
    """Schema for serializing patient data returned to the client."""
    id: int

    model_config = ConfigDict(from_attributes=True)


class PredefinedOptionsResponse(BaseModel):
    """Schema for returning the master lists of options to the frontend."""
    genders: List[str] = VALID_GENDERS
    wards: List[str] = VALID_WARDS
    departments: List[str] = VALID_DEPARTMENTS
    doctors: List[str] = VALID_DOCTORS
    statuses: List[str] = VALID_STATUSES
