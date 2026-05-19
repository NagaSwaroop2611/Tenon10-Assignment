import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const res = await api.get('/product/all', { params })
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/product/${id}`)
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdmin',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/product/admin/all', { params })
      return res.data.products
    } catch (err) {
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post('/product/create', formData)
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/product/${id}`, formData)
    return res.data.product
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/product/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/product/categories");
      return data.categories;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items:       [],
    selected:    null,
    adminItems:  [],
    categories: [],
    total:       0,
    page:        1,
    totalPages:  1,
    loading:     false,
    error:       null,
  },
  reducers: {
    clearSelected: (state) => { state.selected = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,  (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading    = false
        state.items      = action.payload.products
        state.total      = action.payload.total
        state.page       = action.payload.page
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchProduct.pending,   (state) => { state.loading = true })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload })
      .addCase(fetchProduct.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => { state.adminItems = action.payload })
      .addCase(createProduct.fulfilled, (state, action) => { state.adminItems.unshift(action.payload) })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.adminItems.findIndex(p => p._id === action.payload._id)
        if (idx !== -1) state.adminItems[idx] = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.adminItems = state.adminItems.filter(p => p._id !== action.payload)
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
  },
})

export const { clearSelected } = productSlice.actions
export default productSlice.reducer