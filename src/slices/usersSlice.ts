// lovseele/catmanagementsystem/CatManagementSystem-feat/src/slices/usersSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getApplyListAPI,
  getUserInfoAPI,
  updateUserStatusAPI,
} from '../services';
import type { User, FetchUsersPayload, FetchUsersParams } from '../types';

// State 结构
interface UsersState {
  list: User[];
  totalUsers: number;
  current: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  totalUsers: 0,
  current: null,
  loading: false,
  error: null,
};

// 获取所有用户列表
export const fetchUsers = createAsyncThunk<FetchUsersPayload, FetchUsersParams>(
  'users/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const apiResponse = await getApplyListAPI(params);
      const response = apiResponse.data;

      if (response.code !== 200) {
        throw new Error(response.message || '获取用户列表失败');
      }

      return {
        list: response.data.data,
        total: response.data.total,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 根据 ID 获取单个用户信息
export const fetchUserById = createAsyncThunk<User, number>(
  'users/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const apiResponse = await getUserInfoAPI({ userId });
      const response = apiResponse.data;
      if (response.code !== 200) {
        throw new Error(response.message || '获取用户信息失败');
      }
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 更新用户状态
export const updateUserStatus = createAsyncThunk<
  User,
  { userId: number; status: string }
>('users/updateStatus', async (payload, { rejectWithValue }) => {
  try {
    const apiResponse = await updateUserStatusAPI(payload);
    const response = apiResponse.data;
    if (response.code !== 200) {
      throw new Error(response.message || '更新用户状态失败');
    }
    // 成功后，重新获取该用户的最新信息以确保数据同步
    const updatedUserApiResponse = await getUserInfoAPI({
      userId: payload.userId,
    });
    const updatedUserResponse = updatedUserApiResponse.data;
    return updatedUserResponse.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state: UsersState) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state: UsersState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      // FetchUsers
      .addCase(fetchUsers.pending, handlePending)
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<FetchUsersPayload>) => {
          state.loading = false;
          state.list = action.payload.list;
          state.totalUsers = action.payload.total;
        }
      )
      .addCase(fetchUsers.rejected, handleRejected)

      // FetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.current = action.payload;
        }
      )
      .addCase(fetchUserById.rejected, handleRejected)

      // UpdateUserStatus
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateUserStatus.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          const index = state.list.findIndex(
            (u) => u.userId === action.payload.userId
          );
          if (index !== -1) {
            state.list[index] = action.payload;
          }
          if (state.current && state.current.userId === action.payload.userId) {
            state.current = action.payload;
          }
        }
      )
      .addCase(updateUserStatus.rejected, handleRejected);
  },
});

export default usersSlice.reducer;
