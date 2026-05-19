import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, changePassword } from '../../features/auth/authSlice'
import { Input, Button } from '../../components/common'
import { FiCamera } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Profile() {
  const dispatch = useDispatch()
  const { user, loadingProfile, loadingPassword } = useSelector(s => s.auth)
  const fileRef = useRef()

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  })

  const [pwdForm, setPwdForm] = useState({ currentPassword: '', password: '', passwordConfirm: '' })
  const [preview, setPreview] = useState(user?.profilePic || null)

  const [activeFile, setActiveFile] = useState(null)

  const onProfileChange = e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }))
  const onPwdChange = e => setPwdForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onFileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setActiveFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append('name', profile.name)
    formData.append('phone', profile.phone)

    const address = {
      street: profile.street,
      city: profile.city,
      state: profile.state,
      pincode: profile.pincode,
    }

    formData.append('address', JSON.stringify(address))

    if (activeFile) {
      formData.append('profilePic', activeFile)
    }

    const res = await dispatch(updateProfile(formData))

    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Profile updated!')
    } else {
      toast.error(res.payload)
    }
  }

  const handlePasswordSave = async e => {
    e.preventDefault()
    const res = await dispatch(changePassword(pwdForm))
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Password changed!')
      setPwdForm({ currentPassword: '', password: '', passwordConfirm: '' })
    } else {
      toast.error(res.payload)
    }
  }

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl text-brown mb-2">Update Profile</h1>
        <p className="text-brown/50 text-sm mb-10">Keep your details current to ensure sweet deliveries reach you without a hitch.</p>

        <form onSubmit={handleProfileSave}>
          <div className="bg-white rounded-3xl border border-brown/10 p-8">
            <div className="grid md:grid-cols-3 gap-10">
              {/* Left — avatar + personal */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative cursor-pointer" onClick={() => fileRef.current.click()}>
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-cream-dark border-2 border-brown/10">
                    {preview
                      ? <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
                    }
                  </div>
                  <button type="button"
                    className="absolute bottom-0 right-0 bg-brown text-cream p-1.5 rounded-full hover:bg-brown/90 transition-colors">
                    <FiCamera size={14} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                </div>
                <button type="button" onClick={() => fileRef.current.click()} className="text-sm text-brown/50 hover:text-brown transition-colors">
                  Change Photo
                </button>

                <div className="w-full flex flex-col gap-3 mt-2">
                  <Input label="Full Name" name="name" value={profile.name} onChange={onProfileChange} placeholder="Jane Doe" />
                  <Input label="Phone Number" name="phone" value={profile.phone} onChange={onProfileChange} placeholder="+1 (555) 123-4567" />
                  <div>
                    <label className="text-sm font-medium text-brown/80">Email Address</label>
                    <input value={user?.email || ''} disabled
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-brown/10 bg-cream text-brown/40 text-sm cursor-not-allowed" />
                    <p className="text-xs text-brown/30 mt-1">Contact support to change your email.</p>
                  </div>
                </div>
              </div>

              {/* Right — shipping address */}
              <div className="md:col-span-2">
                <h2 className="font-serif text-xl text-brown mb-5 flex items-center gap-2">🚚 Shipping Address</h2>
                <div className="flex flex-col gap-4">
                  <Input label="Street Address" name="street" value={profile.street} onChange={onProfileChange} placeholder="123 Baker Lane, Apt 4B" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" name="city" value={profile.city} onChange={onProfileChange} placeholder="Bengaluru" />
                    <Input label="State / Province" name="state" value={profile.state} onChange={onProfileChange} placeholder="Karnataka" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="ZIP / Pincode" name="pincode" value={profile.pincode} onChange={onProfileChange} placeholder="560001" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 border-t border-brown/10 pt-6">
              <Button type="button" variant="secondary">Cancel</Button>
              <Button type="submit" loading={loadingProfile}>Save Changes</Button>
            </div>
          </div>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordSave} className="bg-white rounded-3xl border border-brown/10 p-8 mt-6">
          <h2 className="font-serif text-xl text-brown mb-5">Change Password</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="Current Password" name="currentPassword" type="password" value={pwdForm.currentPassword} onChange={onPwdChange} required />
            <Input label="New Password" name="password" type="password" value={pwdForm.password} onChange={onPwdChange} required />
            <Input label="Confirm Password" name="passwordConfirm" type="password" value={pwdForm.passwordConfirm} onChange={onPwdChange} required />
          </div>
          <div className="flex justify-end mt-5">
            <Button type="submit" loading={loadingPassword}> Update Password </Button>
          </div>
        </form>
      </div>

      {/* <Footer /> */}
    </div>
  )
}