// lovseele/catmanagementsystem/CatManagementSystem-feat/src/slices/scoresSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { submitScoreAPI, getScoresByUserIdAPI } from '../services';
import type { Score, SubmitScoreParams } from '../types';

interface ScoresState {
  items: Score[];
  loading: boolean;
  error: string | null;
}

const initialState: ScoresState = {
  items: [],
  loading: false,
  error: null,
};

//获取用户评分
export const fetchScoresByUser = createAsyncThunk<Score[], number>(
  'scores/fetchByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const apiResponse = await getScoresByUserIdAPI({ userId });
      const response = apiResponse.data;
      if (response.code !== 200)
        throw new Error(response.message || '获取评分列表失败');
      return response.data || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 添加用户评分
export const addScore = createAsyncThunk(
  'scores/add',
  async (params: SubmitScoreParams, { rejectWithValue }) => {
    try {
      const apiResponse = await submitScoreAPI(params);
      const response = apiResponse.data;
      if (response.code !== 200)
        throw new Error(response.message || '添加评分失败');
      return;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const scoresSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state: ScoresState) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state: ScoresState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchScoresByUser.pending, handlePending)
      .addCase(
        fetchScoresByUser.fulfilled,
        (state, action: PayloadAction<Score[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchScoresByUser.rejected, handleRejected)
      .addCase(addScore.pending, handlePending)
      .addCase(addScore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addScore.rejected, handleRejected);
  },
});

export default scoresSlice.reducer;
