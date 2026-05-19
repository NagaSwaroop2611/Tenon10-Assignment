import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct } from '../../features/products/productSlice'
import { Button, Input, Modal, Spinner } from '../../components/common'
import AdminLayout from '../../components/admin/AdminLayout'
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const EMPTY = { name: '', description: '', price: '', category: '', stock: '', isFeatured: false, isAvailable: true }

export default function AdminProducts() {
  const dispatch = useDispatch()
  const { adminItems, loading } = useSelector(s => s.products)

  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null) // null = create
  const [form, setForm] = useState(EMPTY)
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [saving, setSaving] = useState(false)

  const [category, setCategory] = useState('')
  const [stockSort, setStockSort] = useState('')
  const [availability, setAvailability] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    dispatch(fetchAdminProducts({
      category,
      stockSort,
      availability
    }))
  }, [category, stockSort, availability, dispatch])

  useEffect(() => {
    api.get("/product/categories").then(res => {
      setCategories(res.data.categories)
    })
  }, [])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setPreview(''); setModal(true) }
  const openEdit = (p) => { setForm({ ...p, price: p.price, stock: p.stock }); setEditing(p._id); setPreview(p.imageUrl || ''); setModal(true) }
  const closeModal = () => { setModal(false); setImgFile(null) }

  const onChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onFile = e => {
    const file = e.target.files[0]
    if (!file) return
    setImgFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const onSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (imgFile) fd.append('image', imgFile)

    const res = editing
      ? await dispatch(updateProduct({ id: editing, formData: fd }))
      : await dispatch(createProduct(fd))

    setSaving(false)
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success(editing ? 'Product updated!' : 'Product created!')
      closeModal()
    } else {
      toast.error(res.payload)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    const res = await dispatch(deleteProduct(id))
    if (res.meta.requestStatus === 'fulfilled') toast.success('Deleted!')
    else toast.error(res.payload)
  }

  return (
    <>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl text-brown">Products</h1>
            <p className="text-brown/50 text-sm mt-1">Manage your bakery's product catalogue.</p>
          </div>
          <Button onClick={openCreate} className="flex items-center gap-2"><FiPlus /> Add Product</Button>
        </div>

        {loading ? <Spinner /> : (
          <div className="bg-white rounded-2xl border border-brown/10 overflow-hidden p-2">
            <div className="flex flex-wrap gap-3 mb-6">

              {/* CATEGORY */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* STOCK SORT */}
              <select
                value={stockSort}
                onChange={(e) => setStockSort(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">Sort by Stock</option>
                <option value="asc">Low → High</option>
                <option value="desc">High → Low</option>
              </select>

              {/* AVAILABILITY */}
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>

              {/* RESET */}
              <button
                onClick={() => {
                  setCategory('')
                  setStockSort('')
                  setAvailability('')
                }}
                className="px-3 py-2 text-sm bg-brown text-white rounded-lg"
              >
                Reset
              </button>

            </div>
            <table className="w-full">
              <thead className="bg-cream/60">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-brown/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/5">
                {adminItems.map(p => (
                  <tr key={p._id} className="hover:bg-cream/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-dark flex-shrink-0">
                          {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🥐</div>}
                        </div>
                        <span className="text-sm text-brown font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-brown/60 capitalize">{p.category}</td>
                    <td className="px-5 py-4 font-mono text-sm text-brown">₹{p.price}</td>
                    <td className="px-5 py-4 text-sm text-brown">{p.stock}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {p.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-brown/40 hover:text-brown transition-colors"><FiEdit2 size={15} /></button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modal} onClose={closeModal} title={editing ? 'Edit Product' : 'Create Product'}>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Image */}
          <div>
            <label className="text-sm font-medium text-brown/80">Product Image</label>
            <div className="mt-1.5 border-2 border-dashed border-brown/20 rounded-xl p-4 text-center cursor-pointer hover:border-brown/40 transition-colors" onClick={() => document.getElementById('prod-img').click()}>
              {preview ? <img src={preview} alt="" className="h-32 mx-auto rounded-lg object-cover" /> : <p className="text-brown/30 text-sm">Click to upload image</p>}
            </div>
            <input id="prod-img" type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>

          <Input label="Name" name="name" value={form.name} onChange={onChange} required />
          <div>
            <label className="text-sm font-medium text-brown/80">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} rows={3}
              className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-brown/20 bg-white text-brown text-sm outline-none focus:border-brown/60 resize-none" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹)" name="price" type="number" value={form.price} onChange={onChange} required />
            <Input label="Stock" name="stock" type="number" value={form.stock} onChange={onChange} />
          </div>
          <div>
            <label className="text-sm font-medium text-brown/80">Category</label>
            <input list="cats" name="category" value={form.category} onChange={onChange}
              className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-brown/20 bg-white text-brown text-sm outline-none focus:border-brown/60" placeholder="e.g. cake" required />
            <datalist id="cats"><option value="bread" /><option value="pastry" /><option value="cake" /><option value="cookie" /><option value="savory" /></datalist>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-brown/70 cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={onChange} className="accent-brown" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-brown/70 cursor-pointer">
              <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={onChange} className="accent-brown" /> Available
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}