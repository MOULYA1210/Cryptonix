// client/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  // Still checking if user is logged in — show nothing yet
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading FortiShield...</p>
        </div>
      </div>
    )
  }

  // Not logged in — redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in — show the page
  return children
}

export default ProtectedRoute