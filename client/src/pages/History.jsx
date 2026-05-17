// client/src/pages/History.jsx
import { useState, useEffect } from 'react'
import { Clock, Lock, Key, Hash, Code, FileText,
         File, Shield, RefreshCw } from 'lucide-react'
import { getToolHistoryAPI } from '../utils/api'
import Navbar from '../components/Navbar'

// Map tool IDs to icons and colors
const toolConfig = {
  'text-encryption':    { icon: Lock,     color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
  'password-analyzer':  { icon: Key,      color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  'password-generator': { icon: Shield,   color: 'text-green-400',  bg: 'bg-green-500/10'  },
  'hash-generator':     { icon: Hash,     color: 'text-purple-400', bg: 'bg-purple-500/10' },
  'base64-tool':        { icon: Code,     color: 'text-pink-400',   bg: 'bg-pink-500/10'   },
  'jwt-decoder':        { icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  'file-encryption':    { icon: File,     color: 'text-cyan-400',   bg: 'bg-cyan-500/10'   },
}

// Format tool name for display
const formatToolName = (toolName) => {
  return toolName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

function History() {
  const [history,  setHistory]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const fetchHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getToolHistoryAPI()
      setHistory(res.data.history)
    } catch {
      setError('Could not load history. Make sure you are logged in.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Tool History</h1>
            <p className="text-gray-400 text-sm">Your last 50 tool actions</p>
          </div>
          <button
            onClick={fetchHistory}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && history.length === 0 && (
          <div className="text-center py-20">
            <Clock size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-400 text-lg font-medium">No history yet</p>
            <p className="text-gray-600 text-sm mt-1">
              Start using tools and your actions will appear here.
            </p>
          </div>
        )}

        {/* History List */}
        {!loading && history.length > 0 && (
          <div className="flex flex-col gap-3">
            {history.map((item, index) => {
              const config = toolConfig[item.toolName] || {
                icon: Clock,
                color: 'text-gray-400',
                bg: 'bg-gray-500/10',
              }
              const Icon = config.icon

              return (
                <div
                  key={item._id || index}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition-colors"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                    <Icon size={18} className={config.color} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">
                      {formatToolName(item.toolName)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 capitalize">
                        Action: {item.action}
                      </span>
                      {item.metadata && Object.keys(item.metadata).length > 0 && (
                        <>
                          <span className="text-gray-700">•</span>
                          <span className="text-xs text-gray-500">
                            {Object.entries(item.metadata)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default History