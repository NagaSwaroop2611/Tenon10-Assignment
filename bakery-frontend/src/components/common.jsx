import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cart/cartSlice'
import toast from 'react-hot-toast'
import { FiShoppingBag } from 'react-icons/fi'

// ── Button ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', className = '', loading, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-brown text-cream hover:bg-brown/90 px-6 py-2.5',
    secondary: 'bg-transparent border border-brown text-brown hover:bg-brown hover:text-cream px-6 py-2.5',
    gold: 'bg-gold text-white hover:bg-gold/90 px-6 py-2.5',
    danger: 'bg-red-600 text-white hover:bg-red-700 px-6 py-2.5',
    ghost: 'bg-transparent text-brown hover:bg-brown/5 px-4 py-2',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-brown/80">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border bg-white text-brown placeholder-brown/30 outline-none transition-all
          ${error ? 'border-red-400 focus:border-red-500' : 'border-brown/20 focus:border-brown/60'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sz} border-2 border-brown/20 border-t-brown rounded-full animate-spin`} />
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const statusColors = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  baking: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status?.replace(/_/g, ' ')}
    </span>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
      <div className="text-5xl">{icon}</div>
      <h3 className="font-serif text-xl text-brown">{title}</h3>
      <p className="text-sm text-brown/60 max-w-xs">{description}</p>
      {action}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-brown/10">
          <h2 className="font-serif text-xl text-brown">{title}</h2>
          <button onClick={onClose} className="text-brown/40 hover:text-brown transition-colors text-xl">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Product Card ──────────────────────────────────────────────────────────────

export function ProductCard({ product }) {
  const dispatch = useDispatch()

  const handleAdd = (e) => {
    e.preventDefault()
    dispatch(addToCart(product))
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link to={`/products/${product._id}`} className="group bg-white rounded-2xl overflow-hidden border border-brown/10 hover:shadow-md transition-all duration-300">
      <div className="aspect-square overflow-hidden bg-cream-dark relative">
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🥐</div>
        }
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-gold text-white text-xs px-2 py-0.5 rounded-full">Bestseller</span>
        )}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white/90 text-brown/60 text-xs px-3 py-1 rounded-full">Sold Out</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base text-brown mb-1">{product.name}</h3>
        <p className="text-xs text-brown/50 line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-mono font-medium text-brown">₹{product.price}</span>
          <button
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className="flex items-center gap-1.5 bg-brown text-cream text-xs px-3 py-1.5 rounded-full hover:bg-brown/90 transition-colors disabled:opacity-40"
          >
            <FiShoppingBag size={12} /> Add
          </button>
        </div>
      </div>
    </Link>
  )
}