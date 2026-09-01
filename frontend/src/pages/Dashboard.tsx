import { useState, useEffect } from 'react'
import DashboardNav from '../components/DashboardNav'
import UploadModal from '../components/UploadModal'
import DocumentCard from '../components/DocumentCard'
import api from '../lib/api'
import type { Document } from '../lib/types'

function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  async function fetchDocuments() {
    try {
      const res = await api.get('/documents/')
      setDocuments(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleUploaded(doc: Document) {
    setDocuments((prev) => [doc, ...prev])
  }

  function handleDeleted(id: string) {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Documents</h1>
            <p className="text-slate-400 text-sm mt-1">
              {loading ? 'Loading...' : `${documents.length} document${documents.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            + Upload Document
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse">
                <div className="w-8 h-8 bg-slate-800 rounded mb-3" />
                <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl py-24 text-center">
            <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">No documents yet</h2>
            <p className="text-slate-500 text-sm mb-6">Upload a PDF, DOCX, or text file to get started</p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Upload your first document
            </button>
          </div>
        )}

        {/* Document grid */}
        {!loading && documents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}

      </main>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  )
}

export default Dashboard
