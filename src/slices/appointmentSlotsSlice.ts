// lovseele/catmanagementsystem/CatManagementSystem-feat/src/slices/appointmentSlotsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getAppointmentTimeListAPI,
  addAppointmentTimeAPI,
  updateAppointmentSlotAPI,
  deleteAppointmentSlotAPI,
} from '../services';
import type { AppointmentSlot } from '../types';

interface State {
  list: AppointmentSlot[];
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  list: [],
  loading: false,
  error: null,
};

// 获取时间段列表
export const fetchSlots = createAsyncThunk<AppointmentSlot[]>(
  'appointmentSlots/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const apiResponse = await getAppointmentTimeListAPI();
      const response = apiResponse.data;
      if (response.code !== 200)
        throw new Error(response.message || '获取时间段列表失败');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 添加新的预约时间段
export const addSlot = createAsyncThunk(
  'appointmentSlots/add',
  async (
    params: Omit<AppointmentSlot, 'id' | 'appointedCount'>,
    { rejectWithValue }
  ) => {
    try {
      const { capacity, ...rest } = params;
      const apiParams = {
        ...rest,
        interviewNumber: capacity,
      };

      const apiResponse = await addAppointmentTimeAPI(apiParams);
      console.log(apiParams);
      const response = apiResponse.data;
      console.log(response);
      if (response.code !== 200)
        throw new Error(response.message || '新增时间段失败');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 更改预约时间段
export const updateSlot = createAsyncThunk<AppointmentSlot, AppointmentSlot>(
  'appointmentSlots/update',
  async (payload, { rejectWithValue }) => {
    try {
      const apiResponse = await updateAppointmentSlotAPI(payload);
      const response = apiResponse.data;
      if (response.code !== 200)
        throw new Error(response.message || '更新时间段失败');
      // 确保返回更新后的数据以便在 state 中更新
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 删除预约时间段
export const deleteSlot = createAsyncThunk<number, number>(
  'appointmentSlots/delete',
  async (appointmentSlotId, { rejectWithValue }) => {
    try {
      const apiResponse = await deleteAppointmentSlotAPI({ appointmentSlotId });
      const response = apiResponse.data;
      if (response.code !== 200)
        throw new Error(response.message || '删除时间段失败');
      return appointmentSlotId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const appointmentSlotsSlice = createSlice({
  name: 'appointmentSlots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state: State) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state: State, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchSlots.pending, handlePending)
      .addCase(
        fetchSlots.fulfilled,
        (state, action: PayloadAction<AppointmentSlot[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(fetchSlots.rejected, handleRejected)
      .addCase(addSlot.pending, handlePending)
      .addCase(addSlot.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addSlot.rejected, handleRejected)
      .addCase(updateSlot.pending, handlePending)
      .addCase(
        updateSlot.fulfilled,
        (state, action: PayloadAction<AppointmentSlot>) => {
          state.loading = false;
          const index = state.list.findIndex(
            (slot) => slot.id === action.payload.id
          );
          if (index !== -1) {
            state.list[index] = action.payload;
          }
        }
      )
      .addCase(updateSlot.rejected, handleRejected)
      .addCase(deleteSlot.pending, handlePending)
      .addCase(deleteSlot.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.list = state.list.filter((slot) => slot.id !== action.payload);
      })
      .addCase(deleteSlot.rejected, handleRejected);
  },
});

export default appointmentSlotsSlice.reducer;
