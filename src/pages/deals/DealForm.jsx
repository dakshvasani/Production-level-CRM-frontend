import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Paper, TextField, Button, Typography, Box, MenuItem, Alert, Slider,
} from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as dealService from "../../services/dealService";
import * as customerService from "../../services/customerService";

export default function DealForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState("");

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { probability: 50, value: 0 },
  });

  const { data: stages } = useQuery({ queryKey: ["stages"], queryFn: dealService.fetchStages });
  const { data: customers } = useQuery({
    queryKey: ["customers", "select"],
    queryFn: () => customerService.fetchCustomers(),
  });

  const { data: existing } = useQuery({
    queryKey: ["deals", id],
    queryFn: () => dealService.fetchDeals({ id }),
    enabled: isEdit,
  });

  useEffect(() => {
    const found = existing?.results?.find((d) => d.id === Number(id));
    if (found) reset(found);
  }, [existing, id, reset]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? dealService.updateDeal(id, payload) : dealService.createDeal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      navigate("/deals");
    },
    onError: () => setApiError("Something went wrong. Please check the form."),
  });

  return (
    <Paper sx={{ p: 4, maxWidth: 520 }}>
      <Typography variant="h5" mb={3}>{isEdit ? "Edit Deal" : "Add Deal"}</Typography>

      {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

      <Box component="form" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <TextField
          fullWidth label="Deal Title" margin="normal"
          {...register("title", { required: "Title is required" })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <Controller
          name="customer"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Customer" margin="normal">
              <MenuItem value="">None</MenuItem>
              {customers?.results?.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.company_name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="stage"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Stage" margin="normal">
              {stages?.results?.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
          )}
        />

        <TextField
          fullWidth type="number" label="Deal Value" margin="normal"
          {...register("value")}
        />

        <Typography variant="caption" color="text.secondary">Probability (%)</Typography>
        <Controller
          name="probability"
          control={control}
          render={({ field }) => <Slider {...field} min={0} max={100} valueLabelDisplay="auto" />}
        />

        <TextField
          fullWidth type="date" label="Expected Closing" margin="normal"
          InputLabelProps={{ shrink: true }}
          {...register("expected_closing")}
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Deal"}
        </Button>
      </Box>
    </Paper>
  );
}