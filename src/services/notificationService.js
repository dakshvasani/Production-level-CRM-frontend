import axiosInstance from "./axiosInstance";

export const fetchNotifications = async () => {
  const { data } = await axiosInstance.get("/notifications/");
  return data;
};

export const fetchUnreadCount = async () => {
  const { data } = await axiosInstance.get("/notifications/unread_count/");
  return data.unread_count;
};

export const markNotificationRead = async (id) => {
  const { data } = await axiosInstance.post(`/notifications/${id}/mark_read/`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await axiosInstance.post("/notifications/mark_all_read/");
  return data;
};