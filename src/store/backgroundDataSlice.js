import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as backgroundDataService from "@/services/backgroundDataService";

const initialState = {
  setting: null,
  loading: false,
  error: null,
};

export const fetchSetting = createAsyncThunk(
  "backgroundData/fetchSetting",
  async (_, { rejectWithValue }) => {
    try {
      const res = await backgroundDataService.getSetting();
      return res.data[0];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const backgroundDataSlice = createSlice({
  name: "backgroundData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSetting.fulfilled, (state, action) => {
        console.log("fetchSetting fulfilled with payload:", action.payload);
        state.loading = false;
        state.setting = action.payload;
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });      
  },
});

export default backgroundDataSlice.reducer;