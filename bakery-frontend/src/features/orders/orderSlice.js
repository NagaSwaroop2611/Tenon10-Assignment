import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const placeOrder = createAsyncThunk('orders/place', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/order/place', data)
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order failed')
  }
})

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/order/my-orders')
    return res.data.orders
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/order/${id}`)
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/order/${id}/cancel`)
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/order/admin/all', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/order/${id}/status`, { status })
    return res.data.order
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders:    [],
    allOrders:   [],
    selected:    null,
    lastPlaced:  null,
    total:       0,
    totalPages:  1,
    loading:     false,
    error:       null,
  },
  reducers: {
    clearLastPlaced: (state) => { state.lastPlaced = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(placeOrder.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; state.lastPlaced = action.payload })
      .addCase(fetchMyOrders.pending,   (state) => { state.loading = true })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.myOrders = action.payload })
      .addCase(fetchMyOrders.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.selected = action.payload })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const idx = state.myOrders.findIndex(o => o._id === action.payload._id)
        if (idx !== -1) state.myOrders[idx] = action.payload
      })
      .addCase(fetchAllOrders.pending,   (state) => { state.loading = true })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading    = false
        state.allOrders  = action.payload.orders
        state.total      = action.payload.total
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchAllOrders.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.allOrders.findIndex(o => o._id === action.payload._id)
        if (idx !== -1) state.allOrders[idx] = action.payload
      })
  },
})

export const { clearLastPlaced } = orderSlice.actions
export default orderSlice.reducer