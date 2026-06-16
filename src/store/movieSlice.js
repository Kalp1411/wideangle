import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as movieService from "@/services/movieService";

const initialState = {
  nowstreamingmovies: [],
  upcomingmovies: [],
  nowstreamingcategories: [],
  upcomingcategories: [],
  allcategories: [],
  nowstreamingmovietrailers: [],
  upcomingmovietrailers: [],
  singleMovieDetail: null,
  availableShowtimes: [],
  loading: {
    nowstreamingmovies: false,
    upcomingmovies: false,
    nowstreamingcategories: false,
    upcomingcategories: false,
    allcategories: false,
    nowstreamingmovietrailers: false,
    upcomingmovietrailers: false,
    singleMovieDetail: false,
    availableShowtimes: false,
  },
  error: null,
};

// Movies (Now Streaming / Upcoming)
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await movieService.ApiForFetchMovies(params);
      return {
        params,
        data: res.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Categories
export const fetchMovieCategories = createAsyncThunk(
  "movies/fetchMovieCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await movieService.ApiForFetchMovieCategories(params);
      return {
        params,
        data: res.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Trailers
export const fetchMovieTrailers = createAsyncThunk(
  "movies/fetchMovieTrailers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await movieService.ApiForFetchMovieTrailers(params);
      return {
        params,
        data: res.data,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Single Movie Detail
export const fetchSingleMovieDetail = createAsyncThunk(
  "movies/fetchSingleMovieDetail",
  async (movieSlug, { rejectWithValue }) => {
    try {
      const res = await movieService.ApiForFetchSingleMovieDetail(movieSlug);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// get available showtimes for a movie on a particular date
export const fetchAvailableShowtimes = createAsyncThunk(
  "movies/fetchAvailableShowtimes",
  async (params, { rejectWithValue }) => {
    try {
      const {movie_id, date} = params;
      const res = await movieService.ApiForFetchAvailableShowtimes({ movie_id, date });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchSeatOfShowtime = createAsyncThunk(
  "movies/fetchSeatOfShowtime",
  async (id, { rejectWithValue }) => {
    try {
      const res = await movieService.ApiForFetchSeatOfShowtime(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // MOVIES
      .addCase(fetchMovies.pending, (state, action) => {
        const { is_now_streaming, is_upcoming } = action.meta.arg || {};
        if (is_now_streaming) {
          state.loading.nowstreamingmovies = true;
        } else if (is_upcoming) {
          state.loading.upcomingmovies = true;
        }

        state.error = null;
      })

      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { params, data } = action.payload;
        if (params.is_now_streaming) {
          state.loading.nowstreamingmovies = false;
          state.nowstreamingmovies = data;
        } else if (params.is_upcoming) {
          state.loading.upcomingmovies = false;
          state.upcomingmovies = data;
        }
      })

      .addCase(fetchMovies.rejected, (state, action) => {
        const { is_now_streaming, is_upcoming } = action.meta.arg || {};
        if (is_now_streaming) {
          state.loading.nowstreamingmovies = false;
        } else if (is_upcoming) {
          state.loading.upcomingmovies = false;
        }
        state.error = action.payload;
      })

      // CATEGORIES
      .addCase(fetchMovieCategories.pending, (state, action) => {
        const { is_now_streaming, is_upcoming } = action.meta.arg || {};
        if (is_now_streaming) {
          state.loading.nowstreamingcategories = true;
        } else if (is_upcoming) {
          state.loading.upcomingcategories = true;
        } else {
          state.loading.allcategories = true;
        }
        state.error = null;
      })

      .addCase(fetchMovieCategories.fulfilled, (state, action) => {
        const { params, data } = action.payload;
        if (params.is_now_streaming) {
          state.loading.nowstreamingcategories = false;
          state.nowstreamingcategories = data;
        } else if (params.is_upcoming) {
          state.loading.upcomingcategories = false;
          state.upcomingcategories = data;
        } else {
          state.loading.allcategories = false;
          state.allcategories = data;
        }
      })

      .addCase(fetchMovieCategories.rejected, (state, action) => {
        const { is_now_streaming, is_upcoming } = action.meta.arg || {};
        if (is_now_streaming) {
          state.loading.nowstreamingcategories = false;
        } else if (is_upcoming) {
          state.loading.upcomingcategories = false;
        } else {
          state.loading.allcategories = false;
        }
        state.error = action.payload;
      })

      // trailers
      .addCase(fetchMovieTrailers.pending, (state, action) => {
        const { is_now_streaming, is_upcoming } = action.meta.arg || {};
        if (is_now_streaming) {
          state.loading.nowstreamingmovietrailers = true;
        } else if (is_upcoming) {
          state.loading.upcomingmovietrailers = true;
        }
        state.error = null;
      })

      .addCase(fetchMovieTrailers.fulfilled, (state, action) => {
        const { params, data } = action.payload;
        if (params.is_now_streaming) {
          state.loading.nowstreamingmovietrailers = false;
          state.nowstreamingmovietrailers = data;
        } else if (params.is_upcoming) {
          state.loading.upcomingmovietrailers = false;
          state.upcomingmovietrailers = data;
        }
      })

      .addCase(fetchMovieTrailers.rejected, (state, action) => {
        const { is_now_streaming, is_upcoming } = action.meta.arg || {};
        if (is_now_streaming) {
          state.loading.nowstreamingmovietrailers = false;
        } else if (is_upcoming) {
          state.loading.upcomingmovietrailers = false;
        }
        state.error = action.payload;
      })

      // SINGLE MOVIE DETAIL
      .addCase(fetchSingleMovieDetail.pending, (state) => {
        state.loading.singleMovieDetail = true;
        state.error = null;
      })

      .addCase(fetchSingleMovieDetail.fulfilled, (state, action) => {
        state.loading.singleMovieDetail = false;
        state.singleMovieDetail = action.payload;
      })

      .addCase(fetchSingleMovieDetail.rejected, (state, action) => {
        state.loading.singleMovieDetail = false;
        state.error = action.payload;
      })

      // AVAILABLE SHOWTIMES
      .addCase(fetchAvailableShowtimes.pending, (state) => {
        state.loading.availableShowtimes = true;
        state.error = null;
      })
      .addCase(fetchAvailableShowtimes.fulfilled, (state, action) => {
        state.loading.availableShowtimes = false;
        state.availableShowtimes = action.payload;
      })
      .addCase(fetchAvailableShowtimes.rejected, (state, action) => {
        state.loading.availableShowtimes = false;
        state.error = action.payload;
      });
  },
});

export default movieSlice.reducer;