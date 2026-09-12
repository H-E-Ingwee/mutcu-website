import { useState, useEffect, useRef } from 'react'
import api from '../lib/api'

const SUGGESTED_QUESTIONS = [
  'How do I join MUTCU?',
  'What ministries does MUTCU have?',
  'When are the Sunday services?',
  'How do I find my ministry?',
  'What is BEST-P?',
  'Tell me about CREAM ministry',
  'How do I access the member portal?',
  'What is MUTCU\'s motto?',
]



function MessageBubble({ message, isLast }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-orange' : 'bg-navy'}`}>
        {isUser
          ? <i className="fas fa-user text-white text-xs" />
          : <i className="fas fa-robot text-orange text-xs" />
        }
      </div>
      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? 'bg-orange text-white rounded-tr-sm' : 'bg-gray-100 text-navy rounded-tl-sm'}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
        <i className="fas fa-robot text-orange text-xs" />
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function MUTCUChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [unread, setUnread] = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setShowSuggestions(false)
    setLoading(true)

    const userMessage = { role: 'user', content: userText }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)

    try {
      // Send only user/assistant messages (not system)
      const chatHistory = newMessages.filter(m => ['user', 'assistant'].includes(m.role))
      const res = await api.post('/ai/chat', { messages: chatHistory })

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.reply,
        provider: res.provider,
      }])

      if (!open) setUnread(u => u + 1)
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or contact us at info@mutcu.org. God bless you! 🙏",
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE])
    setShowSuggestions(true)
  }

  return (
    <>
      {/* ─── Chat Window ─────────────────────────────────────────────────────── */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ animation: 'slideUp 0.3s ease-out' }}>

          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-orange/20 flex items-center justify-center">
                  <i className="fas fa-robot text-orange" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-navy" />
              </div>
              
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} title="Clear chat"
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <i className="fas fa-redo text-xs" />
              </button>
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <i className="fas fa-times" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 min-h-0" style={{ maxHeight: '50vh' }}>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} isLast={i === messages.length - 1} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {showSuggestions && messages.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p className="text-gray-400 text-xs mb-2 font-montserrat font-semibold">Suggested questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-orange/10 text-orange hover:bg-orange hover:text-white font-semibold transition-all border border-orange/20">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about MUTCU..."
                rows={1}
                className="flex-1 resize-none px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-navy placeholder-gray-400 focus:outline-none focus:border-orange transition-colors"
                style={{ maxHeight: '100px', overflowY: 'auto' }}
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-orange hover:bg-orange/90 text-white flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'} text-sm`} />
              </button>
            </div>
            <p className="text-gray-300 text-xs text-center mt-2">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      )}

      {/* ─── Floating Button ──────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-navy shadow-2xl flex items-center justify-center hover:bg-navy-light transition-all hover:scale-110 group"
        style={{ boxShadow: '0 8px 32px rgba(4,0,61,0.4)' }}
        aria-label="Open MUTCU AI Chat"
      >
        {open ? (
          <i className="fas fa-times text-white text-xl" />
        ) : (
          <>
            <i className="fas fa-robot text-orange text-xl group-hover:scale-110 transition-transform" />
            {unread > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange text-white text-xs flex items-center justify-center font-bold">
                {unread}
              </div>
            )}
          </>
        )}
      </button>

      {/* Tooltip on first load */}
      
          <div className="absolute bottom-0 right-5 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-navy" />
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}