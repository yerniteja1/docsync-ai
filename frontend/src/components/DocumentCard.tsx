interface Props {
  doc: {
    id: string
    title: string
    created: string
  }
  onClick: () => void
}

function DocumentCard({ doc, onClick }: Props) {
  const date = new Date(doc.created).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 hover:border-indigo-600 rounded-xl p-5 cursor-pointer transition group"
    >
      <div className="text-2xl mb-3">📄</div>
      <h3 className="font-medium text-white group-hover:text-indigo-400 transition truncate">{doc.title}</h3>
      <p className="text-xs text-gray-500 mt-1">{date}</p>
    </div>
  )
}

export default DocumentCard