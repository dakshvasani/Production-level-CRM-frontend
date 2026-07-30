import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Paper, TextField, Button, Typography, Box, MenuItem } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as taskService from "../../services/taskService";

export default function TaskForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { control, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { priority: "MEDIUM", status: "TODO" },
  });

  const mutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      navigate("/tasks");
    },
  });

  return (
    <Paper sx={{ p: 4, maxWidth: 480 }}>
      <Typography variant="h5" mb={3}>Add Task</Typography>
      <Box component="form" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <TextField
          fullWidth label="Title" margin="normal"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title} helperText={errors.title?.message}
        />
        <TextField fullWidth label="Description" margin="normal" multiline rows={3} {...register("description")} />
        <TextField
          fullWidth type="date" label="Due Date" margin="normal"
          InputLabelProps={{ shrink: true }} {...register("due_date")}
        />
        <Controller
          name="priority" control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Priority" margin="normal">
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
          )}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Task"}
        </Button>
      </Box>
    </Paper>
  );
}