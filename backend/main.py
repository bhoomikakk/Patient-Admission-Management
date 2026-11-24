from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
from database import engine, get_db

# Create SQLite tables on startup
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI(
    title="Patient Admission Management System API",
    description="REST API for managing hospital patient admissions, records, and discharges.",
    version="1.0.0"
)

# Enable CORS for frontend communication
# Allows local React dev server and production deployments (e.g., Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom Validation Error Handler for beginner-friendly, clean error messages
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    """
    Format Pydantic validation errors into clear, human-readable error messages.
    """
    error_messages = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        msg = err.get("msg", "Invalid value")
        # Strip ValueError prefix if present
        if "Value error, " in msg:
            msg = msg.replace("Value error, ", "")
        error_messages.append(f"{field}: {msg}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": error_messages[0] if len(error_messages) == 1 else error_messages}
    )


# -------------------------------------------------------------
# 1. ROOT & OPTIONS ENDPOINTS
# -------------------------------------------------------------
@app.get("/", tags=["Health Check"])
def read_root():
    return {
        "message": "Patient Admission Management System API is running smoothly",
        "status": "online"
    }


@app.get("/options", response_model=schemas.PredefinedOptionsResponse, tags=["Options"])
def get_predefined_options():
    """
    Returns predefined options for dropdowns (Genders, Wards, Departments, Doctors, Statuses).
    Keeps frontend and backend aligned with a single source of truth.
    """
    return schemas.PredefinedOptionsResponse()


# -------------------------------------------------------------
# 2. PATIENT CRUD ENDPOINTS
# -------------------------------------------------------------
@app.get("/patients", response_model=List[schemas.PatientResponse], tags=["Patients"])
def get_all_patients(
    search: Optional[str] = Query(None, description="Case-insensitive search by patient name"),
    ward: Optional[str] = Query(None, description="Filter by ward"),
    department: Optional[str] = Query(None, description="Filter by department"),
    doctor: Optional[str] = Query(None, description="Filter by doctor"),
    status: Optional[str] = Query(None, description="Filter by status (Admitted/Discharged)"),
    db: Session = Depends(get_db)
):
    """
    Fetch all patients with optional filtering and search.
    """
    query = db.query(models.Patient)

    # Search by patient name (case-insensitive)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(models.Patient.name.ilike(search_pattern))

    # Apply filters if provided
    if ward and ward.strip() and ward != "All":
        query = query.filter(models.Patient.ward == ward.strip())
    if department and department.strip() and department != "All":
        query = query.filter(models.Patient.department == department.strip())
    if doctor and doctor.strip() and doctor != "All":
        query = query.filter(models.Patient.doctor == doctor.strip())
    if status and status.strip() and status != "All":
        query = query.filter(models.Patient.status == status.strip())

    # Return ordered with newest patients first
    return query.order_by(models.Patient.id.desc()).all()


@app.get("/patients/{patient_id}", response_model=schemas.PatientResponse, tags=["Patients"])
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """
    Fetch a single patient record by ID.
    """
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )
    return patient


@app.post("/patients", response_model=schemas.PatientResponse, status_code=status.HTTP_201_CREATED, tags=["Patients"])
def create_patient(patient_in: schemas.PatientCreate, db: Session = Depends(get_db)):
    """
    Create a new patient record in SQLite.
    Validates name, age, dropdown fields, and admission date.
    """
    db_patient = models.Patient(
        name=patient_in.name,
        age=patient_in.age,
        gender=patient_in.gender,
        ward=patient_in.ward,
        department=patient_in.department,
        doctor=patient_in.doctor,
        admission_date=patient_in.admission_date,
        status=patient_in.status or "Admitted"
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@app.put("/patients/{patient_id}", response_model=schemas.PatientResponse, tags=["Patients"])
def update_patient(patient_id: int, patient_in: schemas.PatientUpdate, db: Session = Depends(get_db)):
    """
    Update an existing patient's details.
    """
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )

    # Update patient fields
    db_patient.name = patient_in.name
    db_patient.age = patient_in.age
    db_patient.gender = patient_in.gender
    db_patient.ward = patient_in.ward
    db_patient.department = patient_in.department
    db_patient.doctor = patient_in.doctor
    db_patient.admission_date = patient_in.admission_date
    if patient_in.status:
        db_patient.status = patient_in.status

    db.commit()
    db.refresh(db_patient)
    return db_patient


@app.delete("/patients/{patient_id}", tags=["Patients"])
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    """
    Delete a patient record permanently from SQLite database.
    """
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )
    
    db.delete(db_patient)
    db.commit()
    return {"message": f"Patient with ID {patient_id} was successfully deleted.", "id": patient_id}


@app.patch("/patients/{patient_id}/discharge", response_model=schemas.PatientResponse, tags=["Patients"])
def discharge_patient(patient_id: int, db: Session = Depends(get_db)):
    """
    Discharge an admitted patient:
    - Changes status to 'Discharged'.
    - Does not delete the record.
    - Prevents discharging a patient who is already discharged.
    """
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )

    if db_patient.status == "Discharged":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Patient '{db_patient.name}' is already discharged."
        )

    db_patient.status = "Discharged"
    db.commit()
    db.refresh(db_patient)
    return db_patient
