import DashboardNav from '../components/DashboardNav'
import { useState } from 'react'

function Dashboard() {
  const [documents] = useState([])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <DashboardNav />

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Documents</h1>
            <p className="text-gray-400 text-sm mt-1">Upload a document to start chatting with it</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
            + Upload Document
          </button>
        </div>

        {/* Empty state */}
        {documents.length === 0 && (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl py-24 text-center">
            <div className="text-5xl mb-4">📄</div>
            <h2 className="text-lg font-semibold mb-2">No documents yet</h2>
            <p className="text-gray-500 text-sm mb-6">Upload a PDF or text file to get started</p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
              Upload your first document
            </button>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard