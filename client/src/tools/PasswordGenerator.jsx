// client/src/tools/PasswordGenerator.jsx
import { useState } from 'react'
import { Shield, RefreshCw, Copy, CheckCheck } from 'lucide-react'
import useToolHistory from '../hooks/useToolHistory'

function generatePassword(length, options) {
  const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower   = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  let charset   = ''
  if (options.upper)   charset += upper
  if (options.lower)   charset += lower
  if (options.numbers) charset += numbers
  if (options.symbols) charset += symbols
  if (!charset)        charset  = lower
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  return password
}

function PasswordGenerator() {
  const [length,   setLength]   = useState(16)
  const [options,  setOptions]  = useState({ upper: true, lower: true, numbers: true, symbols: true })
  const [password, setPassword] = useState('')
  const [copied,   setCopied]   = useState(false)
  const { saveUsage } = useToolHistory()

  const handleGenerate = async () => {
    const pwd = generatePassword(length, options)
    setPassword(pwd)
    setCopied(false)
    await saveUsage('password-generator', 'generate', { length })
  }

  const handleCopy = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleOption = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Shield size={22} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Password Generator</h1>
        </div>
        <p className="text-gray-400 text-sm">Generate a strong random password.</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-300">Password Length</span>
          <span className="text-green-400 font-bold text-lg">{length}</span>
        </div>
        <input
          type="range" min={6} max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-green-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>6</span><span>64</span>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
        <p className="text-sm font-medium text-gray-300 mb-4">Character Types</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'upper',   label: 'Uppercase (A-Z)'  },
            { key: 'lower',   label: 'Lowercase (a-z)'  },
            { key: 'numbers', label: 'Numbers (0-9)'     },
            { key: 'symbols', label: 'Symbols (!@#$...)' },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggleOption(opt.key)}
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors flex-shrink-0
                  ${options[opt.key] ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-600 group-hover:border-gray-400'}`}
              >
                {options[opt.key] && <span className="text-gray-900 text-xs font-bold">✓</span>}
              </div>
              <span className="text-sm text-gray-300">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 rounded-xl transition-colors mb-6"
      >
        <RefreshCw size={16} />Generate Password
      </button>

      {password && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">Generated Password</span>
            <div className="flex gap-3">
              <button onClick={handleGenerate} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                <RefreshCw size={13} />Regenerate
              </button>
              <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-green-400 flex items-center gap-1 transition-colors">
                {copied ? <CheckCheck size={13} className="text-green-400" /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <p className="text-green-400 font-mono text-base tracking-widest break-all bg-gray-900 rounded-lg px-4 py-3">
            {password}
          </p>
        </div>
      )}
    </div>
  )
}

export default PasswordGenerator