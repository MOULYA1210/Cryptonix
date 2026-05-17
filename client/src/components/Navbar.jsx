// client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Menu, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout }        = useAuth()
  const navigate                = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-green-500 rounded-lg group-hover:bg-green-400 transition-colors">
            <Shield size={20} className="text-gray-900" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Forti<span className="text-green-400">Shield</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
            Home
          </Link>

          {user ? (
            // Logged in state
            <>
              <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
                  <User size={14} className="text-green-400" />
                  <span className="text-white text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-sm font-medium rounded-lg transition-all"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Logged out state
            <>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-green-500 hover:bg-green-400 text-gray-900 font-semibold text-sm rounded-lg transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-gray-700 pt-3 flex flex-col gap-3 px-2">
          <Link to="/" className="text-gray-400 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/history" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">History</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-red-400 text-sm text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="text-gray-400 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-green-400 text-sm font-semibold"   onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar