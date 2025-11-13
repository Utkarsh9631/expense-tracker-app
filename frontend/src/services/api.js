import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

/* This is the interceptor. It runs on every single request.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
  This is a response interceptor. If the server ever sends
  a 401 (Unauthorized) error, it means our token is bad
  or expired, so we automatically log the user out.
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Hard redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;