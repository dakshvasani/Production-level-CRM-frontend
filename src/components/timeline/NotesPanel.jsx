import { useState } from "react";
import {
  Box, TextField, Button, Paper, Typography, IconButton,
} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as timelineService from "../../services/timelineService";

export default function NotesPanel({ targetType, targetId, notes }) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["timeline", targetType, targetId] });

  const createMutation = useMutation({
    mutationFn: timelineService.createNote,
    onSuccess: () => { setContent(""); invalidate(); },
  });

  const pinMutation = useMutation({
    mutationFn: ({ id, isPinned }) => timelineService.togglePinNote(id, isPinned),
    onSuccess: invalidate,
  });

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth multiline minRows={2} placeholder="Add a note... (use @name to mention someone)"
          value={content} onChange={(e) => setContent(e.target.value)}
        />
        <Button
          variant="contained"
          disabled={!content.trim() || createMutation.isPending}
          onClick={() => createMutation.mutate({ target_type: targetType, target_id: targetId, content })}
        >
          Post
        </Button>
      </Box>

      {notes?.map((note) => (
        <Paper key={note.id} variant="outlined" sx={{ p: 2, mb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              {note.created_by_name} · {new Date(note.created_at).toLocaleString()}
            </Typography>
            <IconButton size="small" onClick={() => pinMutation.mutate({ id: note.id, isPinned: !note.is_pinned })}>
              {note.is_pinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{note.content}</Typography>
        </Paper>
      ))}
    </Box>
  );
}