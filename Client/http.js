import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "Application/json",
  }
});

export default http;