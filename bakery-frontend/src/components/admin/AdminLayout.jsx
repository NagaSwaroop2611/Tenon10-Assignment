import { useState } from 'react'
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiPlus,
  FiMenu,
  FiUser,
  FiChevronDown
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector(s => s.auth)

  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logout())
    toast.success('Logged out')
    navigate('/login')
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
    ${isActive
      ? 'bg-brown text-cream shadow-sm'
      : 'text-brown/70 hover:bg-brown/5 hover:text-brown'
    }`

  return (
    <div className="flex min-h-screen bg-cream">

      {/* SIDEBAR */}
      <aside
        className={`bg-cream border-r border-brown/10 flex flex-col sticky top-0 h-screen transition-all duration-300
        ${collapsed ? 'w-16' : 'w-60'}`}
      >

        {/* HEADER */}
        <div className="p-5 border-b border-brown/10 flex items-center justify-between">
          {!collapsed && (
            <p className="font-medium text-brown text-sm">
              Admin Panel
            </p>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-brown"
          >
            <FiMenu />
          </button>
        </div>

        {/* ADD PRODUCT */}
        {/* <div className="px-4 py-4">
          <NavLink
            to="/admin/products/new"
            className="flex items-center gap-2 bg-brown text-cream px-3 py-2.5 rounded-xl text-sm w-full justify-center"
          >
            <FiPlus size={16} />
            {!collapsed && 'Add Product'}
          </NavLink>
        </div> */}

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 flex flex-col gap-1">

          <NavLink to="/admin" end className={navClass}>
            <FiGrid size={18} />
            {!collapsed && 'Dashboard'}
          </NavLink>

          <NavLink to="/admin/products" className={navClass}>
            <FiPackage size={18} />
            {!collapsed && 'Products'}
          </NavLink>

          <NavLink to="/admin/orders" className={navClass}>
            <FiShoppingBag size={18} />
            {!collapsed && 'Orders'}
          </NavLink>

          <NavLink to="/admin/customers" className={navClass}>
            <FiUsers size={18} />
            {!collapsed && 'Customers'}
          </NavLink>

          <NavLink to="/admin/profile" className={navClass}>
            <FiUser size={18} />
            {!collapsed && 'Profile'}
          </NavLink>

        </nav>

        {/* AVATAR DROPDOWN */}
        <div className="p-3 relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 w-full justify-between p-2 rounded-xl hover:bg-brown/5 transition"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brown text-cream flex items-center justify-center text-sm">
                {user?.name?.[0]}
              </div>

              {!collapsed && (
                <span className="text-sm text-brown">
                  {user?.name}
                </span>
              )}
            </div>

            {!collapsed && <FiChevronDown />}
          </button>

          {open && (
            <div className="absolute bottom-16 left-3 right-3 bg-white border shadow-lg rounded-xl p-2">

              <button
                className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100"
                onClick={() => navigate('/admin/profile')}
              >
                <FiUser /> Profile
              </button>

              <button
                className="flex items-center gap-2 w-full p-2 rounded hover:bg-gray-100 text-red-500"
                onClick={handleLogout}
              >
                <FiLogOut /> Logout
              </button>

            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  )
}