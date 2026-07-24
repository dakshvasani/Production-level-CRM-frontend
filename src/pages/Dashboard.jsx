import { Typography, Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">Dashboard</Typography>
      <Typography variant="body2" color="text.secondary">
        Placeholder — KPI cards and charts arrive on Day 10.
      </Typography>
    </Paper>
  );
}