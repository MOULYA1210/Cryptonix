// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'
import { registerUser, loginUser, getMe } from '../utils/api'

// Create the context
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true) // true while checking token

  // On app load — check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('fortishield_token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await getMe()
        setUser(res.data.user)
      } catch {
        // Token is invalid or expired — clean up
        localStorage.removeItem('fortishield_token')
        localStorage.removeItem('fortishield_user')
        setUser(null)
      }
      setLoading(false)
    }
    checkLoggedIn()
  }, [])

  // Register function
  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password })
    const { token, user } = res.data

    localStorage.setItem('fortishield_token', token)
    localStorage.setItem('fortishield_user',  JSON.stringify(user))
    setUser(user)
    return user
  }

  // Login function
  const login = async (email, password) => {
    const res = await loginUser({ email, password })
    const { token, user } = res.data

    localStorage.setItem('fortishield_token', token)
    localStorage.setItem('fortishield_user',  JSON.stringify(user))
    setUser(user)
    return user
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('fortishield_token')
    localStorage.removeItem('fortishield_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}