import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/orderSlice'
import { StatusBadge, Spinner } from '../../components/common'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { FiFilter } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const STATUSES = ['pending', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrders() {
  const dispatch = useDispatch()
  const { allOrders, total, totalPages, loading } = useSelector(s => s.orders)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: 10, ...(status && { status }) }))
  }, [dispatch, page, status])

  const handleStatus = async (id, newStatus) => {
    const res = await dispatch(updateOrderStatus({ id, status: newStatus }))
    if (res.meta.requestStatus === 'fulfilled') toast.success(`Status updated to "${newStatus}"`)
    else toast.error(res.payload)
  }

  const newOrders = allOrders.filter(o => o.status === 'pending').length
  const baking = allOrders.filter(o => o.status === 'baking').length
  const readyDelivery = allOrders.filter(o => o.status === 'out_for_delivery').length

  return (
    // <AdminLayout>
    <div className="p-8">
      <h1 className="font-serif text-4xl text-brown">Orders Management</h1>
      <p className="text-brown/50 text-sm mt-1 mb-8">Overview and status of all recent bakery orders.</p>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'NEW ORDERS', value: newOrders, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'CURRENTLY BAKING', value: baking, color: 'text-stone-500', bg: 'bg-stone-50' },
          { label: 'READY FOR DELIVERY', value: readyDelivery, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-brown/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-brown/40 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="font-serif text-3xl text-brown">{s.value}</p>
            </div>
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
              <span className={`text-lg ${s.color}`}>📋</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-brown/10 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-brown/5">
          <h2 className="font-serif text-xl text-brown">Recent Orders</h2>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="flex items-center gap-2 text-sm border border-brown/20 rounded-xl px-3 py-1.5 text-brown/70 outline-none">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>

        {loading ? <Spinner /> : (
          <table className="w-full">
            <thead className="bg-cream/60">
              <tr>
                {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/5">
              {allOrders.map(order => (
                <tr key={order._id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-5 py-4 font-mono text-sm text-brown">#ORD-{order._id.slice(-4).toUpperCase()}</td>
                  <td className="px-5 py-4 text-sm text-brown">{order.user?.name || '—'}</td>
                  <td className="px-5 py-4 text-xs text-brown/50">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-5 py-4 font-mono text-sm text-brown">₹{order.totalAmount}</td>
                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={e => handleStatus(order._id, e.target.value)}
                      className="text-xs border border-brown/20 rounded-lg px-2 py-1 outline-none bg-white text-brown capitalize"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-start h-full">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg 
                          bg-brown/5 text-brown border border-brown/10
                          hover:bg-brown hover:text-cream 
                          transition-all duration-200 active:scale-95"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between px-5 py-4 border-t border-brown/5">
          <p className="text-xs text-brown/40">Showing {allOrders.length} of {total} orders</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`w-8 h-8 rounded-full border text-sm flex items-center justify-center transition-all duration-200
                ${page === 1
                  ? 'border-brown/10 text-brown/20 cursor-not-allowed bg-brown/5'
                  : 'border-brown/20 text-brown hover:bg-brown hover:text-cream cursor-pointer'
                }`}
            >
              {'←'}
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`w-8 h-8 rounded-full border text-sm flex items-center justify-center transition-all duration-200
                ${page === totalPages
                  ? 'border-brown/10 text-brown/20 cursor-not-allowed bg-brown/5'
                  : 'border-brown/20 text-brown hover:bg-brown hover:text-cream cursor-pointer'
                }`}
            >
              {"→"}
            </button>
          </div>
        </div>
      </div>
    </div>
    // </AdminLayout>
  )
}