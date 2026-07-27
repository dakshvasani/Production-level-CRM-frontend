import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Paper, TextField, Button, Typography, Box, Alert,
} from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as customerService from "../../services/customerService";

export default function CustomerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: existing } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.fetchCustomer(id),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) reset(existing);
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? customerService.updateCustomer(id, payload) : customerService.createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/customers");
    },
    onError: (err) => {
      const data = err.response?.data;
      setApiError(data?.email?.[0] || data?.gst?.[0] || "Something went wrong. Please check the form.");
    },
  });

  return (
    <Paper sx={{ p: 4, maxWidth: 520 }}>
      <Typography variant="h5" mb={3}>{isEdit ? "Edit Customer" : "Add Customer"}</Typography>

      {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

      <Box component="form" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <TextField
          fullWidth label="Company Name" margin="normal"
          {...register("company_name", { required: "Company name is required" })}
          error={!!errors.company_name}
          helperText={errors.company_name?.message}
        />
        <TextField
          fullWidth label="Contact Person" margin="normal"
          {...register("contact_person", { required: "Contact person is required" })}
          error={!!errors.contact_person}
          helperText={errors.contact_person?.message}
        />
        <TextField fullWidth label="Email" margin="normal" {...register("email")} />
        <TextField fullWidth label="Phone" margin="normal" {...register("phone")} />
        <TextField fullWidth label="Address" margin="normal" multiline rows={2} {...register("address")} />
        <TextField fullWidth label="GST Number" margin="normal" {...register("gst")} />
        <TextField fullWidth label="Industry" margin="normal" {...register("industry")} />
        <TextField fullWidth label="Notes" margin="normal" multiline rows={3} {...register("notes")} />

        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Customer"}
        </Button>
      </Box>
    </Paper>
  );
}