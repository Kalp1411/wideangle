import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as boxOfficeService from "@/services/boxOfficeServices";

const initialState = {  
  loading: false,
  error: null,
};

export const fetchNowPlayingMovie = createAsyncThunk(
  "boxoffice/fetchNowPlayingMovie",
  async (_, { rejectWithValue }) => {
    try {
      const res = await boxOfficeService.getNowPlayingMovie();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const holdBoxOfficeTicket = createAsyncThunk(
  "boxoffice/holdBoxOfficeTicket",
  async (data, { rejectWithValue }) => {
    try {      
      const res = await boxOfficeService.holdBoxOfficeTicketPost(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getHoldBoxOfficeTicket = createAsyncThunk(
  "boxoffice/getHoldBoxOfficeTicket",
  async (data, { rejectWithValue }) => {
    try {      
      const res = await boxOfficeService.ApiForGetHoldBoxOfficeTicket(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const releaseHoldTicket = createAsyncThunk(
  "boxoffice/releaseHoldTicket",
  async ({hold_token}, { rejectWithValue }) => {
    try {            
      const res = await boxOfficeService.releaseHoldTicketApi({hold_token});
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getBookedTickets = createAsyncThunk(
  "boxoffice/getBookedTickets",
  async (_, { rejectWithValue }) => {
    try {            
      const res = await boxOfficeService.getBookedTicketsApi();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getSingleBookedTicket = createAsyncThunk(
  "boxoffice/getSingleBookedTicket",
  async (id, { rejectWithValue }) => {
    try {            
      const res = await boxOfficeService.getSingleBookedTicketsApi(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const boxOfficeSlice = createSlice({
  name: "boxoffice",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export default boxOfficeSlice.reducer;