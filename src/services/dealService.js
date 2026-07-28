import axiosInstance from "./axiosInstance";

export const fetchDeals = async (params = {}) => {
  const { data } = await axiosInstance.get("/deals/", { params });
  return data;
};

export const fetchStages = async () => {
  const { data } = await axiosInstance.get("/stages/");
  return data;
};

export const createDeal = async (payload) => {
  const { data } = await axiosInstance.post("/deals/", payload);
  return data;
};

export const updateDeal = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/deals/${id}/`, payload);
  return data;
};

export const deleteDeal = async (id) => {
  await axiosInstance.delete(`/deals/${id}/`);
};

export const moveDealStage = async (id, stageId) => {
  const { data } = await axiosInstance.patch(`/deals/${id}/move_stage/`, { stage: stageId });
  return data;
};

export const fetchPipelineSummary = async () => {
  const { data } = await axiosInstance.get("/deals/pipeline_summary/");
  return data;
};