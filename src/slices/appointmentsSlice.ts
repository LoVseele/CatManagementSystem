// src/slices/appointmentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import type { Appointment } from '../types';

interface State {
  list: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: State = { list: [], loading: false, error: null };

// 获取所有预约
export const fetchAppointments = createAsyncThunk(
  'appointments/fetch',
  async () => {
    const res = await api.get<Appointment[]>('/appointments');
    return res.data;
  }
);

// 新增预约：同时尝试把相应 slot 的 interviewCurrentNumber +1
export const addAppointment = createAsyncThunk(
  'appointments/add',
  async (payload: Appointment, { rejectWithValue }) => {
    try {
      // 1) 创建预约记录
      const res = await api.post<Appointment>('/appointments', payload);

      // 2) 查找对应 slot（date/time/direction）
      const slotRes = await api.get<any[]>(
        `/appointmentSlots?interviewDate=${
          payload.interviewDate
        }&interviewTime=${encodeURIComponent(
          payload.interviewTime
        )}&direction=${encodeURIComponent(payload.direction)}`
      );
      const slot = slotRes.data[0];
      if (slot) {
        // 尝试 +1（后端是 json-server -> put/patch）
        const newCurrent = (slot.interviewCurrentNumber || 0) + 1;
        await api.patch(`/appointmentSlots/${slot.id}`, {
          interviewCurrentNumber: newCurrent,
        });
      }
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message || '添加失败');
    }
  }
);

// 删除预约：同时尝试把对应 slot 的 interviewCurrentNumber -1（不低于0）
export const deleteAppointment = createAsyncThunk(
  'appointments/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      // 1) 先获取预约记录，确定 slot 信息
      const aRes = await api.get<any>(`/appointments/${id}`);
      const ap = aRes.data;
      await api.delete(`/appointments/${id}`);

      // 2) 找到对应 slot 并 -1
      const slotRes = await api.get<any[]>(
        `/appointmentSlots?interviewDate=${
          ap.interviewDate
        }&interviewTime=${encodeURIComponent(
          ap.interviewTime
        )}&direction=${encodeURIComponent(ap.direction)}`
      );
      const slot = slotRes.data[0];
      if (slot) {
        const newCurrent = Math.max(0, (slot.interviewCurrentNumber || 0) - 1);
        await api.patch(`/appointmentSlots/${slot.id}`, {
          interviewCurrentNumber: newCurrent,
        });
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || '删除失败');
    }
  }
);

const slice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchAppointments.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(
        fetchAppointments.fulfilled,
        (s, a: PayloadAction<Appointment[]>) => {
          s.loading = false;
          s.list = a.payload;
        }
      )
      .addCase(fetchAppointments.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message || '加载失败';
      })

      .addCase(addAppointment.fulfilled, (s, a: PayloadAction<Appointment>) => {
        s.list.push(a.payload);
      })
      .addCase(deleteAppointment.fulfilled, (s, a: PayloadAction<number>) => {
        s.list = s.list.filter((x) => x.id !== a.payload);
      });
  },
});

export default slice.reducer;
