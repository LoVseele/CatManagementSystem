// lovseele/catmanagementsystem/CatManagementSystem-feat/src/slices/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminLoginAPI } from '../services';
import type { AdminLoginParams, LoginPayload } from '../types';

interface AuthState {
  token: string | null;
  adminName: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  adminName: localStorage.getItem('adminName'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<LoginPayload, AdminLoginParams>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const apiResponse = await adminLoginAPI(credentials);
      const response = apiResponse.data;

      if (response.code !== 200) {
        throw new Error(response.message || '登录验证失败');
      }

      return {
        token: response.data.token,
        adminName: response.data.user.username,
      };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || '登录请求失败';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.adminName = null;
      localStorage.removeItem('token');
      localStorage.removeItem('adminName');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.adminName = action.payload.adminName;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('adminName', action.payload.adminName);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || '登录发生未知错误';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
