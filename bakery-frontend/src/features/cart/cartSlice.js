import { createSlice } from '@reduxjs/toolkit'

const load = () => {
  try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
}
const save = (items) => localStorage.setItem('cart', JSON.stringify(items))

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: load() },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i._id === action.payload._id)
      if (existing) {
        existing.quantity += action.payload.quantity || 1
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 })
      }
      save(state.items)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload)
      save(state.items)
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(i => i._id === action.payload.id)
      if (item) item.quantity = action.payload.quantity
      save(state.items)
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cart')
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

// Selectors
export const selectCartItems   = (state) => state.cart.items
export const selectCartCount   = (state) => state.cart.items.reduce((s, i) => s + i.quantity, 0)
export const selectCartTotal   = (state) => state.cart.items.reduce((s, i) => s + i.price * i.quantity, 0)

export default cartSlice.reducer