import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box, Typography, Button } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import * as dealService from "../../services/dealService";
import StageColumn from "./StageColumn";

export default function PipelineBoard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: stages } = useQuery({ queryKey: ["stages"], queryFn: dealService.fetchStages });
  const { data: deals } = useQuery({ queryKey: ["deals"], queryFn: () => dealService.fetchDeals() });

  const moveMutation = useMutation({
    mutationFn: ({ id, stageId }) => dealService.moveDealStage(id, stageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["deals"] }),
  });

  const handleDrop = (dealId, stageId) => {
    moveMutation.mutate({ id: dealId, stageId });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5">Sales Pipeline</Typography>
        <Button variant="contained" onClick={() => navigate("/deals/new")}>
          Add Deal
        </Button>
      </Box>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {stages?.results
          ?.sort((a, b) => a.order - b.order)
          .map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              deals={deals?.results?.filter((d) => d.stage === stage.id) || []}
              onDropDeal={handleDrop}
              onCardClick={(deal) => navigate(`/deals/${deal.id}/edit`)}
            />
          ))}
      </Box>
    </DndProvider>
  );
}