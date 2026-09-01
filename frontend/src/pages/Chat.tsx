import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import type { Message, DocumentDetail } from '../lib/types'

interface Source {
  content: string
  chunk_index: number
}

function Chat() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [document, setDocument] = useState<DocumentDetail | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [docLoading, setDocLoading] = useState(true)
  const [sources, setSources] = useState<Source[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchDocument()
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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
    setSources([])

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${api.defaults.baseURL}/chat/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage, history: messages }),
      })

      if (!response.ok) throw new Error('Chat request failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let assistantContent = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.sources) {
              setSources(data.sources)
            } else if (data.content) {
              assistantContent += data.content
              setMessages([...updatedMessages, { role: 'assistant', content: assistantContent }])
            } else if (data.error) {
              assistantContent = data.error
              setMessages([...updatedMessages, { role: 'assistant', content: assistantContent }])
            }
          } catch {
            continue
          }
        }
      }

      if (!assistantContent) {
        setMessages([...updatedMessages, { role: 'assistant', content: 'No response received.' }])
      }
    } catch {
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
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 bg-gray-900">
          <div className="w-12 h-4 bg-gray-800 rounded animate-pulse" />
          <div>
            <div className="w-32 h-4 bg-gray-800 rounded animate-pulse mb-1" />
            <div className="w-24 h-3 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex-1 px-6 py-6 max-w-3xl w-full mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
              <div className={`h-10 rounded-2xl animate-pulse ${
                i % 2 === 0 ? 'w-48 bg-indigo-900' : 'w-64 bg-gray-800'
              }`} />
            </div>
          ))}
        </div>
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
              className={`max-w-xl px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
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
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Sources */}
      {sources.length > 0 && !loading && (
        <div className="border-t border-gray-800 px-6 py-3 bg-gray-900/50">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-500 mb-2">Sources used:</p>
            <div className="flex gap-2 overflow-x-auto">
              {sources.map((s, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-2 py-1 rounded shrink-0"
                  title={s.content}
                >
                  Chunk {s.chunk_index + 1}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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
