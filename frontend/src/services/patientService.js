import axios from "axios";

// Environment-aware API base URL (Vercel deployment & local development)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Predefined fallbacks if API is offline or loading
export const DEFAULT_OPTIONS = {
  genders: ["Male", "Female", "Other"],
  wards: ["General Ward", "ICU", "Private Ward", "Emergency Ward"],
  departments: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine"],
  doctors: [
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
  ],
  statuses: ["Admitted", "Discharged"],
};

export const patientService = {
  // Fetch all patients with optional search & filters
  getPatients: async (params = {}) => {
    const response = await apiClient.get("/patients", { params });
    return response.data;
  },

  // Fetch single patient by ID
  getPatientById: async (id) => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  // Create a new patient
  createPatient: async (patientData) => {
    const response = await apiClient.post("/patients", patientData);
    return response.data;
  },

  // Update existing patient
  updatePatient: async (id, patientData) => {
    const response = await apiClient.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient
  deletePatient: async (id) => {
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  },

  // Discharge patient
  dischargePatient: async (id) => {
    const response = await apiClient.patch(`/patients/${id}/discharge`);
    return response.data;
  },

  // Get master dropdown options
  getOptions: async () => {
    try {
      const response = await apiClient.get("/options");
      return response.data;
    } catch {
      return DEFAULT_OPTIONS;
    }
  },
};
