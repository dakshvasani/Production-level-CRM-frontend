import { useState } from "react";
import dayjs from "dayjs";
import {
  Box, Paper, Typography, IconButton, Chip, ToggleButtonGroup, ToggleButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useQuery } from "@tanstack/react-query";
import * as taskService from "../../services/taskService";

export default function CalendarPage() {
  const [view, setView] = useState("month");
  const [anchor, setAnchor] = useState(dayjs());

  const rangeStart = view === "month" ? anchor.startOf("month") : anchor.startOf("week");
  const rangeEnd = view === "month" ? anchor.endOf("month") : anchor.endOf("week");

  const { data: events } = useQuery({
    queryKey: ["calendar", rangeStart.format("YYYY-MM-DD"), rangeEnd.format("YYYY-MM-DD")],
    queryFn: () => taskService.fetchCalendarEvents(
      rangeStart.format("YYYY-MM-DD"), rangeEnd.format("YYYY-MM-DD")
    ),
  });

  const { data: upcoming } = useQuery({
    queryKey: ["tasks", "upcoming"],
    queryFn: taskService.fetchUpcomingTasks,
  });

  const eventsByDate = (events || []).reduce((acc, ev) => {
    acc[ev.date] = acc[ev.date] || [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  const days = [];
  let cursor = rangeStart.startOf("week");
  const end = rangeEnd.endOf("week");
  while (cursor.isBefore(end) || cursor.isSame(end, "day")) {
    days.push(cursor);
    cursor = cursor.add(1, "day");
  }

  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      <Paper sx={{ p: 3, flex: "2 1 600px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => setAnchor(anchor.subtract(1, view))}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6">
              {view === "month" ? anchor.format("MMMM YYYY") : `Week of ${rangeStart.format("MMM D")}`}
            </Typography>
            <IconButton onClick={() => setAnchor(anchor.add(1, view))}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <ToggleButtonGroup size="small" value={view} exclusive onChange={(_, v) => v && setView(v)}>
            <ToggleButton value="month">Month</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <Typography key={d} variant="caption" color="text.secondary" textAlign="center">{d}</Typography>
          ))}
          {days.map((day) => {
            const dateKey = day.format("YYYY-MM-DD");
            const dayEvents = eventsByDate[dateKey] || [];
            const inRange = view === "week" || day.month() === anchor.month();
            return (
              <Paper
                key={dateKey}
                variant="outlined"
                sx={{ p: 1, minHeight: 90, opacity: inRange ? 1 : 0.4 }}
              >
                <Typography variant="caption">{day.date()}</Typography>
                {dayEvents.slice(0, 3).map((ev) => (
                  <Chip
                    key={`${ev.type}-${ev.id}`}
                    label={ev.title}
                    size="small"
                    color={ev.type === "meeting" ? "secondary" : "primary"}
                    sx={{ display: "block", mt: 0.5, maxWidth: "100%" }}
                  />
                ))}
              </Paper>
            );
          })}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, flex: "1 1 260px" }}>
        <Typography variant="h6" mb={2}>Upcoming (7 days)</Typography>
        {upcoming?.map((task) => (
          <Box key={task.id} sx={{ mb: 1.5 }}>
            <Typography variant="body2">{task.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {task.due_date ? dayjs(task.due_date).format("MMM D") : "No date"} · {task.priority}
            </Typography>
          </Box>
        ))}
        {!upcoming?.length && (
          <Typography variant="body2" color="text.secondary">Nothing due soon.</Typography>
        )}
      </Paper>
    </Box>
  );
}