import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/axios'
import { Spinner } from '../../components/common'
import toast from 'react-hot-toast'

export default function AdminOrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/order/${id}`)
        setOrder(res.data.order)
      } catch (err) {
        toast.error('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  if (loading) return <Spinner />

  if (!order) return <p className="p-8">Order not found</p>

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl text-brown mb-6">
        Order #{order._id.slice(-6).toUpperCase()}
      </h1>

      {/* Customer Info */}
      <div className="bg-white p-6 rounded-2xl border mb-6">
        <h2 className="font-semibold mb-2">Customer</h2>
        <p>{order.user?.name}</p>
        <p className="text-sm text-gray-500">{order.user?.email}</p>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-2xl border mb-6">
        <h2 className="font-semibold mb-3">Items</h2>

        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between py-2 border-b last:border-0">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-2xl border">
        <h2 className="font-semibold mb-2">Summary</h2>
        <p>Status: {order.status}</p>
        <p>Total: ₹{order.totalAmount}</p>
        <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
      </div>
    </div>
  )
}