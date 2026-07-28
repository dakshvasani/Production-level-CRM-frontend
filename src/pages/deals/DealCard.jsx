import { useDrag } from "react-dnd";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import dayjs from "dayjs";

export default function DealCard({ deal, onClick }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "DEAL",
    item: { id: deal.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <Card
      ref={drag}
      onClick={onClick}
      sx={{
        mb: 1.5, cursor: "grab", opacity: isDragging ? 0.4 : 1,
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ p: "12px !important" }}>
        <Typography variant="subtitle2" noWrap>{deal.title}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {deal.customer_name || "No customer"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Chip label={`$${Number(deal.value).toLocaleString()}`} size="small" />
          <Typography variant="caption" color="text.secondary">
            {deal.expected_closing ? dayjs(deal.expected_closing).format("MMM D") : "—"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}