import { useState } from "react";
import {
  Paper, Typography, Box, Button, Grid, MenuItem, TextField, Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import * as reportService from "../../services/reportService";

const REPORTS = [
  { key: "revenue", label: "Revenue Report" },
  { key: "sales", label: "Sales Report" },
  { key: "customers", label: "Customers Report" },
  { key: "lead_source", label: "Lead Source Report" },
  { key: "employee_performance", label: "Employee Performance Report" },
];

const FORMATS = ["csv", "xlsx", "pdf"];

export default function ReportsPage() {
  const [formatByReport, setFormatByReport] = useState(
    Object.fromEntries(REPORTS.map((r) => [r.key, "csv"]))
  );
  const [error, setError] = useState("");

  const handleDownload = async (reportKey) => {
    setError("");
    try {
      await reportService.downloadReport(reportKey, formatByReport[reportKey], reportKey);
    } catch {
      setError("Could not generate the report. Please try again.");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={3}>Reports</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {REPORTS.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.key}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" mb={1.5}>{report.label}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  select size="small" sx={{ width: 100 }}
                  value={formatByReport[report.key]}
                  onChange={(e) =>
                    setFormatByReport((prev) => ({ ...prev, [report.key]: e.target.value }))
                  }
                >
                  {FORMATS.map((f) => <MenuItem key={f} value={f}>{f.toUpperCase()}</MenuItem>)}
                </TextField>
                <Button
                  variant="contained" startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(report.key)}
                >
                  Download
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}