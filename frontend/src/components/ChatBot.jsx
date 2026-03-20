import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API = 'http://localhost:8000'

const STARTER_MSG = {
    role: 'ai',
    text: "Hello! 👋 I'm your AI Medical Expert, specializing in child nutrition and malnutrition. Ask me anything about:\n\n• Malnutrition types & symptoms\n• Nutrition advice for children\n• BMI interpretation\n• Prevention strategies\n• When to seek medical help",
}

export default function ChatBot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([STARTER_MSG])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const send = async () => {
        const text = input.trim()
        if (!text || loading) return
        setInput('')
        setMessages(m => [...m, { role: 'user', text }])
        setLoading(true)
        try {
            const res = await axios.post(`${API}/api/chat`, { message: text })
            setMessages(m => [...m, { role: 'ai', text: res.data.reply }])
        } catch {
            setMessages(m => [...m, {
                role: 'ai',
                text: '⚠️ I\'m unable to reach the AI service right now. Please make sure the backend is running and your GEMINI_API_KEY is configured.',
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

    return (
        <>
            {/* FAB */}
            <motion.button
                className="chat-fab"
                onClick={() => setOpen(o => !o)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                animate={open ? { rotate: 45 } : { rotate: 0 }}
                title="Chat with AI Medical Expert"
            >
                {open ? '✕' : '💬'}
                {!open && <span className="fab-badge">AI</span>}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="chat-panel glass-card"
                        initial={{ opacity: 0, y: 40, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.92 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <div className="chat-avatar">🩺</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Medical Expert</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <span style={{ width: 6, height: 6, background: 'var(--accent-green)', borderRadius: '50%', display: 'inline-block' }} />
                                    Online · Nutrition Specialist
                                </div>
                            </div>
                            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    className={`msg-bubble ${m.role}`}
                                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {m.role === 'ai' && <div className="msg-avatar">🩺</div>}
                                    <div className={`msg-text ${m.role}`}>
                                        {m.text.split('\n').map((line, j) => (
                                            <span key={j}>{line}{j < m.text.split('\n').length - 1 && <br />}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="msg-bubble ai">
                                    <div className="msg-avatar">🩺</div>
                                    <div className="msg-text ai typing-indicator">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="chat-input-row">
                            <textarea
                                className="chat-input"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Ask about nutrition, malnutrition..."
                                rows={1}
                                disabled={loading}
                            />
                            <motion.button
                                className="send-btn"
                                onClick={send}
                                disabled={!input.trim() || loading}
                                whileHover={input.trim() ? { scale: 1.05 } : {}}
                                whileTap={input.trim() ? { scale: 0.95 } : {}}
                            >
                                {loading ? <span className="btn-spinner" /> : '➤'}
                            </motion.button>
                        </div>
                        <div style={{ padding: '6px 16px 10px', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            AI advice only — always consult a real doctor for diagnosis
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .chat-fab {
          position: fixed;
          bottom: 32px; right: 32px;
          width: 60px; height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 999;
          box-shadow: 0 4px 20px rgba(0, 245, 160, 0.35);
          display: flex; align-items: center; justify-content: center;
          position: fixed;
        }
        .fab-badge {
          position: absolute;
          top: -4px; right: -4px;
          background: #7c3aed;
          color: #fff;
          font-size: 0.55rem;
          font-weight: 700;
          padding: 2px 5px;
          border-radius: 100px;
          letter-spacing: 0.5px;
        }
        .chat-panel {
          position: fixed;
          bottom: 104px; right: 32px;
          width: 400px;
          max-height: 580px;
          display: flex;
          flex-direction: column;
          z-index: 998;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(0, 245, 160, 0.2);
        }
        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(0, 245, 160, 0.12), rgba(0, 195, 227, 0.08));
          border-bottom: 1px solid var(--border);
        }
        .chat-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(0, 245, 160, 0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .chat-close {
          margin-left: auto;
          background: none; border: none;
          color: var(--text-muted);
          font-size: 1rem; cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .chat-close:hover { color: var(--text-primary); }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 280px;
        }
        .msg-bubble {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .msg-bubble.user { flex-direction: row-reverse; }
        .msg-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(0, 245, 160, 0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .msg-text {
          max-width: 78%;
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 0.85rem;
          line-height: 1.6;
          word-break: break-word;
        }
        .msg-text.ai {
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--border);
          border-bottom-left-radius: 4px;
          color: var(--text-primary);
        }
        .msg-text.user {
          background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
          color: #000;
          font-weight: 500;
          border-bottom-right-radius: 4px;
        }
        .typing-indicator {
          display: flex; gap: 5px; align-items: center; height: 24px;
        }
        .typing-indicator span {
          width: 7px; height: 7px;
          background: var(--accent-cyan);
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        .chat-input-row {
          display: flex;
          gap: 10px;
          padding: 12px 16px;
          border-top: 1px solid var(--border);
        }
        .chat-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 10px 14px;
          font-size: 0.88rem;
          font-family: 'Inter', sans-serif;
          resize: none;
          outline: none;
          transition: border-color 0.3s;
          line-height: 1.5;
        }
        .chat-input:focus { border-color: var(--accent-cyan); }
        .send-btn {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
          border: none;
          color: #000;
          font-size: 1rem;
          cursor: pointer;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          align-self: flex-end;
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin-slow 0.7s linear infinite;
        }
        @media (max-width: 480px) {
          .chat-panel { width: calc(100vw - 48px); right: 16px; bottom: 96px; }
          .chat-fab { right: 16px; bottom: 20px; }
        }
      `}</style>
        </>
    )
}
