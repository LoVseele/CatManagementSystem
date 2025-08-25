import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export interface User {
  id: string;
  openId: string;
  userName: string;
  userNumber: number;
  academy: string;
  direction: string;
  phoneNumber: string;
  email: string;
  userIntro: string;
  progress?: string;
}

interface UsersState {
  list: User[];
  current: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const res = await api.get<User[]>('/users');
  return res.data;
});

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id: string) => {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  }
);

export const updateUserProgress = createAsyncThunk(
  'users/updateProgress',
  async ({ id, progress }: { id: string; progress: string }) => {
    const res = await api.patch(`/users/${id}`, { progress });
    return res.data;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户失败';
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取用户失败';
      })
      .addCase(updateUserProgress.fulfilled, (state, action) => {
        if (state.current && state.current.id === action.payload.id)
          state.current = action.payload;
        const idx = state.list.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export default usersSlice.reducer;
