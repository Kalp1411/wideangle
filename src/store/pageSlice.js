import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as pageService from "@/services/pageService";



export const getPages = createAsyncThunk(
  "page/getPages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await pageService.fetchPageDataApi();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getPageById = createAsyncThunk(
  "page/getPageById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await pageService.fetchPageByIdApi(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const storePage= createAsyncThunk(
  "page/storePage",
  async (data, { rejectWithValue }) => {
    try {
      const res = await pageService.registerPageApi(data);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePageData = createAsyncThunk(
  "page/updatePageData",
  async ({id,data}, { rejectWithValue }) => {
    try {
      const res = await pageService.updatePageApi(id,data);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const destroyPage = createAsyncThunk(
  "page/destroyPage",
  async (id, { rejectWithValue }) => {    
    try {
      const res = await pageService.deletePageApi(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const pageSlice = createSlice({
  name: "page",
  initialState:[],
  reducers: {},
  extraReducers: () => {},
});


export default pageSlice.reducer;