// client/src/tools/Base64Tool.jsx
import { useState } from 'react'
import { Code, Copy, CheckCheck, ArrowLeftRight } from 'lucide-react'
import useToolHistory from '../hooks/useToolHistory'

function Base64Tool() {
  const [input,  setInput]  = useState('')
  const [output, setOutput] = useState('')
  const [mode,   setMode]   = useState('encode')
  const [error,  setError]  = useState('')
  const [copied, setCopied] = useState(false)
  const { saveUsage } = useToolHistory()

  const handleProcess = async () => {
    setError('')
    setOutput('')
    await saveUsage('base64-tool', mode, {})  
    if (!input.trim()) return setError('Please enter some text.')

    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
    }
     
    catch {
      setError('Invalid Base64 input. Make sure you pasted valid Base64 encoded text.')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSwap = () => {
    setInput(output)
    setOutput('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setError('')
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Code size={22} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Base64 Encoder / Decoder</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Convert text to Base64 format and back. Commonly used in APIs, JWT tokens, and data transfer.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => { setMode('encode'); setOutput(''); setError('') }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all
              ${mode === 'encode' ? 'bg-green-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            Encode
          </button>
          <button
            onClick={() => { setMode('decode'); setOutput(''); setError('') }}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all
              ${mode === 'decode' ? 'bg-green-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            Decode
          </button>
        </div>
        {output && (
          <button
            onClick={handleSwap}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
          >
            <ArrowLeftRight size={14} />
            Swap
          </button>
        )}
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {mode === 'encode' ? 'Plain Text' : 'Base64 Text'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 text to decode...'}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none transition-colors font-mono"
        />
      </div>

      {/* Button */}
      <button
        onClick={handleProcess}
        className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 rounded-xl transition-colors mb-6 text-sm"
      >
        {mode === 'encode' ? '📦 Encode to Base64' : '📂 Decode from Base64'}
      </button>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              {mode === 'encode' ? 'Base64 Encoded' : 'Decoded Text'}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors"
            >
              {copied ? <CheckCheck size={13} className="text-green-400" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-green-400 font-mono text-sm break-all leading-relaxed">{output}</p>
        </div>
      )}
    </div>
  )
}

export default Base64Tool