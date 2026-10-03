import { useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Box, Typography, TextField, MenuItem, Chip, IconButton, Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as customerService from "../../services/customerService";
import useDebounce from "../../hooks/useDebounce";

const INDUSTRIES = ["Technology", "Manufacturing", "Retail", "Healthcare", "Finance", "Other"];

export default function CustomerList() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);
  const [industry, setIndustry] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["customers", debouncedSearch, industry],
    queryFn: () => customerService.fetchCustomers({ search: debouncedSearch, industry: industry || undefined }),
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
          size="small" sx={{ width: 320 }}
          value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
        />
        <TextField
          select label="Industry" size="small" sx={{ width: 200 }}
          value={industry} onChange={(e) => setIndustry(e.target.value)}
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
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <TableCell key={j}><Skeleton /></TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && data?.results?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                  No customers found. Try adjusting your search or filters.
                </Typography>
              </TableCell>
            </TableRow>
          )}

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