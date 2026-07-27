import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Paper, TextField, Button, Typography, Box, MenuItem, Alert, Slider,
} from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as leadService from "../../services/leadService";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "UNQUALIFIED", "CONVERTED", "LOST"];

export default function LeadForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState("");

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { status: "NEW", score: 0 },
  });

  const { data: sources } = useQuery({
    queryKey: ["lead-sources"],
    queryFn: leadService.fetchLeadSources,
  });

  const { data: existing } = useQuery({
    queryKey: ["leads", id],
    queryFn: () => leadService.fetchLeads({ id }),
    enabled: isEdit,
  });

  useEffect(() => {
    const found = existing?.results?.find((l) => l.id === Number(id));
    if (found) reset(found);
  }, [existing, id, reset]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? leadService.updateLead(id, payload) : leadService.createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      navigate("/leads");
    },
    onError: (err) => {
      const data = err.response?.data;
      setApiError(data?.email?.[0] || data?.phone?.[0] || "Something went wrong. Please check the form.");
    },
  });

  return (
    <Paper sx={{ p: 4, maxWidth: 520 }}>
      <Typography variant="h5" mb={3}>{isEdit ? "Edit Lead" : "Add Lead"}</Typography>

      {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

      <Box component="form" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <TextField
          fullWidth label="Name" margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField fullWidth label="Email" margin="normal" {...register("email")} />
        <TextField fullWidth label="Phone" margin="normal" {...register("phone")} />
        <TextField fullWidth label="Company Name" margin="normal" {...register("company_name")} />

        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Lead Source" margin="normal">
              <MenuItem value="">None</MenuItem>
              {sources?.results?.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Status" margin="normal">
              {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
        />

        <Typography variant="caption" color="text.secondary">Lead Score</Typography>
        <Controller
          name="score"
          control={control}
          render={({ field }) => (
            <Slider {...field} min={0} max={100} valueLabelDisplay="auto" />
          )}
        />

        <TextField fullWidth label="Notes" margin="normal" multiline rows={3} {...register("notes")} />

        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Lead"}
        </Button>
      </Box>
    </Paper>
  );
}