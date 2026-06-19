import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingService from "@/services/bookingService";



export const createCheckoutSession = createAsyncThunk(
  "bookings/createCheckoutSession",
  async (data, { rejectWithValue }) => {    
    try {
      const res = await bookingService.ApiForCreateCheckoutSession(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const apiForCheckEligibleOffers = createAsyncThunk(
  "bookings/apiForCheckEligibleOffers",
  async (data, { rejectWithValue }) => {    
    try {
      const res = await bookingService.apiForCheckEligibleOffers(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAvailablePerks = createAsyncThunk(
  "bookings/getAvailablePerks",
  async (data, { rejectWithValue }) => {    
    try {
      const res = await bookingService.apiForGetAvailablePerks(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const bookingFoodAndTicket = createAsyncThunk(
  "bookings/bookingFoodAndTicket",
  async (data, { rejectWithValue }) => {    
    try {
      const res = await bookingService.apiForBookingFoodAndTicket(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getCheckoutSessionSummary = createAsyncThunk(
  "bookings/getCheckoutSessionSummary",
  async (id, { rejectWithValue }) => {    
    try {
      const res = await bookingService.ApiForGetCheckoutSessionSummary(id);
      return res.data;
    } catch (error) {      
      return rejectWithValue(error.response?.data);
    }
  }
);



const bookingSlice = createSlice({
  name: "bookings",
  initialState:[],
  reducers: {},
  extraReducers: () => {},
});


export default bookingSlice.reducer;