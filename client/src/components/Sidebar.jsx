// client/src/components/Sidebar.jsx
import {
  Lock, Image, Key, Hash, FileText,
  Code, Link, File, CheckSquare, Shield
} from 'lucide-react'

// All tools listed here — easy to add more later
const tools = [
  { id: 'text-encryption',   label: 'Text Encryption',      icon: Lock        },
  { id: 'password-analyzer', label: 'Password Analyzer',    icon: Key         },
  { id: 'password-generator',label: 'Password Generator',   icon: Shield      },
  { id: 'hash-generator',    label: 'Hash Generator',       icon: Hash        },
  { id: 'base64-tool',       label: 'Base64 Encoder',       icon: Code        },
  { id: 'jwt-decoder',       label: 'JWT Decoder',          icon: FileText    },
  { id: 'file-encryption',   label: 'File Encryption',      icon: File        },
  { id: 'checksum-verifier', label: 'Checksum Verifier',    icon: CheckSquare },
  { id: 'url-safety',        label: 'URL Safety Checker',   icon: Link        },
  { id: 'image-encryption',  label: 'Image Encryption',     icon: Image       },
]

function Sidebar({ activeTool, setActiveTool }) {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 border-r border-gray-700 pt-6 pb-10 flex flex-col">

      {/* Section title */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Security Tools
        </p>
      </div>

      {/* Tool list */}
      <nav className="flex flex-col gap-1 px-2">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isActive = activeTool === tool.id

          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left w-full
                ${isActive
                  ? 'bg-green-500 text-gray-900'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <Icon size={16} />
              {tool.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar