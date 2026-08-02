import axiosInstance from "./axiosInstance";

export const fetchAuditLog = async () => {
  const { data } = await axiosInstance.get("/audit-log/");
  return data;
};