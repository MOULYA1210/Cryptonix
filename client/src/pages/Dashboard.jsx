// client/src/pages/Dashboard.jsx
import { useState, Suspense } from 'react'
import Navbar   from '../components/Navbar'
import Sidebar  from '../components/Sidebar'

import TextEncryption    from '../tools/TextEncryption'
import PasswordAnalyzer  from '../tools/PasswordAnalyzer'
import PasswordGenerator from '../tools/PasswordGenerator'
import HashGenerator     from '../tools/HashGenerator'
import Base64Tool        from '../tools/Base64Tool'
import JWTDecoder        from '../tools/JWTDecoder'
import FileEncryption    from '../tools/FileEncryption'

const toolComponents = {
  'text-encryption':    <TextEncryption />,
  'password-analyzer':  <PasswordAnalyzer />,
  'password-generator': <PasswordGenerator />,
  'hash-generator':     <HashGenerator />,
  'base64-tool':        <Base64Tool />,
  'jwt-decoder':        <JWTDecoder />,
  'file-encryption':    <FileEncryption />,
}

// Tool display names
const toolNames = {
  'text-encryption':    'Text Encryption',
  'password-analyzer':  'Password Analyzer',
  'password-generator': 'Password Generator',
  'hash-generator':     'Hash Generator',
  'base64-tool':        'Base64 Encoder / Decoder',
  'jwt-decoder':        'JWT Decoder',
  'file-encryption':    'File Encryption',
}

function LoadingTool() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading tool...</p>
      </div>
    </div>
  )
}

function Dashboard() {
  const [activeTool, setActiveTool]   = useState('text-encryption')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="flex pt-14">

        {/* Sidebar — hidden on mobile, visible on desktop */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar
            activeTool={activeTool}
            setActiveTool={(tool) => {
              setActiveTool(tool)
              setSidebarOpen(false)
            }}
          />
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-h-screen">

          {/* Tool header bar */}
          <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              ☰
            </button>
            <h2 className="text-sm font-medium text-gray-400">
              🛡️ {toolNames[activeTool] || 'Tool'}
            </h2>
          </div>

          {/* Tool content */}
          <div className="p-6 md:p-8">
            <Suspense fallback={<LoadingTool />}>
              {toolComponents[activeTool] || (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-lg">🚧 This tool is coming soon!</p>
                </div>
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard