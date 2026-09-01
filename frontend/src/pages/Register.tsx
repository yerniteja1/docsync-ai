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
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-400">DocSync AI</Link>
          <p className="text-gray-400 mt-2">Create your free account</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition ${errors.password ? 'border-red-500' : 'border-gray-700'}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                className={`w-full bg-gray-800 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition ${errors.confirm ? 'border-red-500' : 'border-gray-700'}`}
              />
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
