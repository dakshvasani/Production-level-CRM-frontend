import axiosInstance from "./axiosInstance";

export const fetchTimeline = async (targetType, targetId) => {
  const { data } = await axiosInstance.get("/timeline/", {
    params: { target_type: targetType, target_id: targetId },
  });
  return data;
};

export const createActivity = async (payload) => {
  const { data } = await axiosInstance.post("/activities/", payload);
  return data;
};

export const createNote = async (payload) => {
  const { data } = await axiosInstance.post("/notes/", payload);
  return data;
};

export const togglePinNote = async (id, isPinned) => {
  const { data } = await axiosInstance.patch(`/notes/${id}/`, { is_pinned: isPinned });
  return data;
};

export const uploadAttachment = async (targetType, targetId, file) => {
  const formData = new FormData();
  formData.append("target_type", targetType);
  formData.append("target_id", targetId);
  formData.append("file", file);
  const { data } = await axiosInstance.post("/attachments/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};