// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Home      from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login     from './pages/Login'
import Register  from './pages/Register'
import History   from './pages/History'
import NotFound from './pages/NotFound'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <Register />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* New History route */}
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
      </Routes>
    
  )
}

export default App