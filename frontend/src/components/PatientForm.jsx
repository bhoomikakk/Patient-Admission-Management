import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Typography,
} from "@mui/material";

// Helper to get local date formatted as YYYY-MM-DD (accounts for user's local timezone)
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialFormState = {
  name: "",
  age: "",
  gender: "",
  ward: "",
  department: "",
  doctor: "",
  admission_date: getTodayString(),
  status: "Admitted",
};

/**
 * Clean, spacious Dialog form for Adding and Editing patient records.
 * Strictly enforces:
 * - Age: Cannot be above 120 or negative (blocked in input and validated)
 * - Admission Date: Can only be dates up to today (future dates strictly blocked)
 */
export default function PatientForm({
  open,
  onClose,
  onSubmit,
  patient = null,
  options,
  loading = false,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const today = getTodayString();
    if (patient) {
      setFormData({
        name: patient.name || "",
        age: patient.age !== undefined ? String(patient.age) : "",
        gender: patient.gender || "",
        ward: patient.ward || "",
        department: patient.department || "",
        doctor: patient.doctor || "",
        admission_date: patient.admission_date || today,
        status: patient.status || "Admitted",
      });
    } else {
      setFormData({
        ...initialFormState,
        admission_date: today,
      });
    }
    setErrors({});
  }, [patient, open]);

  const handleChange = (field, value) => {
    // 1. Strict real-time check for Age: cannot take above 120
    if (field === "age") {
      if (value !== "") {
        const num = Number(value);
        if (isNaN(num)) return; // Reject non-numbers
        if (num > 120) {
          setErrors((prev) => ({
            ...prev,
            age: "Age must be between 0 and 120.",
          }));
          return;
        }
        if (num < 0) {
          setErrors((prev) => ({
            ...prev,
            age: "Age must be between 0 and 120.",
          }));
          return;
        }
      }
    }

    // 2. Strict real-time check for Admission Date: can only show/take up to today's date
    if (field === "admission_date") {
      const today = getTodayString();
      if (value && value > today) {
        setErrors((prev) => ({
          ...prev,
          admission_date: "Future dates are not allowed.",
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for field if valid
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Comprehensive Frontend Validation
  const validate = () => {
    const newErrors = {};
    const today = getTodayString();

    // 1. Name: required, letters and spaces only
    const trimmedName = (formData.name || "").trim();
    if (!trimmedName) {
      newErrors.name = "Patient name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      newErrors.name = "Name must contain letters and spaces only (no numbers or symbols).";
    }

    // 2. Age: required, integer between 0 and 120
    if (formData.age === "" || formData.age === null || formData.age === undefined) {
      newErrors.age = "Age is required.";
    } else {
      const parsedAge = Number(formData.age);
      if (!Number.isInteger(parsedAge)) {
        newErrors.age = "Age must be a whole number.";
      } else if (parsedAge < 0 || parsedAge > 120) {
        newErrors.age = "Age must be between 0 and 120.";
      }
    }

    // 3. Gender: required, select from list
    if (!formData.gender) {
      newErrors.gender = "Please select a gender.";
    } else if (!options.genders.includes(formData.gender)) {
      newErrors.gender = "Invalid gender selection.";
    }

    // 4. Ward: required, select from list
    if (!formData.ward) {
      newErrors.ward = "Please select a ward.";
    } else if (!options.wards.includes(formData.ward)) {
      newErrors.ward = "Invalid ward selection.";
    }

    // 5. Department: required, select from list
    if (!formData.department) {
      newErrors.department = "Please select a department.";
    } else if (!options.departments.includes(formData.department)) {
      newErrors.department = "Invalid department selection.";
    }

    // 6. Doctor: required, select from list
    if (!formData.doctor) {
      newErrors.doctor = "Please select a doctor.";
    } else if (!options.doctors.includes(formData.doctor)) {
      newErrors.doctor = "Invalid doctor selection.";
    }

    // 7. Admission date: required, cannot be a future date
    if (!formData.admission_date) {
      newErrors.admission_date = "Admission date is required.";
    } else if (formData.admission_date > today) {
      newErrors.admission_date = "Future dates are not allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      ward: formData.ward,
      department: formData.department,
      doctor: formData.doctor,
      admission_date: formData.admission_date,
      status: formData.status || "Admitted",
    };

    onSubmit(payload);
  };

  const isEditing = Boolean(patient);
  const todayDateString = getTodayString();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          border: "1px solid #E5E7EB",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.25rem",
          color: "#111827",
          borderBottom: "1px solid #E5E7EB",
          px: 3,
          py: 2,
        }}
      >
        {isEditing ? "Edit Patient Record" : "Add New Patient"}
        <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 400, mt: 0.25 }}>
          {isEditing
            ? "Update the details for this admitted patient."
            : "Fill in the required information to admit a new patient."}
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
              alignItems: "start",
            }}
          >
            {/* 1. Full Name */}
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
              <TextField
                fullWidth
                size="small"
                label="Full Name *"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* 2. Age (Strictly 0 to 120) */}
            <Box>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Age (0-120) *"
                placeholder="e.g. 35"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                error={Boolean(errors.age)}
                helperText={errors.age}
                inputProps={{
                  min: 0,
                  max: 120,
                  onKeyDown: (e) => {
                    // Disallow exponential, negative, or decimal symbols
                    if (["-", "+", "e", "E", "."].includes(e.key)) {
                      e.preventDefault();
                    }
                  },
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* 3. Gender */}
            <Box>
              <FormControl fullWidth size="small" error={Boolean(errors.gender)}>
                <InputLabel id="gender-select-label" shrink>
                  Gender *
                </InputLabel>
                <Select
                  labelId="gender-select-label"
                  label="Gender *"
                  notched
                  displayEmpty
                  value={formData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    <em>Select gender</em>
                  </MenuItem>
                  {options.genders.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
                {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
              </FormControl>
            </Box>

            {/* 4. Ward */}
            <Box>
              <FormControl fullWidth size="small" error={Boolean(errors.ward)}>
                <InputLabel id="ward-select-label" shrink>
                  Ward *
                </InputLabel>
                <Select
                  labelId="ward-select-label"
                  label="Ward *"
                  notched
                  displayEmpty
                  value={formData.ward}
                  onChange={(e) => handleChange("ward", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    <em>Select hospital ward</em>
                  </MenuItem>
                  {options.wards.map((w) => (
                    <MenuItem key={w} value={w}>
                      {w}
                    </MenuItem>
                  ))}
                </Select>
                {errors.ward && <FormHelperText>{errors.ward}</FormHelperText>}
              </FormControl>
            </Box>

            {/* 5. Department */}
            <Box>
              <FormControl fullWidth size="small" error={Boolean(errors.department)}>
                <InputLabel id="dept-select-label" shrink>
                  Department *
                </InputLabel>
                <Select
                  labelId="dept-select-label"
                  label="Department *"
                  notched
                  displayEmpty
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    <em>Select department</em>
                  </MenuItem>
                  {options.departments.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
                {errors.department && <FormHelperText>{errors.department}</FormHelperText>}
              </FormControl>
            </Box>

            {/* 6. Doctor */}
            <Box>
              <FormControl fullWidth size="small" error={Boolean(errors.doctor)}>
                <InputLabel id="doctor-select-label" shrink>
                  Doctor *
                </InputLabel>
                <Select
                  labelId="doctor-select-label"
                  label="Doctor *"
                  notched
                  displayEmpty
                  value={formData.doctor}
                  onChange={(e) => handleChange("doctor", e.target.value)}
                >
                  <MenuItem value="" disabled>
                    <em>Select assigned doctor</em>
                  </MenuItem>
                  {options.doctors.map((doc) => (
                    <MenuItem key={doc} value={doc}>
                      {doc}
                    </MenuItem>
                  ))}
                </Select>
                {errors.doctor && <FormHelperText>{errors.doctor}</FormHelperText>}
              </FormControl>
            </Box>

            {/* 7. Admission Date */}
            <Box>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Admission Date *"
                value={formData.admission_date}
                onChange={(e) => handleChange("admission_date", e.target.value)}
                error={Boolean(errors.admission_date)}
                helperText={errors.admission_date}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  max: todayDateString,
                }}
                slotProps={{
                  htmlInput: {
                    max: todayDateString,
                  },
                }}
              />
            </Box>

            {/* 8. Status */}
            <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-select-label" shrink>
                  Status
                </InputLabel>
                <Select
                  labelId="status-select-label"
                  label="Status"
                  notched
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <MenuItem value="Admitted">Admitted</MenuItem>
                  <MenuItem value="Discharged">Discharged</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #E5E7EB" }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
            sx={{
              color: "#374151",
              borderColor: "#D1D5DB",
              textTransform: "none",
              px: 2.5,
              "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#111827",
              color: "#FFFFFF",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { backgroundColor: "#1F2937" },
            }}
          >
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Patient"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
