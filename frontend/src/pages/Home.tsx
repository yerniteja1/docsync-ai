import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function Home() {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (token) return <Navigate to="/dashboard" replace />
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <span className="text-xl font-bold text-indigo-400">DocSync AI</span>
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <span className="text-xs uppercase tracking-widest text-indigo-400 bg-indigo-950 border border-indigo-800 px-3 py-1 rounded-full mb-6">
          AI-Powered Document Assistant
        </span>
        <h1 className="text-5xl font-extrabold leading-tight max-w-3xl mb-6">
          Chat with your documents.{' '}
          <span className="text-indigo-400">Instantly.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Upload any PDF or text file and ask questions, get summaries, and extract insights — powered by AI.
        </p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Start for Free
          </Link>
          <a
            href="#features"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition"
          >
            See Features
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14">Everything you need</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-700 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-8 border-t border-gray-800">
        © {new Date().getFullYear()} DocSync AI. Built with React + FastAPI + OpenRouter.
      </footer>

    </div>
  )
}

const features = [
  {
    icon: '📄',
    title: 'Upload Documents',
    desc: 'Support for PDF and plain text files. Drag and drop or browse to upload.',
  },
  {
    icon: '💬',
    title: 'Ask Anything',
    desc: 'Chat with your document like a conversation. Get precise answers instantly.',
  },
  {
    icon: '✨',
    title: 'AI Summaries',
    desc: 'Get a clean summary of any document in seconds without reading the whole thing.',
  },
]

export default Home