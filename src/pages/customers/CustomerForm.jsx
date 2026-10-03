import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Paper, TextField, Button, Typography, Box, Alert, MenuItem, Autocomplete, Chip,
} from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import * as customerService from "../../services/customerService";

const INDUSTRIES = ["Technology", "Manufacturing", "Retail", "Healthcare", "Finance", "Other"];

export default function CustomerForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [apiError, setApiError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

  const { data: existing } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.fetchCustomer(id),
    enabled: isEdit,
  });

  const { data: tagOptions } = useQuery({
    queryKey: ["tags"],
    queryFn: customerService.fetchTags,
  });

  useEffect(() => {
    if (existing) reset(existing);
  }, [existing, reset]);

  useEffect(() => {
    if (existing && tagOptions?.results) {
      setSelectedTags(tagOptions.results.filter((t) => existing.tags?.includes(t.id)));
    }
  }, [existing, tagOptions]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? customerService.updateCustomer(id, payload) : customerService.createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      navigate("/customers");
    },
    onError: (err) => {
      const data = err.response?.data;
      setApiError(data?.email?.[0] || data?.gst?.[0] || "Something went wrong. Please check the form.");
    },
  });

  // Turns a tag name into a tag ID — reuses an existing tag (case-insensitive
  // match) instead of trying to create a duplicate, which the backend
  // would otherwise reject since (organization, name) is unique.
  const resolveTagId = async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const match = tagOptions?.results?.find(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (match) return match.id;
    const created = await customerService.createTag({ name: trimmed });
    return created.id;
  };

  const onSubmit = async (formData) => {
    setApiError("");
    try {
      const resolvedTagIds = [];
      // Any tag already turned into a chip:
      for (const tag of selectedTags) {
        const tagId = typeof tag === "string" ? await resolveTagId(tag) : tag.id;
        if (tagId) resolvedTagIds.push(tagId);
      }
      // Anything still sitting in the input box, not yet committed with Enter:
      if (tagInputValue.trim()) {
        const tagId = await resolveTagId(tagInputValue);
        if (tagId) resolvedTagIds.push(tagId);
      }
      mutation.mutate({ ...formData, tags: resolvedTagIds });
    } catch {
      setApiError("Could not save one or more tags. Please try again.");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 520 }}>
      <Typography variant="h5" mb={3}>{isEdit ? "Edit Customer" : "Add Customer"}</Typography>

      {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth label="Company Name" margin="normal" InputLabelProps={{ shrink: true }}
          {...register("company_name", { required: "Company name is required" })}
          error={!!errors.company_name}
          helperText={errors.company_name?.message}
        />
        <TextField
          fullWidth label="Contact Person" margin="normal" InputLabelProps={{ shrink: true }}
          {...register("contact_person", { required: "Contact person is required" })}
          error={!!errors.contact_person}
          helperText={errors.contact_person?.message}
        />
        <TextField fullWidth label="Email" margin="normal" InputLabelProps={{ shrink: true }} {...register("email")} />
        <TextField fullWidth label="Phone" margin="normal" InputLabelProps={{ shrink: true }} {...register("phone")} />
        <TextField fullWidth label="Address" margin="normal" multiline rows={2} InputLabelProps={{ shrink: true }} {...register("address")} />
        <TextField fullWidth label="GST Number" margin="normal" InputLabelProps={{ shrink: true }} {...register("gst")} />

        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <TextField {...field} value={field.value || ""} select fullWidth label="Industry" margin="normal" InputLabelProps={{ shrink: true }}>
              <MenuItem value="">None</MenuItem>
              {INDUSTRIES.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
            </TextField>
          )}
        />

        <Autocomplete
          multiple
          freeSolo
          options={tagOptions?.results || []}
          getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
          value={selectedTags}
          inputValue={tagInputValue}
          onInputChange={(event, newInputValue) => setTagInputValue(newInputValue)}
          onChange={(event, newValue) => {
            setSelectedTags(newValue);
            setTagInputValue("");
          }}
          isOptionEqualToValue={(option, value) =>
            typeof value === "string" ? option.name === value : option.id === value.id
          }
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={typeof option === "string" ? option : option.name} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Tags" margin="normal" placeholder="Type a tag and press Enter (or just click away)" />
          )}
        />

        <TextField fullWidth label="Notes" margin="normal" multiline rows={3} InputLabelProps={{ shrink: true }} {...register("notes")} />

        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Customer"}
        </Button>
      </Box>
    </Paper>
  );
}