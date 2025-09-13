// src/slices/appointmentSlotsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/request';
import type { AppointmentSlot } from '../types';

interface State {
  list: AppointmentSlot[];
  loading: boolean;
  error: string | null;
}

const initialState: State = { list: [], loading: false, error: null };

//获取预约时间段信息
export const fetchSlots = createAsyncThunk('slots/fetch', async () => {
  const res = await api.get<AppointmentSlot[]>('/appointmentSlots');
  return res.data;
});

//添加新的预约时间段
export const addSlot = createAsyncThunk(
  'slots/add',
  async (payload: AppointmentSlot) => {
    const res = await api.post<AppointmentSlot>('/appointmentSlots', payload);
    return res.data;
  }
);

//更改预约时间段
export const updateSlot = createAsyncThunk(
  'slots/update',
  async (payload: AppointmentSlot) => {
    if (!payload.id) throw new Error('slot id required');
    const res = await api.put<AppointmentSlot>(
      `/appointmentSlots/${payload.id}`,
      payload
    );
    return res.data;
  }
);

//删除预约时间段
export const deleteSlot = createAsyncThunk(
  'slots/delete',
  async (id: number) => {
    await api.delete(`/appointmentSlots/${id}`);
    return id;
  }
);

const slice = createSlice({
  name: 'appointmentSlots',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchSlots.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(
        fetchSlots.fulfilled,
        (s, a: PayloadAction<AppointmentSlot[]>) => {
          s.loading = false;
          s.list = a.payload;
        }
      )
      .addCase(fetchSlots.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || '加载失败';
      })

      .addCase(addSlot.fulfilled, (s, a: PayloadAction<AppointmentSlot>) => {
        s.list.push(a.payload);
      })
      .addCase(updateSlot.fulfilled, (s, a: PayloadAction<AppointmentSlot>) => {
        const idx = s.list.findIndex((x) => x.id === a.payload.id);
        if (idx !== -1) s.list[idx] = a.payload;
      })
      .addCase(deleteSlot.fulfilled, (s, a: PayloadAction<number>) => {
        s.list = s.list.filter((x) => x.id !== a.payload);
      });
  },
});

export default slice.reducer;
