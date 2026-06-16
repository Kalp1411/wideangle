import { privateApi, publicApi } from "@/api/axiosInstance";

export const ApiForCreateCheckoutSession = async (data) => {
  try {
    const response = await publicApi.post(`/create-checkout-session`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApiForGetCheckoutSessionSummary = async (id) => {
  try {
    const response = await publicApi.get(`/get-checkout-details/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

  export const apiForCheckEligibleOffers = async (data) => {
    try {
      console.log('data',data);
      
        const response = await privateApi.post(`check-offers-eligible`,data);
        return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const apiForBookingFoodAndTicket = async (data) => {
    try {      
        const response = await privateApi.post(`checkout-ticket-food-booking`,data);
        return response.data;
    } catch (error) {
      throw error;
    }
  };