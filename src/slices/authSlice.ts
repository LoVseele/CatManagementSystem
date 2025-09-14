// lovseele/catmanagementsystem/CatManagementSystem-feat/src/slices/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminLoginAPI } from '../services';
import type { AdminLoginRequest, LoginResponseData } from '../types';

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

// 我们承诺，如果 thunk 成功，将返回 LoginResponseData 类型的数据
export const login = createAsyncThunk<LoginResponseData, AdminLoginRequest>(
  'auth/login',
  async (params, { rejectWithValue }) => {
    try {
      // 1. 调用 API。因为拦截器已生效，这里直接得到 { code, message, data }
      const apiResponse = await adminLoginAPI(params);

      // 2. 检查业务 code 是否成功
      if (apiResponse.code !== 200) {
        // 请根据后端实际的成功 code 调整
        throw new Error(apiResponse.message || '登录验证失败');
      }

      // 3. 直接返回核心的 data 数据，它就是 LoginResponseData 类型
      return apiResponse.data;
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
        // action.payload 就是上面 thunk 返回的 LoginResponseData 对象
        const { token, user } = action.payload;

        state.loading = false;
        state.token = token;
        state.adminName = user.username; // 从 user 对象中获取 username

        // 将 token 和 adminName 存入 localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('adminName', user.username);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || '登录发生未知错误';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
