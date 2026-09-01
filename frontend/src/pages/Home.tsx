import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function Home() {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="text-lg font-bold text-teal-400 tracking-tight">DocSync AI</Link>
        <div className="flex gap-3 items-center">
          <Link to="/login" className="text-slate-400 hover:text-white transition text-sm px-3 py-2">Login</Link>
          <Link to="/register" className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">AI-Powered Document Assistant</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Your documents,
            <br />
            <span className="text-teal-400">answered instantly.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload a PDF, DOCX, or text file. Ask questions in plain English.
            Get precise answers with source citations — powered by vector search.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-lg font-medium transition shadow-lg shadow-teal-500/20"
            >
              Start for Free
            </Link>
            <a
              href="#how-it-works"
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-3 rounded-lg font-medium transition"
            >
              See How It Works
            </a>
          </div>
          <p className="text-slate-600 text-xs mt-5">No credit card required.</p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24 border-t border-slate-800/40">
        <div className="max-w-5xl mx-auto">
          <p className="text-teal-400 text-sm font-medium mb-3 text-center">How it works</p>
          <h2 className="text-3xl font-bold text-center mb-16">Three steps. That's it.</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-slate-800">{String(i + 1).padStart(2, '0')}</span>
                  <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center">
                    {s.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 bg-slate-900/20 border-y border-slate-800/40">
        <div className="max-w-5xl mx-auto">
          <p className="text-teal-400 text-sm font-medium mb-3 text-center">Features</p>
          <h2 className="text-3xl font-bold text-center mb-16">Not just a chatbot.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 transition">
                <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline visualization */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-teal-400 text-sm font-medium mb-3">Architecture</p>
          <h2 className="text-3xl font-bold mb-4">Real RAG, not prompt stuffing.</h2>
          <p className="text-slate-400 mb-14 max-w-lg mx-auto">
            Documents are chunked, embedded into vectors, and searched semantically at query time.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {pipeline.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 font-medium">
                  {step}
                </div>
                {i < pipeline.length - 1 && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700 shrink-0">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="px-6 py-24 bg-slate-900/20 border-y border-slate-800/40">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-teal-400 text-sm font-medium mb-3">Built with</p>
          <h2 className="text-3xl font-bold mb-14">Modern stack. Free tier.</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((t) => (
              <div key={t.name} className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-5 hover:border-slate-700 transition">
                <p className="text-2xl mb-2">{t.icon}</p>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Ready to try it?</h2>
          <p className="text-slate-400 text-lg mb-10">
            Upload your first document in under 30 seconds.
          </p>
          <Link
            to="/register"
            className="inline-block bg-teal-600 hover:bg-teal-500 text-white px-10 py-3.5 rounded-lg font-medium transition shadow-lg shadow-teal-500/20"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-teal-400">DocSync AI</span>
            <span className="text-slate-600 text-sm">· RAG Document Assistant</span>
          </div>
          <div className="flex gap-5 text-sm text-slate-500">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <Link to="/login" className="hover:text-white transition">Login</Link>
          </div>
          <p className="text-slate-600 text-sm">React · FastAPI · Supabase · pgvector</p>
        </div>
      </footer>

    </div>
  )
}

const steps = [
  {
    title: 'Upload your file',
    desc: 'Drag and drop a PDF, DOCX, or TXT file. We parse and chunk it into searchable pieces.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    title: 'AI indexes it',
    desc: 'Content is embedded into 384-dimensional vectors and stored for fast semantic search.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Ask anything',
    desc: 'Your question is embedded, matched against document chunks, and answered with citations.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

const features = [
  {
    title: 'Semantic Search',
    desc: 'Vector embeddings find the most relevant chunks — not just keyword matching.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: 'Streaming Responses',
    desc: 'Answers appear token by token as the AI generates them. No waiting.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
  },
  {
    title: 'Source Citations',
    desc: 'Every answer shows which document chunks it used. Verify claims instantly.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: 'Multi-format',
    desc: 'PDF, DOCX, and plain text. More formats coming soon.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    title: 'Private by Default',
    desc: 'Row-level security. Each user only sees their own documents.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'Free to Use',
    desc: 'Runs entirely on free tiers. No credit card, no hidden costs.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
]

const pipeline = ['Upload', 'Parse', 'Chunk', 'Embed', 'pgvector', 'Search', 'LLM', 'Answer']

const techStack = [
  { icon: '⚛️', name: 'React', role: 'Frontend' },
  { icon: '⚡', name: 'FastAPI', role: 'Backend' },
  { icon: '🟢', name: 'Supabase', role: 'Database' },
  { icon: '🔢', name: 'pgvector', role: 'Vectors' },
  { icon: '🤗', name: 'HuggingFace', role: 'Embeddings' },
  { icon: '🤖', name: 'OpenRouter', role: 'LLM' },
  { icon: '🐳', name: 'Docker', role: 'Deploy' },
  { icon: '🔄', name: 'GitHub CI', role: 'Pipeline' },
]

export default Home
