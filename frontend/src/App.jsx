import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

import PatientTable from "./components/PatientTable";
import PatientForm from "./components/PatientForm";
import PatientFilters from "./components/PatientFilters";
import ConfirmDialog from "./components/ConfirmDialog";
import { patientService, DEFAULT_OPTIONS } from "./services/patientService";

export default function App() {
  // -------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------
  const [patients, setPatients] = useState([]);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [loading, setLoading] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [doctorFilter, setDoctorFilter] = useState("All");

  // Form Dialog state (Add / Edit)
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Delete Confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  // Notification / Snackbar state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "info"
  });

  // -------------------------------------------------------------
  // NOTIFICATION HELPER
  // -------------------------------------------------------------
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // -------------------------------------------------------------
  // DATA FETCHING
  // -------------------------------------------------------------
  // Load master dropdown options once on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await patientService.getOptions();
        setOptions(data);
      } catch (err) {
        console.error("Failed to load options, using fallback:", err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch patients list
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch latest patient records from backend API
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      const errMsg =
        err.response?.data?.detail || "Failed to load patient records. Ensure backend is running.";
      showNotification(errMsg, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Dynamic real-time search & multi-filter logic
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // 1. Search by name (case-insensitive)
      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        const nameMatch = (patient.name || "").toLowerCase().includes(query);
        if (!nameMatch) return false;
      }

      // 2. Ward filter
      if (wardFilter && wardFilter !== "All") {
        if (patient.ward !== wardFilter) return false;
      }

      // 3. Department filter
      if (deptFilter && deptFilter !== "All") {
        if (patient.department !== deptFilter) return false;
      }

      // 4. Doctor filter
      if (doctorFilter && doctorFilter !== "All") {
        if (patient.doctor !== doctorFilter) return false;
      }

      return true;
    });
  }, [patients, search, wardFilter, deptFilter, doctorFilter]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setWardFilter("All");
    setDeptFilter("All");
    setDoctorFilter("All");
  };

  // -------------------------------------------------------------
  // PATIENT ACTIONS (CREATE, UPDATE, DISCHARGE, DELETE)
  // -------------------------------------------------------------
  const handleOpenAddDialog = () => {
    setSelectedPatient(null);
    setFormOpen(true);
  };

  const handleOpenEditDialog = (patient) => {
    setSelectedPatient(patient);
    setFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedPatient) {
        // Edit Mode (PUT)
        await patientService.updatePatient(selectedPatient.id, formData);
        showNotification(`Patient "${formData.name}" was updated successfully.`);
      } else {
        // Add Mode (POST)
        await patientService.createPatient(formData);
        showNotification(`Patient "${formData.name}" was successfully admitted.`);
      }
      setFormOpen(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      const errDetail = err.response?.data?.detail;
      const message = Array.isArray(errDetail) ? errDetail.join(" | ") : (errDetail || "An error occurred.");
      showNotification(message, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDischargePatient = async (patient) => {
    try {
      await patientService.dischargePatient(patient.id);
      showNotification(`Patient "${patient.name}" has been discharged.`);
      fetchPatients();
    } catch (err) {
      const errDetail = err.response?.data?.detail || "Failed to discharge patient.";
      showNotification(errDetail, "error");
    }
  };

  const handleOpenDeleteDialog = (patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      await patientService.deletePatient(patientToDelete.id);
      showNotification(`Patient "${patientToDelete.name}" was removed.`);
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
      fetchPatients();
    } catch (err) {
      const errDetail = err.response?.data?.detail || "Failed to delete patient.";
      showNotification(errDetail, "error");
    }
  };

  // -------------------------------------------------------------
  // METRICS SUMMARY COUNTS
  // -------------------------------------------------------------
  const totalCount = patients.length;
  const admittedCount = useMemo(
    () => patients.filter((p) => p.status === "Admitted").length,
    [patients]
  );
  const dischargedCount = useMemo(
    () => patients.filter((p) => p.status === "Discharged").length,
    [patients]
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Top Application Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          color: "#111827",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: "#111827" }}>
              Patient Admission Management
            </Typography>
            <Typography variant="caption" sx={{ color: "#6B7280" }}>
              Manage hospital admissions and patient records
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleOpenAddDialog}
            sx={{
              backgroundColor: "#111827",
              color: "#FFFFFF",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              px: 2.5,
              py: 0.8,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#1F2937",
                boxShadow: "none",
              },
            }}
          >
            + Add Patient
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Metric Summary Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
            mb: 3,
          }}
        >
          {/* Total Patients */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: "1px solid #E5E7EB",
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Total Patients
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", mt: 0.5 }}>
              {totalCount}
            </Typography>
          </Paper>

          {/* Admitted Count */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: "1px solid #A7F3D0",
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="caption" sx={{ color: "#065F46", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Currently Admitted
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#059669", mt: 0.5 }}>
              {admittedCount}
            </Typography>
          </Paper>

          {/* Discharged Count */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: "1px solid #E5E7EB",
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="caption" sx={{ color: "#4B5563", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Discharged
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#374151", mt: 0.5 }}>
              {dischargedCount}
            </Typography>
          </Paper>
        </Box>

        {/* Search & Filters */}
        <PatientFilters
          search={search}
          onSearchChange={setSearch}
          wardFilter={wardFilter}
          onWardChange={setWardFilter}
          deptFilter={deptFilter}
          onDeptChange={setDeptFilter}
          doctorFilter={doctorFilter}
          onDoctorChange={setDoctorFilter}
          onResetFilters={handleResetFilters}
          options={options}
        />

        {/* Patient Table */}
        <PatientTable
          patients={filteredPatients}
          loading={loading}
          onEdit={handleOpenEditDialog}
          onDelete={handleOpenDeleteDialog}
          onDischarge={handleDischargePatient}
        />
      </Container>

      {/* Add / Edit Form Modal */}
      <PatientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        patient={selectedPatient}
        options={options}
        loading={formLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Patient Record"
        message={
          patientToDelete
            ? `Are you sure you want to permanently delete the admission record for "${patientToDelete.name}" (ID #${patientToDelete.id})? This action cannot be undone.`
            : "Are you sure you want to delete this patient record?"
        }
        confirmText="Confirm Delete"
        cancelText="Keep Record"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      {/* Toast Notification (Snackbar) */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor:
              notification.severity === "success"
                ? "#111827"
                : notification.severity === "error"
                ? "#DC2626"
                : undefined,
            color: "#FFFFFF",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
