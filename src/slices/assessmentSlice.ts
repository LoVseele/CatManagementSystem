// lovseele/catmanagementsystem/CatManagementSystem-feat/src/slices/assessmentSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAssessmentInfo, submitScoreAPI } from '../services';
import type { AssessmentInfo, SubmitScoreParams } from '../types';

// 2. 定义 Slice State 的结构
interface AssessmentState {
  assessments: AssessmentInfo[];
  loading: boolean;
  error: string | null;
}

const initialState: AssessmentState = {
  assessments: [],
  loading: false,
  error: null,
};

// 根据用户 ID 获取其所有考核信息
export const fetchAssessmentsByUser = createAsyncThunk<
  AssessmentInfo[],
  number
>('assessment/fetchByUser', async (userId, { rejectWithValue }) => {
  try {
    const apiResponse = await getAssessmentInfo({ userId });
    const response = apiResponse.data;
    if (response.code !== 200) {
      throw new Error(response.message || '获取考核信息失败');
    }
    return response.data || [];
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addScore = createAsyncThunk(
  'assessment/addScore',
  async (params: SubmitScoreParams, { rejectWithValue }) => {
    try {
      const apiResponse = await submitScoreAPI(params);
      const response = apiResponse.data;
      if (response.code !== 200) {
        throw new Error(response.message || '添加评分失败');
      }
      return;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 5. 创建 Slice
const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state: AssessmentState) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state: AssessmentState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(fetchAssessmentsByUser.pending, handlePending)
      .addCase(
        fetchAssessmentsByUser.fulfilled,
        (state, action: PayloadAction<AssessmentInfo[]>) => {
          state.loading = false;
          state.assessments = action.payload;
        }
      )
      .addCase(fetchAssessmentsByUser.rejected, handleRejected)
      .addCase(addScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addScore.rejected, handleRejected);
  },
});

export default assessmentSlice.reducer;
