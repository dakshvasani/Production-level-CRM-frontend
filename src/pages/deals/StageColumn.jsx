import { useDrop } from "react-dnd";
import { Paper, Typography, Box, Chip } from "@mui/material";
import DealCard from "./DealCard";

export default function StageColumn({ stage, deals, onDropDeal, onCardClick }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "DEAL",
    drop: (item) => onDropDeal(item.id, stage.id),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const totalValue = deals.reduce((sum, d) => sum + Number(d.value), 0);

  return (
    <Paper
      ref={drop}
      sx={{
        p: 1.5, width: 260, flexShrink: 0,
        bgcolor: isOver ? "action.hover" : "background.paper",
        minHeight: 400,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle1">{stage.name}</Typography>
        <Chip label={deals.length} size="small" />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        ${totalValue.toLocaleString()}
      </Typography>
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} onClick={() => onCardClick(deal)} />
      ))}
    </Paper>
  );
}