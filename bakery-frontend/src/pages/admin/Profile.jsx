import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, changePassword } from '../../features/auth/authSlice'
import { FiCamera } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminProfile() {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(s => s.auth)
  const fileRef = useRef()

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })

  const [pwd, setPwd] = useState({
    currentPassword: '',
    password: '',
    passwordConfirm: '',
  })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(user?.profilePic || null)

  const onChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onPwdChange = e =>
    setPwd(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onFileChange = e => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSave = async e => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('phone', form.phone)

    if (file) formData.append('profilePic', file)

    const res = await dispatch(updateProfile(formData))

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Profile updated')
    } else {
      toast.error(res.payload)
    }
  }

  const handlePassword = async e => {
    e.preventDefault()

    const res = await dispatch(changePassword(pwd))

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Password updated')
      setPwd({ currentPassword: '', password: '', passwordConfirm: '' })
    } else {
      toast.error(res.payload)
    }
  }

  return (
    <div className="p-8 max-w-4xl">

      <h1 className="font-serif text-3xl text-brown mb-6">
        Admin Profile
      </h1>

      {/* PROFILE CARD */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-brown/10 mb-6">

        <div className="flex items-center gap-6 mb-6">

          {/* Avatar */}
          <div className="relative cursor-pointer" onClick={() => fileRef.current.click()}>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-cream-dark border">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
            </div>

            <button
              type="button"
              className="absolute bottom-0 right-0 bg-brown text-white p-2 rounded-full"
            >
              <FiCamera size={14} />
            </button>

            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={onFileChange}
            />
          </div>

          {/* Fields */}
          <div className="flex-1 grid gap-3">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="border p-2 rounded"
              placeholder="Name"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="border p-2 rounded"
              placeholder="Phone"
            />

            <input
              value={user?.email}
              disabled
              className="border p-2 rounded bg-gray-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-brown text-white px-5 py-2 rounded"
          disabled={loading}
        >
          Save Profile
        </button>
      </form>

      {/* PASSWORD */}
      <form onSubmit={handlePassword} className="bg-white p-6 rounded-2xl border border-brown/10">

        <h2 className="text-xl font-serif mb-4">Change Password</h2>

        <div className="grid gap-3">
          <input
            type="password"
            name="currentPassword"
            value={pwd.currentPassword}
            onChange={onPwdChange}
            placeholder="Current Password"
            className="border p-2 rounded"
          />

          <input
            type="password"
            name="password"
            value={pwd.password}
            onChange={onPwdChange}
            placeholder="New Password"
            className="border p-2 rounded"
          />

          <input
            type="password"
            name="passwordConfirm"
            value={pwd.passwordConfirm}
            onChange={onPwdChange}
            placeholder="Confirm Password"
            className="border p-2 rounded"
          />
        </div>

        <button
          className="mt-4 bg-brown text-white px-5 py-2 rounded"
          disabled={loading}
        >
          Update Password
        </button>
      </form>
    </div>
  )
}