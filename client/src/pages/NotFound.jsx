// client/src/pages/NotFound.jsx
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-gray-800 mb-4">404</div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield size={24} className="text-green-400" />
          <h2 className="text-white text-xl font-bold">Page Not Found</h2>
        </div>
        <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-green-500 hover:bg-green-400 text-gray-900 font-bold rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound