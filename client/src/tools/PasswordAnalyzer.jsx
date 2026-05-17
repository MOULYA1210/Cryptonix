// client/src/tools/PasswordAnalyzer.jsx
import { useState } from 'react'
import { Key, Eye, EyeOff } from 'lucide-react'
import useToolHistory from '../hooks/useToolHistory'

const checks = [
  { id: 'length',   label: 'At least 8 characters',      test: (p) => p.length >= 8           },
  { id: 'length12', label: 'At least 12 characters',     test: (p) => p.length >= 12          },
  { id: 'upper',    label: 'Contains uppercase letter',  test: (p) => /[A-Z]/.test(p)         },
  { id: 'lower',    label: 'Contains lowercase letter',  test: (p) => /[a-z]/.test(p)         },
  { id: 'number',   label: 'Contains a number',          test: (p) => /[0-9]/.test(p)         },
  { id: 'symbol',   label: 'Contains special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
  { id: 'nocommon', label: 'Not a common password',      test: (p) => !['password','123456','qwerty','admin','letmein'].includes(p.toLowerCase()) },
]

function getStrength(score) {
  if (score <= 2) return { label: 'Very Weak',  color: 'bg-red-500',    text: 'text-red-400',    width: 'w-1/5'  }
  if (score <= 3) return { label: 'Weak',       color: 'bg-orange-500', text: 'text-orange-400', width: 'w-2/5'  }
  if (score <= 4) return { label: 'Fair',       color: 'bg-yellow-500', text: 'text-yellow-400', width: 'w-3/5'  }
  if (score <= 5) return { label: 'Strong',     color: 'bg-blue-500',   text: 'text-blue-400',   width: 'w-4/5'  }
  return             { label: 'Very Strong', color: 'bg-green-500',  text: 'text-green-400',  width: 'w-full' }
}

function PasswordAnalyzer() {
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [saved,    setSaved]    = useState(false)
  const { saveUsage } = useToolHistory()

  const results  = checks.map(c => ({ ...c, passed: password ? c.test(password) : null }))
  const score    = results.filter(r => r.passed).length
  const strength = password ? getStrength(score) : null

  // Save to history when password changes (debounced by length)
  const handleChange = async (e) => {
    const val = e.target.value
    setPassword(val)
    setSaved(false)

    // Save once when password reaches 6+ characters
    if (val.length === 6 && !saved) {
      const s = getStrength(checks.filter(c => c.test(val)).length)
      await saveUsage('password-analyzer', 'analyze', { strength: s.label })
      setSaved(true)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Key size={22} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Password Analyzer</h1>
        </div>
        <p className="text-gray-400 text-sm">Check how strong your password is.</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Enter Your Password</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            placeholder="Type your password here..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors pr-12"
          />
          <button
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">🔒 Your password never leaves your browser.</p>
      </div>

      {strength && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Password Strength</span>
            <span className={`text-sm font-bold ${strength.text}`}>{strength.label}</span>
          </div>
          <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">{score} / {checks.length} checks passed</p>
        </div>
      )}

      {password && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-300 mb-4">Detailed Analysis</p>
          <div className="flex flex-col gap-2.5">
            {results.map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${r.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {r.passed ? '✓' : '✗'}
                </span>
                <span className={`text-sm ${r.passed ? 'text-gray-300' : 'text-gray-500'}`}>
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PasswordAnalyzer