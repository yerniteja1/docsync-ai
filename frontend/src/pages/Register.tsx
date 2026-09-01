import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../lib/api'
import { registerSchema } from '../lib/schemas'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
    const next = { ...errors }
    delete next[e.target.name]
    setErrors(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const result = registerSchema.safeParse(form)
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
      await api.post('/auth/register', {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      })
      navigate('/login')
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { detail?: string } } }
      setError(apiErr.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />

        <div className="absolute top-32 right-16 w-56 h-56 bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-500/8 rounded-full blur-3xl" />

        <div className="relative z-10 px-16 max-w-lg">
          <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-8">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Start chatting with<br />your documents today.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Create a free account. No credit card required.
            Upload your first document in under 30 seconds.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '50MB', label: 'Free storage' },
              { value: '∞', label: 'Questions' },
              { value: '<2s', label: 'Response time' },
              { value: '100%', label: 'Private' },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-slate-950">
        <div className="w-full max-w-sm">
          <Link to="/" className="text-lg font-bold text-teal-400 mb-10 block">DocSync AI</Link>

          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-8">Get started for free</p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition text-sm ${errors.name ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
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
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                className={`w-full bg-slate-900 border rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition text-sm ${errors.confirm ? 'border-red-500' : 'border-slate-800'}`}
              />
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition text-sm mt-1"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-slate-500 text-sm mt-8 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 transition">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
