import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders } from '../../features/orders/orderSlice'
import { fetchAdminProducts } from '../../features/products/productSlice'
import { StatusBadge, Spinner } from '../../components/common'
import AdminLayout from '../../components/admin/AdminLayout'
import { FiShoppingBag, FiDollarSign, FiUsers, FiAlertCircle } from 'react-icons/fi'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { allOrders, loading } = useSelector(s => s.orders)
  const { adminItems } = useSelector(s => s.products)

  useEffect(() => {
    dispatch(fetchAllOrders())
    dispatch(fetchAdminProducts())
  }, [dispatch])

  console.log("first");

  const totalRevenue = allOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0)
  const outOfStock = adminItems.filter(p => p.stock === 0).length

  const stats = [
    { label: 'Total Orders', value: allOrders.length, icon: FiShoppingBag, change: '+12%', color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: FiDollarSign, change: '+8.4%', color: 'bg-orange-50 text-orange-600' },
    { label: 'Active Users', value: '—', icon: FiUsers, change: '', color: 'bg-stone-50 text-stone-600' },
    { label: 'Out of Stock Items', value: outOfStock, icon: FiAlertCircle, change: '', color: 'bg-red-50 text-red-500' },
  ]

  return (
    // <AdminLayout>
    <div className="p-8">
      <h1 className="font-serif text-4xl text-brown">Overview</h1>
      <p className="text-brown/50 text-sm mt-1 mb-8">Monitor your artisanal bakery's daily performance, order pipeline, and inventory status at a glance.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-brown/10">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${s.color}`}><s.icon size={18} /></div>
              {s.change && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">↑ {s.change}</span>}
            </div>
            <p className="text-xs text-brown/40 mb-1">{s.label}</p>
            <p className={`font-serif text-2xl font-bold ${i === 3 ? 'text-red-500' : 'text-brown'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-brown/10 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-brown/5">
          <h2 className="font-serif text-xl text-brown">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-gold hover:underline">View All →</Link>
        </div>
        {loading ? <Spinner /> : (
          <table className="w-full">
            <thead className="bg-cream/60">
              <tr>
                {['Order ID', 'Customer', 'Date', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/5">
              {allOrders.slice(0, 5).map(order => (
                <tr key={order._id} className="hover:bg-cream/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-brown">#ORD-{order._id.slice(-4).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-brown">{order.user?.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-brown/50">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-6 py-4 font-mono text-sm text-brown">₹{order.totalAmount}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    // </AdminLayout>
  )
}