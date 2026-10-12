import axios from "axios";

/**
 * Centralized Axios API instance.
 * Automatically uses the '/api' relative path (proxied by Vite to port 4000).
 * withCredentials: true ensures cookies are passed along for authentication.
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
