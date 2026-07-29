import { useQuery } from "@tanstack/react-query";
import { Box, Paper, Typography, Chip, Divider, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import * as timelineService from "../../services/timelineService";
import ActivityForm from "./ActivityForm";
import NotesPanel from "./NotesPanel";

const ICON_LABEL = {
  activity: "Activity", note: "Note", attachment: "File",
};

export default function TimelineView({ targetType, targetId }) {
  const [tab, setTab] = useState(0);

  const { data: entries } = useQuery({
    queryKey: ["timeline", targetType, targetId],
    queryFn: () => timelineService.fetchTimeline(targetType, targetId),
  });

  const notes = entries?.filter((e) => e.type === "note") || [];

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Timeline" />
        <Tab label="Notes" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <ActivityForm targetType={targetType} targetId={targetId} />
          {entries?.map((entry) => (
            <Paper key={`${entry.type}-${entry.id}`} variant="outlined" sx={{ p: 2, mb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Chip label={ICON_LABEL[entry.type]} size="small" />
                <Typography variant="caption" color="text.secondary">
                  {dayjs(entry.created_at).format("MMM D, YYYY h:mm A")}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              {entry.type === "activity" && (
                <>
                  <Typography variant="body2" fontWeight={600}>{entry.subject}</Typography>
                  <Typography variant="caption" color="text.secondary">{entry.activity_type}</Typography>
                </>
              )}
              {entry.type === "note" && (
                <Typography variant="body2">{entry.content}</Typography>
              )}
              {entry.type === "attachment" && (
                <a href={entry.file} target="_blank" rel="noreferrer">View attachment</a>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {tab === 1 && (
        <NotesPanel targetType={targetType} targetId={targetId} notes={notes} />
      )}
    </Box>
  );
}