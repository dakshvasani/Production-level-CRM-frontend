import axiosInstance from "./axiosInstance";

export const fetchLeads = async (params = {}) => {
  const { data } = await axiosInstance.get("/leads/", { params });
  return data;
};

export const createLead = async (payload) => {
  const { data } = await axiosInstance.post("/leads/", payload);
  return data;
};

export const updateLead = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/leads/${id}/`, payload);
  return data;
};

export const deleteLead = async (id) => {
  await axiosInstance.delete(`/leads/${id}/`);
};

export const fetchLeadSources = async () => {
  const { data } = await axiosInstance.get("/lead-sources/");
  return data;
};

export const exportLeadsCsv = async (params = {}) => {
  const response = await axiosInstance.get("/leads/export_csv/", {
    params,
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "leads_export.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const importLeadsCsv = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstance.post("/leads/import_csv/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};