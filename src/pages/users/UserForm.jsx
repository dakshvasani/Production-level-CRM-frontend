import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Paper, TextField, Button, Typography, MenuItem, Box,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userService from "../../services/userService";

const ROLES = ["SUPER_ADMIN", "ADMIN", "MANAGER", "SALES_EXECUTIVE", "SUPPORT"];

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: { role: "SALES_EXECUTIVE" },
  });

  const { data: existingUsers } = useQuery({
    queryKey: ["users", "all-for-manager-select"],
    queryFn: () => userService.fetchUsers(),
  });

  useEffect(() => {
    if (isEdit) {
      userService.fetchUsers({ id }).then((res) => {
        const found = res.results?.find((u) => u.id === Number(id));
        if (found) reset(found);
      });
    }
  }, [id, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? userService.updateUser(id, payload) : userService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
  });

  return (
    <Paper sx={{ p: 4, maxWidth: 500 }}>
      <Typography variant="h5" mb={3}>
        {isEdit ? "Edit User" : "Add User"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <TextField fullWidth label="Username" margin="normal" {...register("username")} disabled={isEdit} />
        <TextField fullWidth label="First name" margin="normal" {...register("first_name")} />
        <TextField fullWidth label="Last name" margin="normal" {...register("last_name")} />
        <TextField fullWidth label="Email" margin="normal" {...register("email")} />
        <TextField fullWidth label="Phone" margin="normal" {...register("phone")} />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Role" margin="normal">
              {ROLES.map((r) => (
                <MenuItem key={r} value={r}>{r.replace("_", " ")}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="manager"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Manager" margin="normal">
              <MenuItem value="">None</MenuItem>
              {existingUsers?.results
                ?.filter((u) => u.role === "MANAGER")
                .map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.first_name} {m.last_name}
                  </MenuItem>
                ))}
            </TextField>
          )}
        />

        <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save User"}
        </Button>
      </Box>
    </Paper>
  );
}