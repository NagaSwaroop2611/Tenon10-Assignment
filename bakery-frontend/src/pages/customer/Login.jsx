import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../features/auth/authSlice'
import { Input, Button } from '../../components/common'
import toast from 'react-hot-toast'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    const res = await dispatch(login(form))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!')
      const user = res.payload.user
      navigate(user.role === 'admin' ? '/admin' : '/')
    } else {
      toast.error(res.payload)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-brown">
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800"
          alt="Bakery"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-cream">
          <h1 className="font-serif text-5xl font-bold mb-2">Crumbs & Co</h1>
          <p className="text-cream/70 text-lg">Artisanal Bakery & Cafe</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-cream">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-brown/10">
            <h2 className="font-serif text-3xl text-brown mb-1">Welcome Back</h2>
            <p className="text-brown/50 text-sm mb-8">Please enter your details to sign in.</p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <Input label="Email" name="email" type="email" placeholder="Enter your email" value={form.email} onChange={onChange} required />
              <Input label="Password" name="password" type="password" placeholder="Enter your password" value={form.password} onChange={onChange} required />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-brown/60 cursor-pointer">
                  <input type="checkbox" className="accent-brown" /> Remember me
                </label>
                <button type="button" className="text-gold hover:underline">Forgot password?</button>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button type="submit" loading={loading} className="w-full mt-2">Sign In</Button>
            </form>

            <p className="text-center text-sm text-brown/50 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-brown font-medium hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}