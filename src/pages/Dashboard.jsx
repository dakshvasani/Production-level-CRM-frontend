import { useQuery } from "@tanstack/react-query";
import {
  Grid, Paper, Typography, Box, CircularProgress,
} from "@mui/material";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import * as dashboardService from "../services/dashboardService";

const COLORS = ["#1E40AF", "#0EA5E9", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

function KpiCard({ label, value, prefix = "" }) {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700}>{prefix}{value}</Typography>
    </Paper>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.fetchDashboard,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { cards, funnel, monthly_revenue, lead_sources, team_performance, win_ratio } = data;

  return (
    <Box>
      {/* KPI cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}><KpiCard label="Revenue" value={cards.revenue.toLocaleString()} prefix="$" /></Grid>
        <Grid item xs={6} sm={4} md={2}><KpiCard label="Deals" value={cards.deals} /></Grid>
        <Grid item xs={6} sm={4} md={2}><KpiCard label="Leads" value={cards.leads} /></Grid>
        <Grid item xs={6} sm={4} md={2}><KpiCard label="Conversion" value={`${cards.conversion_rate}%`} /></Grid>
        <Grid item xs={6} sm={4} md={2}><KpiCard label="Lost Deals" value={cards.lost_deals} /></Grid>
        <Grid item xs={6} sm={4} md={2}><KpiCard label="New Customers" value={cards.new_customers} /></Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly revenue */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: 320 }}>
            <Typography variant="subtitle1" mb={2}>Monthly Revenue</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={monthly_revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#1E40AF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Win ratio */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, height: 320 }}>
            <Typography variant="subtitle1" mb={2}>Win Ratio</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={[{ name: "Won", value: win_ratio.won }, { name: "Lost", value: win_ratio.lost }]}
                  dataKey="value" nameKey="name" outerRadius={90} label
                >
                  <Cell fill="#22C55E" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sales funnel */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 320 }}>
            <Typography variant="subtitle1" mb={2}>Sales Funnel</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={funnel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage__name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Lead sources */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 320 }}>
            <Typography variant="subtitle1" mb={2}>Lead Sources</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={lead_sources} dataKey="count" nameKey="source" outerRadius={90} label>
                  {lead_sources.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Team performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 320 }}>
            <Typography variant="subtitle1" mb={2}>Team Performance (Won Revenue)</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={team_performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="owner" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#1E40AF" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}