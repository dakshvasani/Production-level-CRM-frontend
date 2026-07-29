import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Paper, Typography, Grid, Chip, Button, Box, Divider,
} from "@mui/material";
import * as customerService from "../../services/customerService";
import TimelineView from "../../components/timeline/TimelineView";

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerService.fetchCustomer(id),
  });

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!customer) return <Typography>Customer not found.</Typography>;

  const fields = [
    ["Contact Person", customer.contact_person],
    ["Email", customer.email || "—"],
    ["Phone", customer.phone || "—"],
    ["Industry", customer.industry || "—"],
    ["GST", customer.gst || "—"],
    ["Owner", customer.owner_name || "Unassigned"],
    ["Address", customer.address || "—"],
  ];

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <Paper sx={{ p: 4, flex: "1 1 400px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">{customer.company_name}</Typography>
          <Button variant="outlined" onClick={() => navigate(`/customers/${id}/edit`)}>
            Edit
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          {customer.tag_names?.map((t) => (
            <Chip key={t} label={t} size="small" sx={{ mr: 0.5 }} />
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          {fields.map(([label, value]) => (
            <Grid item xs={12} sm={6} key={label}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="body1">{value}</Typography>
            </Grid>
          ))}
        </Grid>

        {customer.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">Notes</Typography>
            <Typography variant="body2">{customer.notes}</Typography>
          </>
        )}
      </Paper>

      <Paper sx={{ p: 3, flex: "1 1 400px" }}>
        <TimelineView targetType="customer" targetId={customer.id} />
      </Paper>
    </Box>
  );
}