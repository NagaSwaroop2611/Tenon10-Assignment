import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders, cancelOrder } from '../../features/orders/orderSlice'
import { StatusBadge, Spinner, EmptyState } from '../../components/common'
import toast from 'react-hot-toast'

// ── Order Confirmation ────────────────────────────────────────────────────────
export function OrderConfirmation() {
  const navigate = useNavigate()
  const { lastPlaced } = useSelector(s => s.orders)

  useEffect(() => {
    if (!lastPlaced) navigate('/')
  }, [lastPlaced, navigate])

  if (!lastPlaced) return null

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-brown/10 max-w-md w-full overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-gold to-brown" />

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="font-serif text-2xl text-brown mb-2">Your order is being baked!</h1>
          <p className="text-brown/50 text-sm mb-8">The ovens are warm and our bakers are preparing your items with care.</p>

          <div className="bg-cream rounded-2xl p-5 text-left mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-brown/40 uppercase tracking-wide">Order ID</p>
                <p className="font-mono font-medium text-brown text-sm">#ORD-{lastPlaced._id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-brown/40 uppercase tracking-wide">Est. Delivery</p>
                <p className="text-gold font-medium text-sm">45-60 mins</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {lastPlaced.items.map((item, i) => (
                <div key={i} className="flex gap-2 text-sm text-brown/70">
                  <span className="font-mono">{item.quantity}x</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Link to="/my-orders" className="block w-full bg-brown text-cream py-3 rounded-full text-sm hover:bg-brown/90 transition-colors mb-3">
            🚚 Track My Order
          </Link>
          <Link to="/products" className="text-sm text-brown/50 hover:text-brown transition-colors">Back to Shop</Link>
        </div>
      </div>
    </div>
  )
}

// ── My Orders ─────────────────────────────────────────────────────────────────
export function MyOrders() {
  const dispatch = useDispatch()
  const { myOrders, loading } = useSelector(s => s.orders)

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this order?')) return
    const res = await dispatch(cancelOrder(id))
    if (res.meta.requestStatus === 'fulfilled') toast.success('Order cancelled')
    else toast.error(res.payload)
  }

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-brown mb-8">My Orders</h1>

        {loading ? <Spinner /> : myOrders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            description="Your delicious orders will appear here."
            action={<Link to="/products" className="text-sm bg-brown text-cream px-5 py-2 rounded-full">Start Shopping</Link>}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {myOrders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl border border-brown/10 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-brown/5">
                  <div>
                    <p className="font-mono text-sm text-brown font-medium">#ORD-{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-brown/40 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="font-mono text-brown font-medium">₹{order.totalAmount}</span>
                  </div>
                </div>
                <div className="px-5 py-3">
                  <div className="flex flex-col gap-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-brown/60">
                        <span>{item.quantity}× {item.name}</span>
                        <span className="font-mono">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  {!['delivered', 'cancelled'].includes(order.status) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="mt-3 text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </div>
  )
}