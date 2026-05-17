// client/src/tools/HashGenerator.jsx
import { useState } from 'react'
import CryptoJS from 'crypto-js'
import { Hash, Copy, CheckCheck, Trash2 } from 'lucide-react'
import useToolHistory from '../hooks/useToolHistory'

const algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512', 'SHA224', 'SHA384']

function generateHash(text, algo) {
  switch (algo) {
    case 'MD5':    return CryptoJS.MD5(text).toString()
    case 'SHA1':   return CryptoJS.SHA1(text).toString()
    case 'SHA256': return CryptoJS.SHA256(text).toString()
    case 'SHA512': return CryptoJS.SHA512(text).toString()
    case 'SHA224': return CryptoJS.SHA224(text).toString()
    case 'SHA384': return CryptoJS.SHA384(text).toString()
    default:       return ''
  }
}

function HashGenerator() {
  const [inputText, setInputText] = useState('')
  const [selected,  setSelected]  = useState('SHA256')
  const [copied,    setCopied]    = useState('')
  const { saveUsage } = useToolHistory()

  const hash = inputText ? generateHash(inputText, selected) : ''

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const handleAlgoChange = async (algo) => {
    setSelected(algo)
    if (inputText) {
      await saveUsage('hash-generator', 'generate', { algorithm: algo })
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Hash size={22} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Hash Generator</h1>
        </div>
        <p className="text-gray-400 text-sm">Generate cryptographic hashes from any text.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {algorithms.map((algo) => (
          <button
            key={algo}
            onClick={() => handleAlgoChange(algo)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
              ${selected === algo ? 'bg-green-500 text-gray-900' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}
          >
            {algo}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-300 mb-2">Input Text</label>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            placeholder="Enter any text to hash..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none transition-colors"
          />
          {inputText && (
            <button onClick={() => setInputText('')} className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {hash && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-green-400">{selected} Hash</span>
            <button onClick={() => handleCopy(hash, selected)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors">
              {copied === selected ? <CheckCheck size={13} className="text-green-400" /> : <Copy size={13} />}
              {copied === selected ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-green-400 font-mono text-sm break-all">{hash}</p>
        </div>
      )}

      {inputText && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-300 mb-4">All Algorithms</p>
          <div className="flex flex-col gap-4">
            {algorithms.map((algo) => {
              const h = generateHash(inputText, algo)
              return (
                <div key={algo}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{algo}</span>
                    <button onClick={() => handleCopy(h, algo)} className="text-xs text-gray-500 hover:text-green-400 flex items-center gap-1 transition-colors">
                      {copied === algo ? <CheckCheck size={12} className="text-green-400" /> : <Copy size={12} />}
                      {copied === algo ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-gray-300 font-mono text-xs break-all bg-gray-800 rounded-lg px-3 py-2">{h}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default HashGenerator