import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_N8N_WEBHOOK_URL || "http://localhost:5678",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 5000,
});

export default axiosInstance;
