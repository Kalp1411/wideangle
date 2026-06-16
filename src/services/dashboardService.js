import { privateApi, publicApi } from "@/api/axiosInstance";

export const fetchDashboardData = async () => {
  try {
    const response = await privateApi.get("get-dashboard-summary");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchLoyaltyDataApi = async () => {
  try {
    const response = await privateApi.get("loyalty-my-wallet");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAvailablePerksApi = async () => {
  try {
    const response = await privateApi.get("get-available-perks");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSinglePerkDetailApi = async (perkId) => {
  try {
    const response = await privateApi.get(`get-loyalty-perk/${perkId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const redeemPerkApi = async (data) => {
  try {
    const response = await privateApi.post(`purchase-loyalty-perk/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPurchasedPerksApi = async (status) => {
  try {
    const response = await privateApi.get("getmy-purchased-perks", {
      params: { [status]: 1 },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};