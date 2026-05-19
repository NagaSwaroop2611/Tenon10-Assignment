import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartTotal } from '../../features/cart/cartSlice'
import { placeOrder } from '../../features/orders/orderSlice'
import { Input, Button } from '../../components/common'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'

// ── Cart Page ─────────────────────────────────────────────────────────────────
export function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)

  if (items.length === 0) return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="text-6xl">🛒</div>
        <h2 className="font-serif text-2xl text-brown">Your cart is empty</h2>
        <Link to="/products" className="text-sm text-gold hover:underline">Browse our pastries →</Link>
      </div>
      {/* <Footer /> */}
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-brown mb-8">Your Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Items */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {items.map(item => (
              <div key={item._id} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-brown/10">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream-dark flex-shrink-0">
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🥐</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-brown text-sm font-medium truncate">{item.name}</p>
                  <p className="font-mono text-gold text-sm">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2 border border-brown/20 rounded-full px-2 py-1">
                  <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: Math.max(1, item.quantity - 1) }))}>
                    <FiMinus size={12} className="text-brown/60" />
                  </button>
                  <span className="font-mono text-xs w-5 text-center">{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}>
                    <FiPlus size={12} className="text-brown/60" />
                  </button>
                </div>
                <p className="font-mono text-sm text-brown w-16 text-right">₹{item.price * item.quantity}</p>
                <button onClick={() => dispatch(removeFromCart(item._id))} className="text-red-400 hover:text-red-600 transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 border border-brown/10 h-fit">
            <h3 className="font-serif text-lg text-brown mb-4">Order Summary</h3>
            <div className="flex justify-between text-sm text-brown/60 mb-2">
              <span>Subtotal</span><span className="font-mono">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-brown/60 mb-4">
              <span>Delivery</span><span className="font-mono">₹50.00</span>
            </div>
            <div className="border-t border-brown/10 pt-4 flex justify-between font-medium text-brown">
              <span>Total</span><span className="font-mono">₹{(total + 50).toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full mt-5 bg-brown text-cream py-3 rounded-full text-sm hover:bg-brown/90 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

// ── Checkout Page ─────────────────────────────────────────────────────────────
export function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const { loading } = useSelector(s => s.orders)
  const { user } = useSelector(s => s.auth)

  const [addr, setAddr] = useState({
    name: user?.name || '', email: user?.email || '', phone: '',
    street: '', city: '', state: '', pincode: '',
  })
  const [notes, setNotes] = useState('')

  const onChange = e => setAddr(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    const orderItems = items.map(i => ({ product: i._id, quantity: i.quantity }))
    const res = await dispatch(placeOrder({ items: orderItems, deliveryAddress: addr, notes }))
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart())
      navigate('/order-confirmation')
    } else {
      toast.error(res.payload)
    }
  }

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-brown/40 text-sm mb-1">Secure Checkout</p>
        <h1 className="font-serif text-2xl text-brown mb-8">Please provide your details to complete your gourmet order.</h1>

        <form onSubmit={onSubmit}>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Delivery */}
              <div className="bg-white rounded-2xl p-6 border border-brown/10">
                <h2 className="font-serif text-lg text-brown mb-5 flex items-center gap-2">🚚 Delivery Details</h2>
                <div className="flex flex-col gap-4">
                  <Input label="Full Name" name="name" value={addr.name} onChange={onChange} placeholder="Jane Doe" required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Email Address" name="email" type="email" value={addr.email} onChange={onChange} placeholder="jane@example.com" required />
                    <Input label="Phone Number" name="phone" value={addr.phone} onChange={onChange} placeholder="(555) 123-4567" required />
                  </div>
                  <Input label="Street Address" name="street" value={addr.street} onChange={onChange} placeholder="123 Artisan Baker Way" required />
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="City" name="city" value={addr.city} onChange={onChange} placeholder="Bengaluru" required />
                    <Input label="State" name="state" value={addr.state} onChange={onChange} placeholder="KA" required />
                    <Input label="Pincode" name="pincode" value={addr.pincode} onChange={onChange} placeholder="560001" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brown/80">Notes (optional)</label>
                    <textarea
                      value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Extra cream please..."
                      rows={2}
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-brown/20 bg-white text-brown placeholder-brown/30 outline-none focus:border-brown/60 text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 border border-brown/10 h-fit sticky top-20">
              <h2 className="font-serif text-lg text-brown mb-5">Order Summary</h2>
              <div className="flex flex-col gap-3 mb-4">
                {items.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream-dark flex-shrink-0">
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-xl">🥐</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-brown font-medium truncate">{item.name}</p>
                      <p className="text-xs text-brown/50">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-mono text-xs text-brown">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brown/10 pt-4 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between text-brown/60"><span>Subtotal</span><span className="font-mono">₹{total.toFixed(2)}</span></div>
                <div className="flex justify-between text-brown/60"><span>Delivery Fee</span><span className="font-mono">₹50.00</span></div>
                <div className="flex justify-between text-brown font-semibold mt-2 text-base"><span>TOTAL</span><span className="font-mono">₹{(total + 50).toFixed(2)}</span></div>
              </div>
              <Button type="submit" loading={loading} className="w-full mt-5">🔒 Place Order</Button>
              <p className="text-xs text-center text-brown/30 mt-3">Payments are secure and encrypted.</p>
            </div>
          </div>
        </form>
      </div>
      {/* <Footer /> */}
    </div>
  )
}