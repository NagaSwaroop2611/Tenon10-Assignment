import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function ProtectedRoute({ children }) {
  const { token } = useSelector(s => s.auth)

  if (token === undefined) return null // wait redux hydration

  return token ? children : <Navigate to="/login" replace />
}

export function AdminRoute({ children }) {
  const { user, token } = useSelector(s => s.auth)

  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />

  return children
}

export function GuestRoute({ children }) {
  const { token } = useSelector(s => s.auth)

  return token ? <Navigate to="/" replace /> : children
}