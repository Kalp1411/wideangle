import { publicApi } from "@/api/axiosInstance";

export const getFoodApi = async () => {  
  try {
    const response = await publicApi.get('food');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const makeOrderApi = async (data) => {
  try {
    const response = await publicApi.post('food-book',data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFoodItems = async () => {
  try {
    const response = await publicApi.get('food');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFoodCombos = async () => {
  try {
    const response = await publicApi.get('get-food-combo');
    return response.data;
  } catch (error) {
    throw error;
  }
};