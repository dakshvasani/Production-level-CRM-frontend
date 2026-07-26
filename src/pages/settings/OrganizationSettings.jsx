import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Paper, TextField, Button, Typography, MenuItem, Box, Avatar, Alert,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as orgService from "../../services/organizationService";
import { useAuth } from "../../context/AuthContext";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "AUD"];

export default function OrganizationSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  const { data: orgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: orgService.fetchOrganizations,
  });

  const org = orgs?.results?.[0];

  const { control, register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (org) reset(org);
  }, [org, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => orgService.updateOrganization(org.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const onSubmit = (formData) => {
    if (logoFile) {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) fd.append(key, value);
      });
      fd.append("logo", logoFile);
      mutation.mutate(fd);
    } else {
      mutation.mutate(formData);
    }
  };

  if (!org) return <Typography>Loading organization settings...</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 500 }}>
      <Typography variant="h5" mb={3}>Company Settings</Typography>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>Settings saved.</Alert>}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar src={org.logo} sx={{ width: 56, height: 56 }} variant="rounded" />
        <Button component="label" variant="outlined" size="small">
          Upload Logo
          <input hidden type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Company Name" margin="normal" {...register("name")} />
        <TextField fullWidth label="Timezone" margin="normal" {...register("timezone")} />

        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Currency" margin="normal">
              {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          )}
        />

        <Controller
          name="fiscal_year_start_month"
          control={control}
          render={({ field }) => (
            <TextField {...field} select fullWidth label="Fiscal Year Start Month" margin="normal">
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Paper>
  );
}