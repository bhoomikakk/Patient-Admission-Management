# Patient Admission Management System (PAMS)
### Software Engineer Intern – Round 1 Task (DScribe | Unriddle Technologies Pvt Ltd)

A clean, minimal, and professional full-stack hospital admission dashboard designed for hospital staff to manage patient admissions, records, search, filters, updates, and discharges seamlessly.

---

## 1. Compliance Checklist (Strict PDF Requirements)

| Requirement from Task PDF | Status | How It Is Implemented |
|---|---|---|
| **Frontend: React.js only** | Verified | Built using pure React (Vite) + JavaScript (MUI) |
| **Backend: Any language EXCEPT Node.js** | Verified | Built using Python FastAPI with Pydantic validation |
| **Database: Data must stay saved after server restart** | Verified | SQLite disk database (`patients.db`) persists across server reboots |
| **1. Add a patient** | Verified | Modal dialog with complete two-tier validation |
| **2. View list of all patients** | Verified | Responsive data table with ID, Name, Age/Gender, Ward, Dept, Doctor, Date, Status |
| **3. Filter by Ward, Department and Doctor** | Verified | Combined multi-dropdown filter controls |
| **4. Search patients by name** | Verified | Real-time case-insensitive search by patient name |
| **5. Edit a patient** | Verified | Form pre-populates existing data and updates record |
| **6. Delete a patient (with confirmation)** | Verified | Guarded by MUI Confirmation Dialog |
| **7. Mark a patient as Discharged** | Verified | `PATCH /patients/{id}/discharge` marks status; prevents re-discharging |
| **8. Clean design on mobile, tab, and desktop** | Verified | Desktop/tablet table view + mobile card view |
| **Validation: Name (letters only)** | Verified | Regex `/^[A-Za-z\s]+$/` on both client & server |
| **Validation: Age (0-120)** | Verified | Number validation between 0 and 120 |
| **Validation: Gender, Ward, Dept, Doctor (from list)** | Verified | Predefined select lists on both client & server |
| **Validation: Admission Date (cannot be future date)** | Verified | Compared against current date on client & server |
| **Backend rejects wrong data with clear error** | Verified | FastAPI HTTP 422 JSON response with field error detail |
| **No passwords or secret keys in GitHub** | Verified | `.gitignore` configured; zero sensitive keys committed |
| **Login/signup is NOT required** | Verified | No unnecessary auth barriers |

---

## 2. Submission Instructions

As specified in the task prompt:
- **How to submit**: Email your GitHub repository link and live deployed link to:
  - `pramod@dscribe.in`
  - `suhasm@dscribe.in`
- **Email Subject Line**: `[Your Full Name] - Software Engineer Intern Round 1 Task Submission`
- **Include in Email**:
  1. Public GitHub repo link
  2. Live working link (frontend + backend connected)
  3. Short summary mentioning the tech stack (React.js + Python FastAPI + SQLite)

---

## 2. Key Features

- **Add Patient**: Dialog modal with real-time validation (alphabetical name check, 0-120 age check, dropdown selections, past/present date enforcement).
- **View Patients**: Clean Material UI table displaying Patient ID, Name, Age/Gender, Ward, Department, Doctor, Admission Date, and Status.
- **Real-Time Summary Metrics**: Instant counts for Total Patients, Currently Admitted, and Discharged patients.
- **Search Patients**: Instant, case-insensitive search by patient name.
- **Multi-Filter Support**: Combined filtering by Ward, Department, and Doctor.
- **Edit Patient**: Pre-populates patient details in the modal dialog, validates changes, and saves updates.
- **Discharge Patient**: Quick single-click discharge action that updates patient status to `Discharged` and locks further discharges.
- **Delete Patient**: Guarded by a confirmation dialog to prevent accidental data loss.
- **Two-Tier Validation**: Full validation on both React frontend and FastAPI backend (using Pydantic validators).
- **Responsive Design**: Adapts between a desktop/tablet data table and clean mobile summary cards.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React.js (Vite) | Fast, modular component-based user interface |
| **UI Library** | Material UI (MUI v6) | Pre-built, accessible, minimal hospital components |
| **Icons** | Material UI Icons | Clean UI indicators |
| **HTTP Client** | Axios | Frontend-to-backend REST API requests |
| **Backend Framework** | Python FastAPI | High-performance, self-documenting REST API |
| **Data Validation** | Pydantic v2 | Server-side schema and rule enforcement |
| **Database ORM** | SQLAlchemy 2.0 | Clean database queries and table mappings |
| **Database** | SQLite | Lightweight persistent file-based SQL database |

---

## 4. Project Folder Structure

```
PAMS/
├── backend/
│   ├── database.py         # SQLite engine, session maker, get_db dependency
│   ├── models.py           # SQLAlchemy Patient table model
│   ├── schemas.py          # Pydantic schemas & field validators
│   ├── main.py             # FastAPI endpoints, CORS, exception handlers
│   ├── test_api.py         # Automated API & validation test suite
│   ├── requirements.txt    # Python dependencies
│   └── patients.db         # Persistent SQLite database file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx   # Delete confirmation modal
│   │   │   ├── PatientFilters.jsx  # Search bar & dropdown filters
│   │   │   ├── PatientForm.jsx     # Add/Edit patient modal dialog
│   │   │   └── PatientTable.jsx    # Responsive patient table & cards
│   │   ├── services/
│   │   │   └── patientService.js   # Centralized Axios API calls
│   │   ├── App.jsx                 # Dashboard state, metrics, & layout
│   │   ├── index.css               # Clean baseline stylesheet
│   │   └── main.jsx                # React application root
│   ├── index.html                  # HTML template with Roboto font
│   ├── package.json                # Frontend dependencies & scripts
│   └── vite.config.js              # Vite configuration
└── README.md                       # Comprehensive project documentation
```

---

## 5. Prerequisites

Before running the project locally, ensure you have installed:
1. **Python 3.9+** (Check via `python --version`)
2. **Node.js 18+ & npm** (Check via `node --version` and `npm --version`)

---

## 6. Backend Setup & Run Instructions

### Step 1: Open Terminal & Navigate to `backend`
```bash
cd backend
```

### Step 2: (Optional but recommended) Create and Activate Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Backend Server
```bash
uvicorn main:app --reload --port 8000
```
- The API will be live at: **http://127.0.0.1:8000**
- Interactive Swagger API docs: **http://127.0.0.1:8000/docs**
- ReDoc alternative docs: **http://127.0.0.1:8000/redoc**

### Step 5: Run Automated Tests
```bash
python test_api.py
```

---

## 7. Frontend Setup & Run Instructions

### Step 1: Open a New Terminal & Navigate to `frontend`
```bash
cd frontend
```

### Step 2: Install Frontend Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 3: Run the Development Server
```bash
npm run dev
```
- The frontend will be live at: **http://localhost:5173** (or the port displayed in your terminal).

---

## 8. REST API Endpoints

| Method | Endpoint | Description | Request Body | Response Code |
|---|---|---|---|---|
| `GET` | `/` | API Health Check | None | 200 OK |
| `GET` | `/options` | Predefined dropdown choices | None | 200 OK |
| `GET` | `/patients` | Get all patients (with search/filter query params) | None | 200 OK |
| `GET` | `/patients/{id}` | Get single patient by ID | None | 200 OK / 404 |
| `POST` | `/patients` | Register new patient admission | Patient JSON | 201 Created / 422 |
| `PUT` | `/patients/{id}` | Update patient details | Patient JSON | 200 OK / 404 / 422 |
| `DELETE` | `/patients/{id}` | Permanently remove patient record | None | 200 OK / 404 |
| `PATCH` | `/patients/{id}/discharge` | Mark patient as Discharged | None | 200 OK / 400 / 404 |

### Query Parameters for `GET /patients`
- `search` (string): Case-insensitive match on patient name.
- `ward` (string): Filter by ward name.
- `department` (string): Filter by department name.
- `doctor` (string): Filter by assigned doctor.
- `status` (string): Filter by `Admitted` or `Discharged`.

---

## 9. Validation Rules

Validation is strictly enforced on **both** the React frontend and the FastAPI backend:

| Field | Rule / Constraint | Error Behavior |
|---|---|---|
| **Name** | Required; alphabetic characters and spaces only | Rejects numbers, special characters, and empty strings |
| **Age** | Required; whole integer between `0` and `120` | Rejects decimals, negatives, and ages > 120 |
| **Gender** | Required; one of `["Male", "Female", "Other"]` | Rejects unrecognized options |
| **Ward** | Required; `["General Ward", "ICU", "Private Ward", "Emergency Ward"]` | Rejects unlisted wards |
| **Department** | Required; `["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine"]` | Rejects unlisted departments |
| **Doctor** | Required; must match predefined doctor registry | Rejects unauthorized entries |
| **Admission Date** | Required; cannot be a future date | Compared against server `date.today()` |
| **Status** | `Admitted` or `Discharged` (defaults to `Admitted`) | Cannot discharge already-discharged patient |

---

## 10. Database Persistence

- SQLite stores all data in a single file: `backend/patients.db`.
- Because SQLite writes data directly to disk, all patient admission records remain safe and intact even after stopping or restarting the backend server.
- The path is resolved dynamically using Python's `os.path.abspath(__file__)` to guarantee consistent persistence regardless of the current working directory.

---

## 11. Deployment Guide

### Backend Deployment (Render)
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com/), create a new **Web Service**.
3. Select your repository and configure:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
4. Add a **Persistent Disk** on Render mounted at `/data` and set environment variable:
   - `DATABASE_URL=sqlite:////data/patients.db`
5. Note your Render URL (e.g., `https://pams-backend.onrender.com`).

### Frontend Deployment (Vercel)
1. In [Vercel Dashboard](https://vercel.com/), create a new project and connect the repository.
2. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://pams-backend.onrender.com`)
4. Click **Deploy**.

### Live URLs (Placeholders)
- **Frontend App**: `https://patient-admission-management.vercel.app` *(update with your live link)*
- **Backend API**: `https://patient-admission-management.onrender.com` *(update with your live link)*

---

## 12. Screenshots Section

*(Place screenshots of Dashboard, Add Patient Dialog, Filtered View, and Mobile Responsive Cards here)*
- `docs/screenshots/dashboard.png`
- `docs/screenshots/add_patient.png`
- `docs/screenshots/filters.png`
