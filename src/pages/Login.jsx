import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box, Paper, TextField, Button, Typography, Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async ({ username, password }) => {
    setApiError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setApiError(
        err.response?.data?.detail || "Invalid username or password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex", minHeight: "100vh",
        alignItems: "center", justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper sx={{ p: 4, width: 360 }} elevation={3}>
        <Typography variant="h5" mb={3} textAlign="center">
          CRM Login
        </Typography>

        {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}