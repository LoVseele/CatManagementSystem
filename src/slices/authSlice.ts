
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

interface AuthState {
  token: string | null
  adminName: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  adminName: localStorage.getItem('adminName'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk('auth/login', async ({ username, password }: { username: string, password: string }, { rejectWithValue }) => {
  try {
    const res = await api.get('/admins', { params: { username, password } })
    if (!res.data || res.data.length === 0) {
      return rejectWithValue('用户名或密码错误')
    }
    const admin = res.data[0]
    return { token: 'mock-token', adminName: admin.name }
  } catch (e: any) {
    return rejectWithValue(e.message || '登录失败')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.adminName = null
      localStorage.removeItem('token')
      localStorage.removeItem('adminName')
    }
  },
  extraReducers: builder => {
    builder.addCase(login.pending, (state) => { state.loading = true; state.error = null })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.token = action.payload.token
      state.adminName = action.payload.adminName
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('adminName', action.payload.adminName)
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string || '登录失败'
    })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
