import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as foodService from "@/services/foodService";

const initialState = {
  selectedFoodData: null,
  clear_after_order: false,
  loading: false,
  error: null,
};

export const getFoodItems = createAsyncThunk(
  "foods/getFoodItems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await foodService.fetchFoodItems();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);



export const getFoodCombos = createAsyncThunk(
  "foods/getFoodCombos",
  async (_, { rejectWithValue }) => {
    try {
      const res = await foodService.fetchFoodCombos();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const foodSlice = createSlice({
  name: "foods",
  initialState,
  reducers: {},
  extraReducers: () => {},
});


export default foodSlice.reducer;