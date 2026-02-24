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
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-gray-900">
      <span className="text-lg font-bold text-indigo-400">DocSync AI</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          Hi, <span className="text-white font-medium">{user?.name}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default DashboardNav