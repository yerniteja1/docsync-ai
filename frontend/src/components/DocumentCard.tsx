import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../lib/api'
import type { Document } from '../lib/types'

interface Props {
  doc: Document
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
      className="bg-slate-900 border border-slate-800 hover:border-teal-700/50 rounded-xl p-5 cursor-pointer transition group relative"
    >
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition cursor-pointer opacity-0 group-hover:opacity-100"
        title="Delete document"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <h3 className="font-medium text-white group-hover:text-teal-400 transition truncate pr-6">
        {doc.title}
      </h3>
      <p className="text-xs text-slate-500 mt-1">{date}</p>
    </div>
  )
}

export default DocumentCard
