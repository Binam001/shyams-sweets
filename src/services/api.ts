import axios from "axios";

// Create axios instance
export const api = axios.create({
  baseURL: "/api", // Use the proxy for development
  // baseURL: import.meta.env.VITE_BACKEND_URL || "/api",
  withCredentials: true, // Enable sending credentials like cookies
  headers: {
    "Content-Type": "application/json",
  },
});
