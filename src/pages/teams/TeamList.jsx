import { useState } from "react";
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Box, Typography, TextField, MenuItem,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as teamService from "../../services/teamService";
import * as userService from "../../services/userService";

export default function TeamList() {
  const [newTeamName, setNewTeamName] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const queryClient = useQueryClient();

  const { data: teams } = useQuery({ queryKey: ["teams"], queryFn: teamService.fetchTeams });
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => userService.fetchUsers() });

  const managers = users?.results?.filter((u) => u.role === "MANAGER") || [];

  const createMutation = useMutation({
    mutationFn: teamService.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setNewTeamName("");
      setSelectedManager("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teamService.deleteTeam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teams"] }),
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>Teams</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="New team name"
          size="small"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
        />
        <TextField
          select label="Manager" size="small" sx={{ width: 200 }}
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          {managers.map((m) => (
            <MenuItem key={m.id} value={m.id}>{m.first_name} {m.last_name}</MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          disabled={!newTeamName}
          onClick={() =>
            createMutation.mutate({ name: newTeamName, manager: selectedManager || null })
          }
        >
          Add Team
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell>Manager</TableCell>
            <TableCell>Members</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams?.results?.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.manager_name || "—"}</TableCell>
              <TableCell>{t.member_count}</TableCell>
              <TableCell align="right">
                <Button size="small" color="error" onClick={() => deleteMutation.mutate(t.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}