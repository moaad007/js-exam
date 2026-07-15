import axios from "axios";

const isLocal =
  typeof window !== "undefined" && window.location.hostname === "localhost";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (isLocal ? "http://localhost:4000/api" : "/api/backend");

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
