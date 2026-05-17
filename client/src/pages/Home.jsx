// client/src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { Shield, Lock, Key, Hash, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  { icon: Lock, title: 'Text & File Encryption',  desc: 'AES-256 encryption for your sensitive text and files.' },
  { icon: Key,  title: 'Password Tools',           desc: 'Analyze strength and generate secure passwords instantly.' },
  { icon: Hash, title: 'Hash Generator',           desc: 'SHA-256, MD5 hashing and file checksum verification.' },
  { icon: Shield, title: 'URL Safety Checker',     desc: 'Detect malicious links before you click them.' },
]

function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 text-green-400 text-sm font-medium mb-8">
          <Shield size={14} />
          All-in-One Cybersecurity Toolkit
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Secure Everything with{' '}
          <span className="text-green-400">FortiShield</span>
        </h1>

        {/* Subheadline */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          A professional cybersecurity platform with 10+ tools —
          encryption, hashing, password analysis, JWT decoding, and more.
          All in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-400 text-gray-900 font-bold rounded-xl transition-all text-base"
          >
            Open Toolkit
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium rounded-xl transition-all text-base"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="pb-24 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-500/40 transition-all group"
              >
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <Icon size={20} className="text-green-400" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Home