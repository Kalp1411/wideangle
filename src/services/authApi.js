import axiosInstance from "../api/axiosInstance";

export const login = (data) => axiosInstance.post("/login", data);