import { Routes, Route } from 'react-router-dom'

// Layouts
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'

// Guards
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/layout/Guards'

// Customer pages
import Home from './pages/customer/Home'
import Products from './pages/customer/Products'
import ProductDetail from './pages/customer/ProductDetail'
import { Cart, Checkout } from './pages/customer/CartCheckout'
import Profile from './pages/customer/Profile'
import { OrderConfirmation, MyOrders } from './pages/customer/Orders'

// Auth pages
import Login from './pages/customer/Login'
import Register from './pages/customer/Register'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminCustomers from './pages/admin/Customer'
import AdminProfile from './pages/admin/Profile'
import AdminOrderDetails from './pages/admin/OrderDetails'
import NotFound from './components/layout/NotFound'

export default function App() {
  return (
    <Routes>

      {/* ================= PUBLIC + CUSTOMER UI ================= */}
      <Route element={<Layout />}>

        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Protected */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      </Route>

      {/* ================= AUTH (NO LAYOUT) ================= */}
      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />

      <Route path="/register" element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      } />

      {/* ================= ADMIN ================= */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>

        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />

      </Route>
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}