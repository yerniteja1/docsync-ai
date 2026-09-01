import { useState, useEffect, useCallback } from 'react'
import api from '../lib/api'

interface Props {
  children: React.ReactNode
}

function BackendHealthCheck({ children }: Props) {
  const [isHealthy, setIsHealthy] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  const checkHealth = useCallback(async () => {
    try {
      await api.get('/health', { timeout: 5000 })
      setIsHealthy(true)
    } catch {
      setIsHealthy(false)
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 3000)
    return () => clearInterval(interval)
  }, [checkHealth])

  if (isHealthy) return <>{children}</>

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center max-w-sm">
        <div className="mb-6">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">
          {isChecking ? 'Connecting to server...' : 'Server is waking up'}
        </h2>
        <p className="text-gray-400 text-sm">
          Free tier hosting goes to sleep after inactivity.
          <br />
          This usually takes 15-30 seconds.
        </p>
        <p className="text-gray-600 text-xs mt-4">
          Tip: Bookmark the dashboard to avoid cold starts
        </p>
      </div>
    </div>
  )
}

export default BackendHealthCheck
