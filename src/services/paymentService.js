import { privateApi, publicApi } from "@/api/axiosInstance";

export const ApiForCreatePaymentOrder = async (data) => {
  try {
    const response = await publicApi.post("create-razorpay-order", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApiForVerifyPayment = async (data) => {
  try {
    const response = await privateApi.post("razorpay-verification", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};