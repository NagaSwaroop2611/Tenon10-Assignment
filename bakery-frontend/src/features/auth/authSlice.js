import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// ── Thunks ────────────────────────────────────────────────────────────────────
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/user/register', data)
    localStorage.setItem('token', res.data.token)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/user/login', data)
    localStorage.setItem('token', res.data.token)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/user/logout')
    localStorage.removeItem('token')
  } catch (err) {
    localStorage.removeItem('token')
    return rejectWithValue(err.response?.data?.message)
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/user/me')
    return res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.put('/user/update-profile', formData)
    return res.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

export const changePassword = createAsyncThunk('auth/changePassword', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/user/change-password', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Password change failed')
  }
})

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loadingProfile: false,
    loadingPassword: false,
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true;  state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(register.pending,  pending)
      .addCase(register.rejected, rejected)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
      })
      .addCase(login.pending,  pending)
      .addCase(login.rejected, rejected)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload.user
        state.token   = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(logout.fulfilled, (state) => {
        state.user  = null
        state.token = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(updateProfile.pending, (state) => {
        state.loadingProfile = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loadingProfile = false
        state.user = action.payload
      })
      .addCase(updateProfile.rejected, (state) => {
        state.loadingProfile = false
      })
      .addCase(changePassword.pending, (state) => {
        state.loadingPassword = true
      })
      .addCase(changePassword.fulfilled, (state) => { 
        state.loadingPassword = false

        // 🚨 FORCE LOGOUT AFTER PASSWORD CHANGE
        state.user = null
        state.token = null

        localStorage.removeItem('token')
        localStorage.removeItem('user')
       })
       .addCase(changePassword.rejected, (state) => {
        state.loadingPassword = false
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer