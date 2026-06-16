import { privateApi, publicApi } from "../api/axiosInstance";

export const login = async (credentials) => {
  try {
    const response = await publicApi.post(`/login`, credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyTokenGoogleFacebook = async (credentials) => {
  try {
    const response = await publicApi.post(`/verify-token-google-facebook`, credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const ApiForLoginWithMobile = async (credentials) => {
  try {
    const response = await publicApi.post(`/loginwithmobile`, credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const ApiForloginUserData = async () => {
  try {
    const response = await privateApi.get('get-loggedin-user');
    return response;
  } catch (error) {
    throw error;
  }
};

export const ApiForGetUserProfile = async () => {
  try {
    const response = await privateApi.get('/get-user-details');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApiForUpdateUserProfile = async (userData) => {
  try {
    const response = await privateApi.put('/user-profile-update', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const ApiForLogout = async () => {
  const response = await privateApi.post('/mobile-logout');
  return response.data;
};