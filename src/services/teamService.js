import axiosInstance from "./axiosInstance";

export const fetchTeams = async () => {
  const { data } = await axiosInstance.get("/teams/");
  return data;
};

export const createTeam = async (payload) => {
  const { data } = await axiosInstance.post("/teams/", payload);
  return data;
};

export const updateTeam = async (id, payload) => {
  const { data } = await axiosInstance.patch(`/teams/${id}/`, payload);
  return data;
};

export const deleteTeam = async (id) => {
  await axiosInstance.delete(`/teams/${id}/`);
};

export const addTeamMember = async (teamId, userId) => {
  const { data } = await axiosInstance.post(`/teams/${teamId}/add_member/`, { user_id: userId });
  return data;
};

export const removeTeamMember = async (teamId, userId) => {
  const { data } = await axiosInstance.post(`/teams/${teamId}/remove_member/`, { user_id: userId });
  return data;
};