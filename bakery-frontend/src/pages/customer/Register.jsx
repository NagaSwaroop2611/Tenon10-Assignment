import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../features/auth/authSlice'
import { Input } from '../../components/common'
import toast from 'react-hot-toast'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(s => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [errors, setErrors] = useState({})

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    if (form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    const res = await dispatch(register(form))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Account created!')
      navigate('/')
    } else {
      toast.error(res.payload)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-brown">
        <img
          src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800"
          alt="Bakery"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-cream">
          <p className="text-cream/60 text-sm uppercase tracking-widest mb-4">Crumbs & Co</p>
          <h2 className="font-serif text-3xl text-cream mb-3">Crafted with care.<br />Baked for you.</h2>
          <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
            Join the Crumbs & Co family to unlock exclusive seasonal pastries, priority ordering, and a taste of our artisanal heritage.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-cream">
        <div className="w-full max-w-md">
          <p className="text-brown/50 text-sm mb-1">Create an account</p>
          <h1 className="font-serif text-3xl text-brown mb-1">Start your artisanal journey</h1>
          <p className="text-brown/40 text-sm mb-8">with us today.</p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" name="name" placeholder="Jane Doe" value={form.name} onChange={onChange} error={errors.name} required />
            <Input label="Email Address" name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={onChange} error={errors.email} required />
            <Input label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={onChange} error={errors.password} required />
            <Input label="Confirm Password" name="passwordConfirm" type="password" placeholder="••••••••" value={form.passwordConfirm} onChange={onChange} error={errors.passwordConfirm} required />

            <Button type="submit" loading={loading} className="w-full mt-2">Create Account</Button>
          </form>

          <p className="text-center text-sm text-brown/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brown font-medium hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}