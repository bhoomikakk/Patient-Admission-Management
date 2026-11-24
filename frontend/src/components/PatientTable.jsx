import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Card,
  CardContent,
} from "@mui/material";

/**
 * Patient records display table.
 * Clean, minimal hospital dashboard styling with light grey borders and subtle chips.
 * Responsive design: Standard table on desktop/tablet, clean responsive card list on small screens.
 */
export default function PatientTable({
  patients,
  loading,
  onEdit,
  onDelete,
  onDischarge,
}) {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: "1px solid #E5E7EB",
          borderRadius: 1,
          backgroundColor: "#FFFFFF",
        }}
      >
        <CircularProgress size={36} sx={{ color: "#111827", mb: 2 }} />
        <Typography variant="body2" color="#6B7280">
          Loading patient records...
        </Typography>
      </Paper>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: "1px solid #E5E7EB",
          borderRadius: 1,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#111827", mb: 0.5 }}>
          No patient records found
        </Typography>
        <Typography variant="body2" color="#6B7280">
          Try adjusting your search or filters, or click "Add Patient" to register a new admission.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      {/* Desktop & Tablet Table View */}
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            backgroundColor: "#FFFFFF",
            overflowX: "auto",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <Table size="medium" aria-label="patient table">
            <TableHead sx={{ backgroundColor: "#F9FAFB" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "#374151", py: 1.5, whiteSpace: "nowrap" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Age / Gender</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Ward</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Doctor</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Admission Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => {
                const isAdmitted = patient.status === "Admitted";
                return (
                  <TableRow
                    key={patient.id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "#F9FAFB" },
                    }}
                  >
                    <TableCell sx={{ color: "#6B7280", fontWeight: 600, py: 1.75, whiteSpace: "nowrap" }}>
                      #{patient.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>
                      {patient.name}
                    </TableCell>
                    <TableCell sx={{ color: "#374151", whiteSpace: "nowrap" }}>
                      {patient.age} yrs • {patient.gender}
                    </TableCell>
                    <TableCell sx={{ color: "#374151", whiteSpace: "nowrap" }}>{patient.ward}</TableCell>
                    <TableCell sx={{ color: "#374151", whiteSpace: "nowrap" }}>{patient.department}</TableCell>
                    <TableCell sx={{ color: "#374151", whiteSpace: "nowrap" }}>{patient.doctor}</TableCell>
                    <TableCell sx={{ color: "#374151", whiteSpace: "nowrap" }}>{patient.admission_date}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Chip
                        size="small"
                        label={patient.status}
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: "24px",
                          backgroundColor: isAdmitted ? "#ECFDF5" : "#F3F4F6",
                          color: isAdmitted ? "#065F46" : "#4B5563",
                          border: `1px solid ${isAdmitted ? "#A7F3D0" : "#E5E7EB"}`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {/* Discharge Button */}
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={!isAdmitted}
                          onClick={() => onDischarge(patient)}
                          sx={{
                            fontSize: "0.75rem",
                            py: 0.5,
                            px: 1.5,
                            textTransform: "none",
                            fontWeight: 500,
                            color: isAdmitted ? "#059669" : "#9CA3AF",
                            borderColor: isAdmitted ? "#A7F3D0" : "#E5E7EB",
                            "&:hover": {
                              borderColor: "#059669",
                              backgroundColor: "#ECFDF5",
                            },
                          }}
                        >
                          {isAdmitted ? "Discharge" : "Discharged"}
                        </Button>

                        {/* Edit Button */}
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onEdit(patient)}
                          sx={{
                            fontSize: "0.75rem",
                            py: 0.5,
                            px: 1.5,
                            textTransform: "none",
                            fontWeight: 500,
                            color: "#374151",
                            borderColor: "#D1D5DB",
                            "&:hover": {
                              borderColor: "#9CA3AF",
                              backgroundColor: "#F9FAFB",
                            },
                          }}
                        >
                          Edit
                        </Button>

                        {/* Delete Button */}
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => onDelete(patient)}
                          sx={{
                            fontSize: "0.75rem",
                            py: 0.5,
                            px: 1.5,
                            textTransform: "none",
                            fontWeight: 500,
                            color: "#DC2626",
                            borderColor: "#FCA5A5",
                            "&:hover": {
                              borderColor: "#DC2626",
                              backgroundColor: "#FEF2F2",
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Mobile Card Layout */}
      <Box sx={{ display: { xs: "flex", sm: "none" }, flexDirection: "column", gap: 1.5 }}>
        {patients.map((patient) => {
          const isAdmitted = patient.status === "Admitted";
          return (
            <Card
              key={patient.id}
              elevation={0}
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: 1,
                backgroundColor: "#FFFFFF",
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#6B7280" }}>
                      ID #{patient.id}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#111827" }}>
                      {patient.name}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={patient.status}
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      backgroundColor: isAdmitted ? "#ECFDF5" : "#F3F4F6",
                      color: isAdmitted ? "#065F46" : "#4B5563",
                      border: `1px solid ${isAdmitted ? "#A7F3D0" : "#E5E7EB"}`,
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: "#4B5563", mb: 0.5 }}>
                  <strong>Age & Gender:</strong> {patient.age} yrs • {patient.gender}
                </Typography>
                <Typography variant="body2" sx={{ color: "#4B5563", mb: 0.5 }}>
                  <strong>Ward / Dept:</strong> {patient.ward} • {patient.department}
                </Typography>
                <Typography variant="body2" sx={{ color: "#4B5563", mb: 0.5 }}>
                  <strong>Doctor:</strong> {patient.doctor}
                </Typography>
                <Typography variant="body2" sx={{ color: "#4B5563", mb: 1.5 }}>
                  <strong>Admitted:</strong> {patient.admission_date}
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 1, borderTop: "1px solid #F3F4F6" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={!isAdmitted}
                    onClick={() => onDischarge(patient)}
                    sx={{
                      fontSize: "0.75rem",
                      textTransform: "none",
                      color: isAdmitted ? "#059669" : "#9CA3AF",
                      borderColor: isAdmitted ? "#A7F3D0" : "#E5E7EB",
                    }}
                  >
                    {isAdmitted ? "Discharge" : "Discharged"}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onEdit(patient)}
                    sx={{
                      fontSize: "0.75rem",
                      textTransform: "none",
                      color: "#374151",
                      borderColor: "#D1D5DB",
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onDelete(patient)}
                    sx={{
                      fontSize: "0.75rem",
                      textTransform: "none",
                      color: "#DC2626",
                      borderColor: "#FCA5A5",
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </>
  );
}
