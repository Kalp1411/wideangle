import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as dashboardService from "@/services/dashboardService";

const initialState = {};

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardService.fetchDashboardData();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchLoyaltyData = createAsyncThunk(
  "dashboard/fetchLoyaltyData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardService.fetchLoyaltyDataApi();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAvailablePerks = createAsyncThunk(
  "dashboard/fetchAvailablePerks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardService.fetchAvailablePerksApi();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSinglePerkDetail = createAsyncThunk(
  "dashboard/fetchSinglePerkDetail",
  async (perkId, { rejectWithValue }) => {
    try {
      const res = await dashboardService.fetchSinglePerkDetailApi(perkId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPurchasedPerks = createAsyncThunk(
  "dashboard/fetchPurchasedPerks",
  async (status, { rejectWithValue }) => {
    try {
      const res = await dashboardService.fetchPurchasedPerksApi(status);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const redeemPerk = createAsyncThunk(
  "dashboard/redeemPerk",
  async (data, { rejectWithValue }) => {
    try {
      const res = await dashboardService.redeemPerkApi(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default dashboardSlice.reducer;