import { useRef, useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Box, Typography, TextField, MenuItem, Chip, IconButton, Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as leadService from "../../services/leadService";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "UNQUALIFIED", "CONVERTED", "LOST"];
const STATUS_COLORS = {
  NEW: "info", CONTACTED: "default", QUALIFIED: "warning",
  UNQUALIFIED: "default", CONVERTED: "success", LOST: "error",
};

export default function LeadList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leads", search, status],
    queryFn: () => leadService.fetchLeads({ search, status: status || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: leadService.deleteLead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const importMutation = useMutation({
    mutationFn: leadService.importLeadsCsv,
    onSuccess: (result) => {
      setImportResult(result);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) importMutation.mutate(file);
    e.target.value = "";
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Leads</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button startIcon={<DownloadIcon />} onClick={() => leadService.exportLeadsCsv({ search, status })}>
            Export CSV
          </Button>
          <Button startIcon={<UploadFileIcon />} onClick={() => fileInputRef.current.click()}>
            Import CSV
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" hidden onChange={handleFileSelect} />
          <Button variant="contained" onClick={() => navigate("/leads/new")}>
            Add Lead
          </Button>
        </Box>
      </Box>

      {importResult && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setImportResult(null)}>
          Imported {importResult.created} leads, skipped {importResult.skipped_duplicates} duplicates.
          {importResult.errors?.length > 0 && ` ${importResult.errors.length} row(s) had errors.`}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search name, email, phone, company..."
          size="small" sx={{ width: 320 }}
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          select label="Status" size="small" sx={{ width: 180 }}
          value={status} onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!isLoading &&
            data?.results?.map((lead) => (
              <TableRow key={lead.id} hover>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.company_name || "—"}</TableCell>
                <TableCell>{lead.source_name || "—"}</TableCell>
                <TableCell>
                  <Chip label={lead.status} size="small" color={STATUS_COLORS[lead.status]} />
                </TableCell>
                <TableCell>{lead.score}</TableCell>
                <TableCell>{lead.owner_name || "Unassigned"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/leads/${lead.id}/edit`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => deleteMutation.mutate(lead.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
  );
}