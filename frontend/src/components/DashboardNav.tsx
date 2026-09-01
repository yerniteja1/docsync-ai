import { useAuth } from '../lib/AuthContext'
import { useNavigate } from 'react-router-dom'

function DashboardNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
      <span className="text-lg font-bold text-teal-400 tracking-tight">DocSync AI</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-400">
          Hi, <span className="text-white font-medium">{user?.name}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default DashboardNav
