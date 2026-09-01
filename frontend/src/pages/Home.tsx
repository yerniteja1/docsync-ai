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
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80">
        <span className="text-xl font-bold text-indigo-400">DocSync AI</span>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-300 hover:text-white transition text-sm">Login</Link>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950" />
        <div className="relative">
          <span className="text-xs uppercase tracking-widest text-indigo-400 bg-indigo-950 border border-indigo-800 px-4 py-1.5 rounded-full mb-8 inline-block">
            AI-Powered Document Assistant
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl mb-6">
            Chat with your documents.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Instantly.
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload any PDF, DOCX, or text file. Ask questions, get summaries, and extract insights
            — all powered by AI with source citations.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-lg font-medium transition text-base shadow-lg shadow-indigo-500/25"
            >
              Start for Free
            </Link>
            <a
              href="#how-it-works"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-medium transition text-base"
            >
              See How It Works
            </a>
          </div>
          <p className="text-gray-600 text-xs mt-6">No credit card required. Free tier included.</p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-8 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
          Three steps from upload to insight. No setup required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-800 via-indigo-500 to-indigo-800" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-6 relative z-10">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-24 bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
            A complete AI document assistant — not just a chatbot.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-700/50 transition group">
                <div className="w-10 h-10 bg-indigo-950 border border-indigo-800 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition">
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-8 py-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Built With</h2>
        <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
          Modern stack, free tier, production-ready architecture.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techStack.map((t) => (
            <div key={t.name} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center hover:border-indigo-700/50 transition">
              <div className="text-2xl mb-3">{t.icon}</div>
              <p className="font-medium text-sm">{t.name}</p>
              <p className="text-gray-500 text-xs mt-1">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RAG Pipeline */}
      <section className="px-8 py-24 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Real RAG Pipeline</h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">
            Not just stuffing documents into a prompt. Semantic search with vector embeddings.
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 font-mono text-sm">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 text-left">
              {pipeline.map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-indigo-300 whitespace-nowrap">
                    {step}
                  </div>
                  {i < pipeline.length - 1 && (
                    <span className="text-gray-600 text-lg hidden md:block">→</span>
                  )}
                  {i < pipeline.length - 1 && (
                    <span className="text-gray-600 text-lg md:hidden">↓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to chat with your documents?</h2>
          <p className="text-gray-400 text-lg mb-10">
            Upload your first document in under 30 seconds. Free tier includes 50MB storage.
          </p>
          <Link
            to="/register"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-lg font-medium transition text-base shadow-lg shadow-indigo-500/25"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 px-8 py-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-indigo-400">DocSync AI</span>
            <span className="text-gray-600 text-sm">· AI Document Assistant</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <Link to="/login" className="hover:text-white transition">Login</Link>
          </div>
          <p className="text-gray-600 text-sm">
            Built with React + FastAPI + Supabase + pgvector
          </p>
        </div>
      </footer>

    </div>
  )
}

const steps = [
  {
    title: 'Upload',
    desc: 'Drop a PDF, DOCX, or TXT file. We parse and chunk it automatically.',
  },
  {
    title: 'Index',
    desc: 'Content is embedded into vectors and stored for semantic search.',
  },
  {
    title: 'Chat',
    desc: 'Ask anything. AI finds relevant chunks and answers with citations.',
  },
]

const features = [
  {
    icon: '📄',
    title: 'Multi-format Upload',
    desc: 'Support for PDF, DOCX, and plain text files. Drag and drop or browse to upload.',
  },
  {
    icon: '🔍',
    title: 'Semantic Search',
    desc: 'Vector embeddings find the most relevant chunks — not just keyword matching.',
  },
  {
    icon: '💬',
    title: 'Streaming Chat',
    desc: 'Responses stream in real-time. See answers as they are generated.',
  },
  {
    icon: '📚',
    title: 'Source Citations',
    desc: 'Every answer cites which chunks it used. Verify claims instantly.',
  },
  {
    icon: '🔒',
    title: 'Private by Default',
    desc: 'Each user sees only their own documents. Row-level security via Supabase.',
  },
  {
    icon: '⚡',
    title: 'Free Tier Ready',
    desc: 'Runs on free hosting. Supabase, HuggingFace, OpenRouter — no credit card needed.',
  },
]

const techStack = [
  { icon: '⚛️', name: 'React', role: 'Frontend' },
  { icon: '🔷', name: 'FastAPI', role: 'Backend' },
  { icon: '🐘', name: 'Supabase', role: 'Database + Auth' },
  { icon: '🔢', name: 'pgvector', role: 'Vector Search' },
  { icon: '🤗', name: 'HuggingFace', role: 'Embeddings' },
  { icon: '🤖', name: 'OpenRouter', role: 'LLM API' },
  { icon: '🐳', name: 'Docker', role: 'Containerization' },
  { icon: '🔄', name: 'GitHub Actions', role: 'CI/CD' },
]

const pipeline = [
  'Upload',
  'Parse',
  'Chunk',
  'Embed',
  'pgvector',
  'Search',
  'LLM',
  'Answer + Citations',
]

export default Home
