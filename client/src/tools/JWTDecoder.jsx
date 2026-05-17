// client/src/tools/JWTDecoder.jsx
import { useState } from 'react'
import { FileText, Copy, CheckCheck } from 'lucide-react'
import useToolHistory from '../hooks/useToolHistory'

// Decode a single Base64Url part
function decodeBase64Url(str) {
  // Add padding
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) str += '='
  return JSON.parse(decodeURIComponent(escape(atob(str))))
}

function JWTDecoder() {
  const [token,   setToken]   = useState('')
  const [decoded, setDecoded] = useState(null)
  const [error,   setError]   = useState('')
  const [copied,  setCopied]  = useState('')
  const { saveUsage } = useToolHistory()

  const handleDecode =async () => {
    setError('')
    setDecoded(null)
    
    if (!token.trim()) return setError('Please paste a JWT token.')

    const parts = token.trim().split('.')
    if (parts.length !== 3) return setError('Invalid JWT format. A JWT must have exactly 3 parts separated by dots.')

    try {
      const header  = decodeBase64Url(parts[0])
      const payload = decodeBase64Url(parts[1])
      const signature = parts[2]

      // Check expiry
      let expired = false
      if (payload.exp) {
        expired = Date.now() / 1000 > payload.exp
      }

      setDecoded({ header, payload, signature, expired })
      await saveUsage('jwt-decoder', 'decode', { expired: decoded.expired })
    } catch {
      setError('Could not decode this token. Make sure it is a valid JWT.')
    }
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const formatTime = (ts) => new Date(ts * 1000).toLocaleString()

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <FileText size={22} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">JWT Decoder</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Paste a JSON Web Token to inspect its header, payload, and expiry status.
        </p>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          placeholder="Paste your JWT token here... (eyJhbGci...)"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none transition-colors font-mono"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleDecode}
        className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 rounded-xl transition-colors mb-6 text-sm"
      >
        🔍 Decode Token
      </button>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Decoded Output */}
      {decoded && (
        <div className="flex flex-col gap-4">

          {/* Status Banner */}
          <div className={`p-4 rounded-xl border text-sm font-medium
            ${decoded.expired
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
            {decoded.expired ? '❌ This token has EXPIRED' : '✅ This token is still VALID'}
          </div>

          {/* Header */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-blue-400">Header</span>
              <button onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), 'header')} className="text-xs text-gray-400 hover:text-green-400 flex items-center gap-1 transition-colors">
                {copied === 'header' ? <CheckCheck size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied === 'header' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-green-400">Payload</span>
              <button onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), 'payload')} className="text-xs text-gray-400 hover:text-green-400 flex items-center gap-1 transition-colors">
                {copied === 'payload' ? <CheckCheck size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied === 'payload' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
            {/* Time fields */}
            <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-gray-700">
              {decoded.payload.iat && <p className="text-xs text-gray-500">Issued at: <span className="text-gray-300">{formatTime(decoded.payload.iat)}</span></p>}
              {decoded.payload.exp && <p className="text-xs text-gray-500">Expires at: <span className={decoded.expired ? 'text-red-400' : 'text-green-400'}>{formatTime(decoded.payload.exp)}</span></p>}
            </div>
          </div>

          {/* Signature */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
            <p className="text-sm font-semibold text-orange-400 mb-2">Signature</p>
            <p className="text-xs text-gray-400 mb-3">
              The signature cannot be verified without the server's secret key.
            </p>
            <p className="text-gray-300 font-mono text-xs break-all">{decoded.signature}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default JWTDecoder