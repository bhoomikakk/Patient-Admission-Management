import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

/**
 * Search and Filter bar component.
 * Allows searching by patient name and filtering by Ward, Department, and Doctor.
 * Uses CSS Grid so all inputs have ample readable width and never truncate or squish.
 */
export default function PatientFilters({
  search,
  onSearchChange,
  wardFilter,
  onWardChange,
  deptFilter,
  onDeptChange,
  doctorFilter,
  onDoctorChange,
  onResetFilters,
  options,
}) {
  const hasActiveFilters =
    Boolean(search) || wardFilter !== "All" || deptFilter !== "All" || doctorFilter !== "All";

  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        p: 2.5,
        borderRadius: 2,
        border: "1px solid #E5E7EB",
        mb: 3,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "2fr 1.3fr 1.3fr 1.3fr auto",
          },
          gap: 2,
          alignItems: "center",
        }}
      >
        {/* Search Field */}
        <Box>
          <TextField
            fullWidth
            size="small"
            label="Search by patient name"
            variant="outlined"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type patient name..."
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FAFAFA",
                "& fieldset": { borderColor: "#E5E7EB" },
                "&:hover fieldset": { borderColor: "#9CA3AF" },
                "&.Mui-focused fieldset": { borderColor: "#111827" },
              },
            }}
          />
        </Box>

        {/* Ward Filter */}
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel shrink id="ward-filter-label" sx={{ pointerEvents: "none" }}>
              Ward
            </InputLabel>
            <Select
              labelId="ward-filter-label"
              label="Ward"
              value={wardFilter}
              onChange={(e) => onWardChange(e.target.value)}
              displayEmpty
              notched
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 280 },
                },
              }}
              sx={{
                backgroundColor: "#FAFAFA",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9CA3AF" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#111827" },
              }}
            >
              <MenuItem value="All">All Wards</MenuItem>
              {options.wards.map((ward) => (
                <MenuItem key={ward} value={ward}>
                  {ward}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Department Filter */}
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel shrink id="dept-filter-label" sx={{ pointerEvents: "none" }}>
              Department
            </InputLabel>
            <Select
              labelId="dept-filter-label"
              label="Department"
              value={deptFilter}
              onChange={(e) => onDeptChange(e.target.value)}
              displayEmpty
              notched
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 280 },
                },
              }}
              sx={{
                backgroundColor: "#FAFAFA",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9CA3AF" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#111827" },
              }}
            >
              <MenuItem value="All">All Departments</MenuItem>
              {options.departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Doctor Filter */}
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel shrink id="doctor-filter-label" sx={{ pointerEvents: "none" }}>
              Doctor
            </InputLabel>
            <Select
              labelId="doctor-filter-label"
              label="Doctor"
              value={doctorFilter}
              onChange={(e) => onDoctorChange(e.target.value)}
              displayEmpty
              notched
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 280 },
                },
              }}
              sx={{
                backgroundColor: "#FAFAFA",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9CA3AF" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#111827" },
              }}
            >
              <MenuItem value="All">All Doctors</MenuItem>
              {options.doctors.map((doc) => (
                <MenuItem key={doc} value={doc}>
                  {doc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Reset Button */}
        <Box>
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            disabled={!hasActiveFilters}
            onClick={onResetFilters}
            sx={{
              borderColor: "#E5E7EB",
              color: "#374151",
              textTransform: "none",
              height: "40px",
              px: 2,
              whiteSpace: "nowrap",
              "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
