import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (user: User, token: string, refreshToken: string) => void
  logout: () => void
  setToken: (token: string, refreshToken: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      setLoading(false)
      return
    }

    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.user)
        setTokenState(storedToken)
      })
      .catch(() => {
        localStorage.clear()
        setUser(null)
        setTokenState(null)
      })
      .finally(() => setLoading(false))
  }, [])

  function login(user: User, token: string, refreshToken: string) {
    setUser(user)
    setTokenState(token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('refresh_token', refreshToken)
  }

  function setToken(token: string, refreshToken: string) {
    setTokenState(token)
    localStorage.setItem('token', token)
    localStorage.setItem('refresh_token', refreshToken)
  }

  function logout() {
    setUser(null)
    setTokenState(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
