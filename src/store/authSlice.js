import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "@/services/authService";
import Cookies from "js-cookie";


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    const { user_name, password, mac } = credentials;
    try {
      const res = await authService.login({ user_name, password, mac });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.ApiForGetUserProfile();
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await authService.ApiForUpdateUserProfile(userData);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const verifyTokenGoogleFacebook = createAsyncThunk(
  "auth/verifyTokenGoogleFacebook",
  async (credentials, { rejectWithValue }) => {
    const { token, provider, device_type,device_token, channel } = credentials;
    try {
      const res = await authService.verifyTokenGoogleFacebook({ token, provider, device_type,device_token, channel });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    try {
      await authService.ApiForLogout();
    } catch (_) {
      // proceed with local logout even if API fails
    } finally {
      Cookies.remove("wa_web_token");
    }
  }
);

export const loginWithMobile = createAsyncThunk(
  "auth/loginWithMobile",
  async (credentials, { rejectWithValue }) => {
    const { token, phone, device_type,device_token, channel } = credentials;
    try {
      const res = await authService.ApiForLoginWithMobile({ token, phone, device_type,device_token, channel });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isAuthPopUpOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    openAuthPopUp(state) {
      state.isAuthPopUpOpen = true;
    },
    closeAuthPopUp(state) {
      state.isAuthPopUpOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // social login
      .addCase(verifyTokenGoogleFacebook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTokenGoogleFacebook.fulfilled, (state, action) => {
        console.log("Social login successful:", action.payload);
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyTokenGoogleFacebook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // otp login
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(loginWithMobile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithMobile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
      })
      .addCase(loginWithMobile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, openAuthPopUp, closeAuthPopUp } = authSlice.actions;
export default authSlice.reducer;