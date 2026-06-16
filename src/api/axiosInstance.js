
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

export const privateApi = axios.create({
  baseURL: API_BASE_URL,
});

privateApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("wa_web_token");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    config.headers.Accept = "application/json";

    return config;
  },
  (error) => Promise.reject(error)
);

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      Cookies.remove("wa_web_token");
      const { store } = await import("@/store/store");
      const { logout } = await import("@/store/authSlice");
      store.dispatch(logout());
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);