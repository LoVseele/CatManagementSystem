// lovseele/catmanagementsystem/CatManagementSystem-feat/src/slices/usersSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 导入我们已经确认无误的真实 API 函数
import { getApplyListAPI, getUserInfoAPI } from '../services';
import type { User } from '../types';

// 1. 定义 Slice State 的结构
// 我们需要 list 来存放当前页的用户数据，totalUsers 来支持分页器的总数显示
interface UsersState {
  list: User[];
  totalUsers: number;
  current: User | null;
  loading: boolean;
  error: string | null;
}

// 2. 初始化 State
const initialState: UsersState = {
  list: [],
  totalUsers: 0,
  current: null,
  loading: false,
  error: null,
};

// 3. 定义 fetchUsers 异步 action 成功后返回的数据结构
interface FetchUsersPayload {
  list: User[];
  total: number;
}

// 4. 创建获取用户列表的异步 action (thunk)
export const fetchUsers = createAsyncThunk<
  FetchUsersPayload,
  { pageNum: number; pageSize: number }
>('users/fetchAll', async (params, { rejectWithValue }) => {
  try {
    // 调用 API，因为拦截器生效，这里直接得到 { code, message, data }
    const apiResponse = await getApplyListAPI(params);

    if (apiResponse.code !== 200) {
      throw new Error(apiResponse.message || '获取用户列表失败');
    }

    // 【核心】从后端返回的嵌套结构中，正确地提取出用户列表和总数
    return {
      list: apiResponse.data.data, // 真正的用户数组
      total: apiResponse.data.total, // 用户总数
    };
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || '请求用户列表失败';
    return rejectWithValue(errorMessage);
  }
});

// 5. 创建根据 ID 获取单个用户信息的异步 action (thunk)
export const fetchUserById = createAsyncThunk<User, number>(
  'users/fetchById',
  async (userId, { rejectWithValue }) => {
    try {
      const apiResponse = await getUserInfoAPI({ userId });
      if (apiResponse.code !== 200) {
        throw new Error(apiResponse.message || '获取用户信息失败');
      }
      return apiResponse.data; // 直接返回 User 对象
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || '请求用户信息失败';
      return rejectWithValue(errorMessage);
    }
  }
);

/*
// 6. 暂时注释掉 updateUserProgress 功能
// 注意：当前接口文档中没有提供更新单个用户状态的接口。
// 当后端提供了例如 updateUserState(userId, state) 的接口后，可以在这里取消注释并重构。
export const updateUserProgress = createAsyncThunk(
  'users/updateProgress',
  async ({ userId, state }: { userId: number; state: string }, { rejectWithValue }) => {
    // try {
    //   const response = await updateUserStateAPI({ userId, state });
    //   if (response.code !== 200) throw new Error(response.message);
    //   return response.data;
    // } catch (err) { ... }
  }
);
*/

// 7. 创建 Slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 处理 fetchUsers 的各种状态
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // 将 action.payload 中返回的数据，分别赋值给 state
        state.list = action.payload.list;
        state.totalUsers = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 处理 fetchUserById 的各种状态
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload; // action.payload 就是返回的单个 User 对象
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    /*
      // 待 updateUserProgress 接口准备好后，再取消这里的注释
      .addCase(updateUserProgress.fulfilled, (state, action) => {
        // 更新列表中的对应用户
        const idx = state.list.findIndex((u) => u.userId === action.payload.userId);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        }
        // 如果当前详情页显示的就是这个用户，也一并更新
        if (state.current && state.current.userId === action.payload.userId) {
          state.current = action.payload;
        }
      });
      */
  },
});

export default usersSlice.reducer;
