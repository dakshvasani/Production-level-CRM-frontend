import axiosInstance from "./axiosInstance";

export const fetchCustomers = async (params = {}) => {
  const { data } = await axiosInstance.get("/customers/", { params });
  return data;
};

export const fetchCustomer = async (id) => {
  const { data } = await axiosInstance.get(`/customers/${id}/`);
  return data;
};

export const createCustomer = async (payload) => {
  const { data } = await axiosInstance.post("/customers/", payload);
  return data;
};

export const updateCustomer = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/customers/${id}/`, payload);
  return data;
};

export const deleteCustomer = async (id) => {
  await axiosInstance.delete(`/customers/${id}/`);
};

export const fetchTags = async () => {
  const { data } = await axiosInstance.get("/tags/");
  return data;
};