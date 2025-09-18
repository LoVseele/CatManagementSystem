// lovseele/catmanagementsystem/CatManagementSystem-feat/src/slices/appointmentsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUsersByAppointmentTimeAPI } from '../services';
import type { User } from '../types';

interface State {
  list: User[];
  loading: boolean;
  error: string | null;
}

const initialState: State = { list: [], loading: false, error: null };

// 获取当前时间段的预约用户
export const fetchAppointmentsBySlot = createAsyncThunk<User[], number>(
  'appointments/fetchBySlot',
  async (appointmentSlotId, { rejectWithValue }) => {
    try {
      const apiResponse = await getUsersByAppointmentTimeAPI({
        appointmentSlotId,
      });
      const response = apiResponse.data;
      if (response.code !== 200)
        throw new Error(response.message || '获取预约用户列表失败');
      return response.data || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearAppointments: (state) => {
      state.list = [];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchAppointmentsBySlot.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(
        fetchAppointmentsBySlot.fulfilled,
        (s, a: PayloadAction<User[]>) => {
          s.loading = false;
          s.list = a.payload;
        }
      )
      .addCase(fetchAppointmentsBySlot.rejected, (s, a) => {
        s.loading = false;
        s.error = (a.payload as string) || '加载失败';
      });
  },
});

export const { clearAppointments } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
