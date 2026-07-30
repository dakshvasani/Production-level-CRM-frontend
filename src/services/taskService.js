import axiosInstance from "./axiosInstance";

export const fetchTasks = async (params = {}) => {
  const { data } = await axiosInstance.get("/tasks/", { params });
  return data;
};

export const createTask = async (payload) => {
  const { data } = await axiosInstance.post("/tasks/", payload);
  return data;
};

export const updateTask = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/tasks/${id}/`, payload);
  return data;
};

export const deleteTask = async (id) => {
  await axiosInstance.delete(`/tasks/${id}/`);
};

export const fetchUpcomingTasks = async () => {
  const { data } = await axiosInstance.get("/tasks/upcoming/");
  return data;
};

export const fetchCalendarEvents = async (start, end) => {
  const { data } = await axiosInstance.get("/calendar/", { params: { start, end } });
  return data;
};