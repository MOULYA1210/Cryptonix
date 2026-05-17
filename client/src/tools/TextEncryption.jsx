// client/src/tools/TextEncryption.jsx
import { useState } from 'react'
import CryptoJS from 'crypto-js'
import { Lock, Unlock, Copy, Trash2, CheckCheck } from 'lucide-react'
import useToolHistory from '../hooks/useToolHistory'

function TextEncryption() {
  const [inputText, setInputText]   = useState('')
  const [secretKey, setSecretKey]   = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode]             = useState('encrypt') // 'encrypt' or 'decrypt'
  const [algorithm, setAlgorithm]   = useState('AES')
  const [copied, setCopied]         = useState(false)
  const [error, setError]           = useState('')
  const { saveUsage } = useToolHistory()

  // Main function — encrypts or decrypts based on mode
  const handleProcess = () => {
    setError('')
    setOutputText('')

    // Validation
    if (!inputText.trim()) return setError('Please enter text to process.')
    if (!secretKey.trim()) return setError('Please enter a secret key.')

    try {
      let result = ''

      if (mode === 'encrypt') {
        if (algorithm === 'AES') {
          result = CryptoJS.AES.encrypt(inputText, secretKey).toString()
        } else if (algorithm === 'DES') {
          result = CryptoJS.DES.encrypt(inputText, secretKey).toString()
        } else if (algorithm === 'RC4') {
          result = CryptoJS.RC4.encrypt(inputText, secretKey).toString()
        }
      } else {
        // Decrypt
        let bytes
        if (algorithm === 'AES') {
          bytes = CryptoJS.AES.decrypt(inputText, secretKey)
        } else if (algorithm === 'DES') {
          bytes = CryptoJS.DES.decrypt(inputText, secretKey)
        } else if (algorithm === 'RC4') {
          bytes = CryptoJS.RC4.decrypt(inputText, secretKey)
        }
        result = bytes.toString(CryptoJS.enc.Utf8)
        if (!result) throw new Error('Wrong key or corrupted data.')
      }

      setOutputText(result)
      // Save to history
saveUsage('text-encryption', mode, { algorithm })
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your key and input.')
    }
  }

  // Copy output to clipboard
  const handleCopy = () => {
    if (!outputText) return
    navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Clear everything
  const handleClear = () => {
    setInputText('')
    setSecretKey('')
    setOutputText('')
    setError('')
    setCopied(false)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Lock size={22} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Text Encryption</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Encrypt and decrypt text using AES, DES, or RC4 algorithms.
        </p>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap gap-3 mb-6">

        {/* Mode toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => { setMode('encrypt'); setOutputText(''); setError('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${mode === 'encrypt' ? 'bg-green-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            <Lock size={14} /> Encrypt
          </button>
          <button
            onClick={() => { setMode('decrypt'); setOutputText(''); setError('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${mode === 'decrypt' ? 'bg-green-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
          >
            <Unlock size={14} /> Decrypt
          </button>
        </div>

        {/* Algorithm selector */}
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
        >
          <option value="AES">AES (Recommended)</option>
          <option value="DES">DES</option>
          <option value="RC4">RC4</option>
        </select>
      </div>

      {/* Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {mode === 'encrypt' ? 'Text to Encrypt' : 'Encrypted Text to Decrypt'}
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          placeholder={mode === 'encrypt' ? 'Enter your secret message...' : 'Paste encrypted text here...'}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none transition-colors font-mono"
        />
      </div>

      {/* Secret Key */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Secret Key
        </label>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Enter your secret key (keep this safe!)"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1.5">
          ⚠️ You need the same key to decrypt. Never share it.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleProcess}
          className="flex-1 bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-3 rounded-xl transition-colors text-sm"
        >
          {mode === 'encrypt' ? '🔒 Encrypt Text' : '🔓 Decrypt Text'}
        </button>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition-colors text-sm"
        >
          <Trash2 size={16} />
          Clear
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Output */}
      {outputText && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-300">
              {mode === 'encrypt' ? '🔒 Encrypted Result' : '🔓 Decrypted Result'}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors"
            >
              {copied ? <CheckCheck size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-green-400 font-mono text-sm break-all leading-relaxed">
            {outputText}
          </p>
        </div>
      )}
    </div>
  )
}

export default TextEncryption