import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Document {
  id: string
  title: string
  content: string
}

function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [document, setDocument] = useState<Document | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [docLoading, setDocLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchDocument()
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchDocument() {
    try {
      const res = await api.get(`/documents/${id}`)
      setDocument(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setDocLoading(false)
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(updatedMessages)
    setLoading(true)
    try {
      const res = await api.post(
        `/chat/${id}`,
        {
          message: userMessage,
          history: messages
        }
      )
      setMessages([...updatedMessages, { role: 'assistant', content: res.data.reply }])
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (docLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading document...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 bg-gray-900">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          ← Back
        </button>
        <div>
          <h1 className="font-semibold">{document?.title}</h1>
          <p className="text-xs text-gray-500">Ask anything about this document</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-w-3xl w-full mx-auto">

        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-20">
            <div className="text-4xl mb-3">💬</div>
            <p>Ask a question about your document</p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['Summarize this document', 'What are the key points?', 'What is this document about?'].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-sm border border-gray-700 hover:border-indigo-500 text-gray-400 hover:text-white px-4 py-2 rounded-full transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-gray-800 text-gray-100 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-gray-400">
              Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-6 py-4 bg-gray-900">
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question... (Enter to send)"
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition resize-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 rounded-xl font-medium transition text-sm"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}

export default Chat