// client/src/tools/FileEncryption.jsx
import { useState, useRef } from 'react'
import CryptoJS from 'crypto-js'
import { File, Upload, Lock, Unlock, Download } from 'lucide-react'

function FileEncryption() {
  const [file,      setFile]      = useState(null)
  const [key,       setKey]       = useState('')
  const [mode,      setMode]      = useState('encrypt')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [done,      setDone]      = useState(false)
  const fileRef = useRef()

  const handleFile = (e) => {
    setFile(e.target.files[0])
    setDone(false)
    setError('')
  }

  const handleProcess = () => {
    setError('')
    setDone(false)

    if (!file)       return setError('Please select a file.')
    if (!key.trim()) return setError('Please enter a secret key.')
    if (file.size > 5 * 1024 * 1024) return setError('File too large. Max size is 5MB for browser encryption.')

    setLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result)

        let outputData, fileName, mimeType

        if (mode === 'encrypt') {
          const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString()
          outputData      = new Blob([encrypted], { type: 'text/plain' })
          fileName        = file.name + '.enc'
          mimeType        = 'text/plain'
        } else {
          const decrypted = CryptoJS.AES.decrypt(
            new TextDecoder().decode(e.target.result), key
          )
          const typedArray = new Uint8Array(
            decrypted.words.flatMap(w => [
              (w >> 24) & 0xff, (w >> 16) & 0xff,
              (w >> 8)  & 0xff,  w        & 0xff
            ]).slice(0, decrypted.sigBytes)
          )
          outputData = new Blob([typedArray])
          fileName   = file.name.replace('.enc', '') || 'decrypted_file'
          mimeType   = 'application/octet-stream'
        }

        // Download the file
        const url  = URL.createObjectURL(outputData)
        const link = document.createElement('a')
        link.href     = url
        link.download = fileName
        link.click()
        URL.revokeObjectURL(url)

        setDone(true)
      } catch {
        setError('Failed to process file. If decrypting, make sure the key is correct and the file was encrypted by FortiShield.')
      }
      setLoading(false)
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <File size={22} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">File Encryption</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Encrypt any file so only someone with your key can open it.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-800 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => { setMode('encrypt'); setDone(false); setError('') }}
          className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all
            ${mode === 'encrypt' ? 'bg-green-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
        >
          <Lock size={14} /> Encrypt File
        </button>
        <button
          onClick={() => { setMode('decrypt'); setDone(false); setError('') }}
          className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all
            ${mode === 'decrypt' ? 'bg-green-500 text-gray-900' : 'text-gray-400 hover:text-white'}`}
        >
          <Unlock size={14} /> Decrypt File
        </button>
      </div>

      {/* File Upload */}
      <div
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed border-gray-700 hover:border-green-500/50 rounded-xl p-10 text-center cursor-pointer transition-colors mb-5 group"
      >
        <Upload size={32} className="mx-auto text-gray-600 group-hover:text-green-500 mb-3 transition-colors" />
        {file ? (
          <>
            <p className="text-white font-medium text-sm">{file.name}</p>
            <p className="text-gray-500 text-xs mt-1">
              {(file.size / 1024).toFixed(1)} KB — Click to change
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-sm">Click to select a file</p>
            <p className="text-gray-600 text-xs mt-1">Max 5MB</p>
          </>
        )}
        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
      </div>

      {/* Key Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Secret Key</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter a strong secret key"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1.5">⚠️ You need the same key to decrypt the file.</p>
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcess}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition-colors"
      >
        {loading
          ? 'Processing...'
          : mode === 'encrypt'
            ? <><Lock size={16} /> Encrypt & Download</>
            : <><Unlock size={16} /> Decrypt & Download</>
        }
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {/* Success */}
      {done && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2">
          <Download size={16} />
          {mode === 'encrypt'
            ? 'File encrypted and downloaded successfully!'
            : 'File decrypted and downloaded successfully!'}
        </div>
      )}
    </div>
  )
}

export default FileEncryption