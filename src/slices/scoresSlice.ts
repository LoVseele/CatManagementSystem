import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/request';

export interface Score {
  id?: number;
  userId: string; // equals user's id (openId)
  round: string;
  score: number;
  comment?: string;
  adminName: string;
}

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

export const fetchScoresByUser = createAsyncThunk<Score[], string>(
  'scores/fetchByUser',
  async (userId) => {
    const res = await api.get<Score[]>(`/scores?userId=${userId}`);
    return res.data;
  }
);

export const addScore = createAsyncThunk<Score, Score>(
  'scores/add',
  async (newScore) => {
    const res = await api.post<Score>('/scores', newScore);
    return res.data;
  }
);

export const editScore = createAsyncThunk<Score, Score>(
  'scores/edit',
  async (score) => {
    const res = await api.patch<Score>(`/scores/${score.id}`, score);
    return res.data;
  }
);

export const deleteScore = createAsyncThunk<number, number>(
  'scores/delete',
  async (id) => {
    await api.delete(`/scores/${id}`);
    return id;
  }
);

const scoresSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScoresByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchScoresByUser.fulfilled,
        (state, action: PayloadAction<Score[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchScoresByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '加载评分失败';
      })
      .addCase(addScore.fulfilled, (state, action: PayloadAction<Score>) => {
        state.items.push(action.payload);
      })
      .addCase(editScore.fulfilled, (state, action: PayloadAction<Score>) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(
        deleteScore.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter((s) => s.id !== action.payload);
        }
      );
  },
});

export default scoresSlice.reducer;
