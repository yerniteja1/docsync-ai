import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import { loginSchema } from '../lib/schemas'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    const next = { ...errors }
    delete next[e.target.name as keyof typeof next]
    setErrors(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = loginSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/login', result.data)
      login(res.data.user, res.data.token, res.data.refresh_token)
      navigate('/dashboard')
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { detail?: string } } }
      setError(apiErr.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-emerald-500/10" />

        {/* Decorative shapes */}
        <div className="absolute top-20 left-16 w-64 h-64 bg-teal-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-12 w-48 h-48 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-teal-400/40 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-emerald-400/40 rounded-full" />

        <div className="relative z-10 px-16 max-w-lg">
          {/* Document icon */}
          <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-8">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Your documents,<br />answered instantly.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Upload PDFs, DOCX, or text files. Ask questions and get
            AI-powered answers with source citations.
          </p>

          <div className="space-y-4">
            {[
              'Semantic search across your documents',
              'Streaming responses with citations',
              'Private — only you see your files',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-teal-500/20 rounded-full flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-teal-400">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-slate-950">
        <div className="w-full max-w-sm">
          <Link to="/" className="text-lg font-bold text-teal-400 mb-10 block">DocSync AI</Link>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in to your account</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition text-sm ${errors.email ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition text-sm ${errors.password ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition text-sm mt-1"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-slate-500 text-sm mt-8 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-400 hover:text-teal-300 transition">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
