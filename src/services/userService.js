import axiosInstance from "./axiosInstance";

export const fetchUsers = async (params = {}) => {
  const { data } = await axiosInstance.get("/auth/users/", { params });
  return data;
};

export const createUser = async (payload) => {
  const { data } = await axiosInstance.post("/auth/users/", payload);
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/auth/users/${id}/`, payload);
  return data;
};

export const deleteUser = async (id) => {
  await axiosInstance.delete(`/auth/users/${id}/`);
};

export const toggleUserActive = async (id) => {
  const { data } = await axiosInstance.post(`/auth/users/${id}/toggle_active/`);
  return data;
};

export const resetUserPassword = async (id, newPassword) => {
  const { data } = await axiosInstance.post(`/auth/users/${id}/reset_password/`, {
    new_password: newPassword,
  });
  return data;
};