import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../lib/api'

interface Props {
  doc: {
    id: string
    title: string
    created: string
  }
  onDeleted: (id: string) => void
}

function DocumentCard({ doc, onDeleted }: Props) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  const date = new Date(doc.created).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm(`Delete "${doc.title}"?`)) return
    setDeleting(true)
    try {
      await api.delete(`/documents/${doc.id}`)
      onDeleted(doc.id)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      onClick={() => navigate(`/chat/${doc.id}`)}
      className="bg-gray-900 border border-gray-800 hover:border-indigo-600 rounded-xl p-5 cursor-pointer transition group relative"
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-3 right-3 text-gray-600 hover:text-red-400 transition text-lg cursor-pointer opacity-0 group-hover:opacity-100"
        title="Delete document"
      >
        {deleting ? '...' : '🗑'}
      </button>

      <div className="text-2xl mb-3">📄</div>
      <h3 className="font-medium text-white group-hover:text-indigo-400 transition truncate pr-6">
        {doc.title}
      </h3>
      <p className="text-xs text-gray-500 mt-1">{date}</p>
    </div>
  )
}

export default DocumentCard
