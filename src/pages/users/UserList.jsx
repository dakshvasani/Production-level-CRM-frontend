import { useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Chip, IconButton, Box, Typography, TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as userService from "../../services/userService";

export default function UserList() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: () => userService.fetchUsers({ search }),
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: userService.toggleUserActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Users</Typography>
        <Button variant="contained" onClick={() => navigate("/users/new")}>
          Add User
        </Button>
      </Box>

      <TextField
        placeholder="Search users..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: 300 }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!isLoading &&
            data?.results?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.first_name} {u.last_name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip label={u.role.replace("_", " ")} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={u.is_active_employee ? "Active" : "Inactive"}
                    color={u.is_active_employee ? "success" : "default"}
                    size="small"
                    onClick={() => toggleMutation.mutate(u.id)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/users/${u.id}/edit`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => deleteMutation.mutate(u.id)}>
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