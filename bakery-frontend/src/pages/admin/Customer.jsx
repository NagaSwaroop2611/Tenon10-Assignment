import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../api/axios'
import { Spinner } from '../../components/common'
import AdminLayout from '../../components/admin/AdminLayout'
import { FiTrash2, FiSearch } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminCustomers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/user/all')
      setUsers(res.data.users)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/user/${id}`)
      setUsers(u => u.filter(x => x._id !== id))
      toast.success('User deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  const filtered = users
    .filter(u => u.role !== 'admin') // 🚨 remove admins
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )

  return (
    // <AdminLayout>
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl text-brown">Customers</h1>
          <p className="text-brown/50 text-sm mt-1">All registered users on the platform.</p>
        </div>
        <div className="flex items-center gap-2 border border-brown/20 rounded-full px-4 py-2 bg-white">
          <FiSearch className="text-brown/40" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="outline-none text-sm bg-transparent text-brown placeholder-brown/30 w-40"
          />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl border border-brown/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-cream/60">
              <tr>
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/5">
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-cream/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-brown/10 flex-shrink-0">
                        {u.profilePic
                          ? <img src={u.profilePic} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xs font-serif text-brown">{u.name?.[0]}</div>
                        }
                      </div>
                      <span className="text-sm text-brown font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-brown/60">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${u.role === 'admin' ? 'bg-gold/20 text-brown' : 'bg-green-100 text-green-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-brown/50">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
                      className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-brown/40 text-sm">No users found.</div>
          )}

          <div className="px-5 py-3 border-t border-brown/5 text-xs text-brown/40">
            {filtered.length} of {users.length} users
          </div>
        </div>
      )}
    </div>
    // </AdminLayout>
  )
}