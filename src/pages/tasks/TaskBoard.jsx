import { useState } from "react";
import {
  Box, Paper, Typography, Chip, TextField, MenuItem, Button, IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as taskService from "../../services/taskService";
import dayjs from "dayjs";

const COLUMNS = ["TODO", "IN_PROGRESS", "DONE"];
const COLUMN_LABELS = { TODO: "To Do", IN_PROGRESS: "In Progress", DONE: "Done" };
const PRIORITY_COLORS = { LOW: "default", MEDIUM: "warning", HIGH: "error" };

export default function TaskBoard() {
  const [priority, setPriority] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["tasks", priority],
    queryFn: () => taskService.fetchTasks({ priority: priority || undefined }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => taskService.updateTask(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Tasks</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            select size="small" label="Priority" sx={{ width: 150 }}
            value={priority} onChange={(e) => setPriority(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </TextField>
          <Button variant="contained" onClick={() => navigate("/tasks/new")}>Add Task</Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
        {COLUMNS.map((col) => (
          <Paper key={col} sx={{ p: 2, width: 300, flexShrink: 0, minHeight: 400 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>{COLUMN_LABELS[col]}</Typography>
            {data?.results?.filter((t) => t.status === col).map((task) => (
              <Paper key={task.id} variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" fontWeight={600}>{task.title}</Typography>
                  <IconButton size="small" onClick={() => deleteMutation.mutate(task.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Chip label={task.priority} size="small" color={PRIORITY_COLORS[task.priority]} />
                  <Typography variant="caption" color="text.secondary">
                    {task.due_date ? dayjs(task.due_date).format("MMM D") : "No date"}
                  </Typography>
                </Box>
                <TextField
                  select size="small" fullWidth sx={{ mt: 1 }}
                  value={task.status}
                  onChange={(e) => updateMutation.mutate({ id: task.id, payload: { status: e.target.value } })}
                >
                  {COLUMNS.map((s) => <MenuItem key={s} value={s}>{COLUMN_LABELS[s]}</MenuItem>)}
                </TextField>
              </Paper>
            ))}
          </Paper>
        ))}
      </Box>
    </Box>
  );
}