import axiosInstance from "./axiosInstance";

export const login = async (username, password) => {
  const { data } = await axiosInstance.post("/auth/login/", { username, password });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data.user;
};

export const logout = async () => {
  const refresh = localStorage.getItem("refresh_token");
  try {
    if (refresh) {
      await axiosInstance.post("/auth/logout/", { refresh });
    }
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

export const fetchProfile = async () => {
  const { data } = await axiosInstance.get("/auth/profile/");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.patch("/auth/profile/", payload);
  return data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const { data } = await axiosInstance.post("/auth/change-password/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return data;
};