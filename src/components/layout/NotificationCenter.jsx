import { useState } from "react";
import {
  IconButton, Badge, Menu, MenuItem, Typography, Box, Button, Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as notificationService from "../../services/notificationService";
import dayjs from "dayjs";

export default function NotificationCenter() {
  const [anchorEl, setAnchorEl] = useState(null);
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.fetchNotifications,
    refetchInterval: 30000,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["notifications", "unread_count"],
    queryFn: notificationService.fetchUnreadCount,
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: notificationService.markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationService.markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount || 0} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1 }}>
          <Typography variant="subtitle2">Notifications</Typography>
          <Button size="small" onClick={() => markAllReadMutation.mutate()}>Mark all read</Button>
        </Box>
        <Divider />
        {notifications?.results?.length ? (
          notifications.results.slice(0, 8).map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => markReadMutation.mutate(n.id)}
              sx={{ opacity: n.is_read ? 0.5 : 1, whiteSpace: "normal", maxWidth: 320 }}
            >
              <Box>
                <Typography variant="body2">{n.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {dayjs(n.created_at).format("MMM D, h:mm A")}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No notifications yet.</MenuItem>
        )}
      </Menu>
    </>
  );
}