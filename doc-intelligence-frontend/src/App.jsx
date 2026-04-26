import { useState, useRef, useEffect } from 'react'

const API_URL = 'ai-document-intelligence-gqsg.onrender.com'

export default function App() {
  const [docId, setDocId] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadError(null)
    setUploading(true)
    setMessages([])
    setDocId(null)
    setFileName(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Upload failed')
      setDocId(data.doc_id)
      setFileName(file.name)
      setMessages([{
        role: 'system',
        text: `Ready. Ask me anything about "${file.name}".`
      }])
      setTimeout(() => inputRef.current?.focus(), 100)
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleQuery = async () => {
    if (!question.trim() || !docId || loading) return
    const userQ = question.trim()
    setQuestion('')
    setMessages(prev => [...prev, { role: 'user', text: userQ }])
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_id: docId, question: userQ })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Query failed')
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${err.message}`, error: true }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: '2rem 1rem'
    }}>
      {/* Ambient orbs */}
      <div style={{
        position: 'fixed', top: '10%', left: '5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120,80,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', right: '5%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,180,0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 100, padding: '6px 18px', marginBottom: 20
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c5cff', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Document Intelligence
            </span>
          </div>
          <h1 style={{
            margin: 0, fontSize: 36, fontWeight: 700,
            background: 'linear-gradient(135deg, #fff 30%, rgba(180,160,255,0.8))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em', lineHeight: 1.15
          }}>
            Ask your documents anything
          </h1>
          <p style={{ margin: '10px 0 0', fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>
            Powered by RAG · ChromaDB · Groq LLaMA 3.3
          </p>
        </div>

        {/* Upload Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20, padding: '1.5rem',
        }}>
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 12, cursor: 'pointer', padding: '1.5rem',
            border: '1.5px dashed rgba(255,255,255,0.15)',
            borderRadius: 14,
            transition: 'border-color 0.2s',
          }}>
            {/* Upload icon */}
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(124,92,255,0.2)',
              border: '1px solid rgba(124,92,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(180,160,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                {uploading ? 'Processing PDF...' : fileName ? `✓ ${fileName}` : 'Drop a PDF or click to browse'}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                PDF files only
              </p>
            </div>
            <input type="file" accept=".pdf" onChange={handleUpload} style={{ display: 'none' }} />
          </label>

          {uploading && (
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                flex: 1, height: 3, borderRadius: 100,
                background: 'rgba(255,255,255,0.08)', overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%', width: '60%', borderRadius: 100,
                  background: 'linear-gradient(90deg, #7c5cff, #00c8b4)',
                  animation: 'shimmer 1.5s ease-in-out infinite'
                }} />
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Embedding chunks...</span>
            </div>
          )}

          {uploadError && (
            <p style={{ margin: '12px 0 0', fontSize: 13, color: '#ff6b6b', textAlign: 'center' }}>
              {uploadError}
            </p>
          )}
        </div>

        {/* Chat Window */}
        {messages.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Chat header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c8b4' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                {fileName}
              </span>
            </div>

            {/* Messages */}
            <div style={{
              maxHeight: 380, overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex', flexDirection: 'column', gap: 14
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {msg.role !== 'user' && (
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: 'rgba(124,92,255,0.25)',
                      border: '1px solid rgba(124,92,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginRight: 10, marginTop: 2
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(180,160,255,0.9)">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="rgba(180,160,255,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(124,92,255,0.5), rgba(90,60,220,0.5))'
                      : msg.role === 'system'
                      ? 'rgba(0,200,180,0.1)'
                      : msg.error
                      ? 'rgba(255,80,80,0.1)'
                      : 'rgba(255,255,255,0.07)',
                    border: msg.role === 'user'
                      ? '1px solid rgba(124,92,255,0.4)'
                      : msg.role === 'system'
                      ? '1px solid rgba(0,200,180,0.2)'
                      : '1px solid rgba(255,255,255,0.08)',
                    fontSize: 14,
                    color: msg.role === 'system' ? 'rgba(0,220,180,0.9)' : 'rgba(255,255,255,0.85)',
                    lineHeight: 1.6
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(124,92,255,0.25)',
                    border: '1px solid rgba(124,92,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(180,160,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: 'rgba(124,92,255,0.6)',
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '1rem 1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', gap: 10
            }}>
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleQuery()}
                placeholder="Ask anything about this document..."
                disabled={loading || !docId}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12, padding: '10px 14px',
                  color: 'white', fontSize: 14,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={handleQuery}
                disabled={loading || !question.trim() || !docId}
                style={{
                  background: 'linear-gradient(135deg, #7c5cff, #5a3cdc)',
                  border: 'none', borderRadius: 12,
                  width: 44, height: 44, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: loading || !question.trim() ? 0.5 : 1,
                  transition: 'opacity 0.2s, transform 0.1s',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
          FastAPI · ChromaDB · Gemini Embeddings · Groq LLaMA 3.3 70B
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 100px; }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { border-color: rgba(124,92,255,0.5) !important; box-shadow: 0 0 0 3px rgba(124,92,255,0.15); }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
