import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and refresh token on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt refresh (endpoint to be implemented)
        const { data } = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        localStorage.setItem("token", data.token);
        API.defaults.headers.Authorization = `Bearer ${data.token}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
