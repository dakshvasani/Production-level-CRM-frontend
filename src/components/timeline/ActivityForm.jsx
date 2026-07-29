import { useState } from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as timelineService from "../../services/timelineService";

const TYPES = ["CALL", "MEETING", "EMAIL", "WHATSAPP", "FOLLOW_UP", "REMINDER"];

export default function ActivityForm({ targetType, targetId }) {
  const [type, setType] = useState("CALL");
  const [subject, setSubject] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: timelineService.createActivity,
    onSuccess: () => {
      setSubject("");
      queryClient.invalidateQueries({ queryKey: ["timeline", targetType, targetId] });
    },
  });

  const handleSubmit = () => {
    if (!subject.trim()) return;
    mutation.mutate({
      target_type: targetType, target_id: targetId,
      activity_type: type, subject,
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      <TextField select size="small" value={type} onChange={(e) => setType(e.target.value)} sx={{ width: 140 }}>
        {TYPES.map((t) => <MenuItem key={t} value={t}>{t.replace("_", " ")}</MenuItem>)}
      </TextField>
      <TextField
        size="small" fullWidth placeholder="Log an activity..."
        value={subject} onChange={(e) => setSubject(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit} disabled={mutation.isPending}>
        Add
      </Button>
    </Box>
  );
}