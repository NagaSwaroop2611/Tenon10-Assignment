import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { logout } from '../../features/auth/authSlice'
import { selectCartCount } from '../../features/cart/cartSlice'
import toast from 'react-hot-toast'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const cartCount = useSelector(selectCartCount)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logout())
    toast.success('Logged out!')
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-brown/10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-serif text-xl font-bold text-brown">Crumbs & Co</Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/products" className="text-sm text-brown/70 hover:text-brown transition-colors">Bakery Products</Link>
          <Link to="/my-orders" className="text-sm text-brown/70 hover:text-brown transition-colors">My Orders</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 hover:bg-brown/5 rounded-full transition-colors">
            <FiShoppingBag className="text-brown" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="p-2 hover:bg-brown/5 rounded-full transition-colors">
                {user.profilePic
                  ? <img src={user.profilePic} alt="" className="w-7 h-7 rounded-full object-cover" />
                  : <FiUser className="text-brown" size={20} />
                }
              </button>
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-brown/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/profile" className="block px-4 py-2.5 text-sm text-brown hover:bg-cream rounded-t-xl">My Profile</Link>
                <Link to="/my-orders" className="block px-4 py-2.5 text-sm text-brown hover:bg-cream">My Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2.5 text-sm text-gold hover:bg-cream">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-cream rounded-b-xl flex items-center gap-2">
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm bg-brown text-cream px-4 py-2 rounded-full hover:bg-brown/90 transition-colors">
              Sign In
            </Link>
          )}

          {/* Mobile menu */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-brown/10 bg-cream px-4 py-3 flex flex-col gap-3">
          <Link to="/products" onClick={() => setOpen(false)} className="text-sm text-brown/70">Pastries</Link>
          <Link to="/my-orders" onClick={() => setOpen(false)} className="text-sm text-brown/70">My Orders</Link>
          {user?.role === 'admin' && <Link to="/admin" className="text-sm text-gold">Admin Panel</Link>}
        </div>
      )}
    </nav>
  )
}