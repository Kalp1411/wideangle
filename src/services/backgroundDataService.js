import { publicApi } from "@/api/axiosInstance";


export const getSetting = async () => {
  const response = await publicApi.get("setting");  
  return response.data;
};