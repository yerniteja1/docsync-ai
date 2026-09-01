import { useState } from 'react'
import api from '../lib/api'
import type { Document } from '../lib/types'

interface Props {
  onClose: () => void
  onUploaded: (doc: Document) => void
}

function UploadModal({ onClose, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) setFile(dropped)
  }

  async function handleUpload() {
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/documents/upload', formData)
      onUploaded(res.data)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Upload Document</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl">✕</button>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-xl p-10 text-center cursor-pointer transition"
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <div className="text-4xl mb-3">📁</div>
          {file ? (
            <p className="text-white font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-gray-400 text-sm">Drag & drop or click to browse</p>
              <p className="text-gray-600 text-xs mt-1">Supports PDF, DOCX, and TXT</p>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {error && (
          <div className="mt-4 bg-red-900/40 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 py-2.5 rounded-lg text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default UploadModal