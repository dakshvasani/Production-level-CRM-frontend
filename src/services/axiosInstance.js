import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pendingRequests = [];
};

function dispatchApiError(message) {
  window.dispatchEvent(new CustomEvent("api-error", { detail: { message } }));
}

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return "Network error. Please check your connection.";
  if (data.errors) {
    if (typeof data.errors === "string") return data.errors;
    if (data.errors.detail) return data.errors.detail;
    const firstKey = Object.keys(data.errors)[0];
    const firstVal = data.errors[firstKey];
    return Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
  }
  return "Something went wrong. Please try again.";
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        const { data } = await axios.post(`${baseURL}/auth/refresh/`, { refresh });
        localStorage.setItem("access_token", data.access);
        processQueue(null, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Don't spam a toast for expected 401s that are about to redirect to login.
    if (error.response?.status !== 401) {
      dispatchApiError(extractErrorMessage(error));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;