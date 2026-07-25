import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Paper, Typography, TextField, Button, Avatar, Box, Alert,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authService from "../services/authService";

export default function Profile() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: authService.fetchProfile,
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (profile) reset(profile);
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  if (isLoading) return <Typography>Loading profile...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 480 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar src={profile?.avatar} sx={{ width: 64, height: 64 }} />
        <Typography variant="h6">{profile?.username}</Typography>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>Profile updated.</Alert>}

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <TextField fullWidth label="First name" margin="normal" {...register("first_name")} />
        <TextField fullWidth label="Last name" margin="normal" {...register("last_name")} />
        <TextField fullWidth label="Email" margin="normal" {...register("email")} />
        <TextField fullWidth label="Phone" margin="normal" {...register("phone")} />
        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Paper>
  );
}