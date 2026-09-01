import { useState, useEffect } from 'react'
import DashboardNav from '../components/DashboardNav'
import UploadModal from '../components/UploadModal'
import DocumentCard from '../components/DocumentCard'
import api from '../lib/api'

interface Document {
  id: string
  title: string
  created: string
}

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
    <div className="min-h-screen bg-gray-950 text-white">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Documents</h1>
            <p className="text-gray-400 text-sm mt-1">
              {loading ? 'Loading...' : `${documents.length} document${documents.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            + Upload Document
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
                <div className="w-8 h-8 bg-gray-800 rounded mb-3" />
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl py-24 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-lg font-semibold mb-2">No documents yet</h2>
            <p className="text-gray-500 text-sm mb-6">Upload a PDF or text file to get started</p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
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