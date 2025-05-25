import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "https://positive-salmon-privately.ngrok-free.app/webhook/27988c11-8567-42d0-9bd4-c6892bc323a4",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 10000,
});

export default axiosInstance;
