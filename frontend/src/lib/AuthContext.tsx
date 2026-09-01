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

async function validateToken(): Promise<User | null> {
  const res = await api.get('/auth/me')
  return res.data.user
}

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

    let cancelled = false

    async function tryValidate() {
      for (let attempt = 0; attempt < 20; attempt++) {
        try {
          const u = await validateToken()
          if (!cancelled) {
            setUser(u)
            setTokenState(storedToken)
          }
          return
        } catch (err: any) {
          if (err.response?.status === 401) {
            if (!cancelled) {
              localStorage.clear()
              setUser(null)
              setTokenState(null)
            }
            return
          }
          await new Promise((r) => setTimeout(r, 3000))
        }
      }
      if (!cancelled) {
        setTokenState(storedToken)
      }
    }

    tryValidate().finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => { cancelled = true }
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
