import { useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, TextField, MenuItem, Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as auditService from "../../services/auditService";

const ACTION_COLORS = { Created: "success", Updated: "warning", Deleted: "error", Login: "info", Logout: "default" };

export default function AuditLogViewer() {
  const [modelFilter, setModelFilter] = useState("");

  const { data: entries } = useQuery({
    queryKey: ["audit-log"],
    queryFn: auditService.fetchAuditLog,
  });

  const models = [...new Set(entries?.map((e) => e.model) || [])];
  const filtered = modelFilter ? entries?.filter((e) => e.model === modelFilter) : entries;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>Audit Log</Typography>

      <TextField
        select size="small" label="Filter by model" sx={{ width: 200, mb: 2 }}
        value={modelFilter} onChange={(e) => setModelFilter(e.target.value)}
      >
        <MenuItem value="">All</MenuItem>
        {models.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
      </TextField>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Changed By</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered?.map((entry, i) => (
            <TableRow key={i}>
              <TableCell>{entry.model}</TableCell>
              <TableCell><Chip label={entry.action} size="small" color={ACTION_COLORS[entry.action] || "default"} /></TableCell>
              <TableCell>{entry.object_repr}</TableCell>
              <TableCell>{entry.changed_by}</TableCell>
              <TableCell>{dayjs(entry.timestamp).format("MMM D, YYYY h:mm A")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}