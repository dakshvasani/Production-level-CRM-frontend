import axiosInstance from "./axiosInstance";

export const fetchOrganizations = async () => {
  const { data } = await axiosInstance.get("/organizations/");
  return data;
};

export const updateOrganization = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await axiosInstance.patch(`/organizations/${id}/`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return data;
};