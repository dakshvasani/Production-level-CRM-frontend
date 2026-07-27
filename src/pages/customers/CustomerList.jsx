import { useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Box, Typography, TextField, MenuItem, Chip, IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as customerService from "../../services/customerService";

const INDUSTRIES = ["Technology", "Manufacturing", "Retail", "Healthcare", "Finance", "Other"];

export default function CustomerList() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["customers", search, industry],
    queryFn: () => customerService.fetchCustomers({ search, industry: industry || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Customers</Typography>
        <Button variant="contained" onClick={() => navigate("/customers/new")}>
          Add Customer
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search company, contact, email, GST..."
          size="small"
          sx={{ width: 320 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          select label="Industry" size="small" sx={{ width: 200 }}
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {INDUSTRIES.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
        </TextField>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Industry</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!isLoading &&
            data?.results?.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.company_name}</TableCell>
                <TableCell>{c.contact_person}</TableCell>
                <TableCell>{c.industry || "—"}</TableCell>
                <TableCell>{c.owner_name || "Unassigned"}</TableCell>
                <TableCell>
                  {c.tag_names?.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{ mr: 0.5 }} />
                  ))}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/customers/${c.id}`)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => navigate(`/customers/${c.id}/edit`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => deleteMutation.mutate(c.id)}>
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