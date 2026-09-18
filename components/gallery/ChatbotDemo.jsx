'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const T = { bg: '#09090b', surface: '#18181b', border: '#27272a', text: '#f4f4f5', muted: '#71717a', emerald: '#10b981', indigo: '#6366f1', red: '#ef4444', amber: '#f59e0b' }
const STORAGE_KEY = 'tf_chatbot_demo_v1'

const MODELS = [
  { id: 'deepseek/deepseek-v3.2', name: 'DeepSeek V3.2' },
  { id: 'moonshotai/kimi-k2.5', name: 'Kimi K2.5' },
  { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
  { id: 'xai/grok-4.1-fast', name: 'Grok 4.1 Fast' },
]

const GREETING = { id: 'greeting', role: 'assistant', kind: 'text', text: '안녕하세요! 무엇을 도와드릴까요? (이 챗봇은 샘플 응답만 보여주는 데모예요)' }

const GENERIC_REPLIES = [
  '흥미로운 질문이네요. 실제 서비스에서는 여기서 선택한 모델이 진짜로 답변을 생성하지만, 이 데모는 미리 준비된 샘플 답변만 보여드려요.',
  '데모 모드라 실제 추론은 하지 않지만, 실제 앱에서는 스트리밍으로 답변이 한 글자씩 나타나요.',
  '좋은 지적이에요! 실제 챗봇이라면 대화 맥락을 기억해서 이어지는 답변을 드릴 수 있어요.',
  '이 부분은 실제 서비스에서 AI 모델이 도구(tool)를 호출해서 처리할 수도 있어요 — 예를 들어 날씨 조회나 문서 생성 같은 것들이요.',
]

function makeReply(userText, modelName) {
  const lower = userText.toLowerCase()
  if (/날씨|weather/.test(lower)) {
    return { kind: 'weather', text: `[${modelName}] 날씨 도구를 호출했어요 (샘플 데이터)` }
  }
  if (/코드|code|함수|버그/.test(lower)) {
    return { kind: 'code', text: `[${modelName}] 코드 아티팩트를 만들었어요 (샘플)` }
  }
  const pick = GENERIC_REPLIES[Math.floor(Math.random() * GENERIC_REPLIES.length)]
  return { kind: 'text', text: `[${modelName}] ${pick}` }
}

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* storage unavailable */ }
  return [GREETING]
}

function WeatherCard() {
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, background: T.surface, marginTop: 8, maxWidth: 260 }}>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 6 }}>🔧 도구 호출: get_weather (샘플)</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 28 }}>⛅</span>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>21°C</div>
          <div style={{ fontSize: 12, color: T.muted }}>서울 · 구름 조금</div>
        </div>
      </div>
    </div>
  )
}

function CodeArtifactCard() {
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', marginTop: 8, maxWidth: 380 }}>
      <div style={{ padding: '6px 12px', background: T.surface, fontSize: 12, color: T.muted, borderBottom: `1px solid ${T.border}` }}>📄 code-artifact.py (샘플)</div>
      <pre style={{ margin: 0, padding: 12, background: T.bg, color: T.emerald, fontSize: 12, fontFamily: 'monospace', overflowX: 'auto' }}>
{`def greet(name):
    return f"Hello, {name}!"

print(greet("world"))`}
      </pre>
    </div>
  )
}

export default function ChatbotDemo() {
  const [messages, setMessages] = useState(null)
  const [input, setInput] = useState('')
  const [model, setModel] = useState(MODELS[1].id)
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => { setMessages(loadMessages()) }, [])
  useEffect(() => {
    if (!messages) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)) } catch { /* private mode */ }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  if (!messages) return null

  const modelName = MODELS.find((m) => m.id === model)?.name || model

  const send = () => {
    const text = input.trim()
    if (!text) return
    const userMsg = { id: Date.now(), role: 'user', kind: 'text', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      const reply = makeReply(text, modelName)
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'assistant', ...reply }])
      setThinking(false)
    }, 700 + Math.random() * 500)
  }

  const reset = () => {
    setMessages([GREETING])
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: `${T.amber}18`, borderBottom: `1px solid ${T.amber}44`, padding: '8px 24px', textAlign: 'center', fontSize: 12, color: T.amber }}>
        🧪 샘플 챗봇 — 실제 AI 모델 호출 없이 미리 준비된 답변만 보여드려요.
      </div>

      <header style={{ borderBottom: `1px solid ${T.border}`, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/portfolio" style={{ fontWeight: 800, fontSize: 15, textDecoration: 'none', color: T.text }}>
          Chat<span style={{ color: T.emerald }}>bot</span>
        </Link>
        <select value={model} onChange={(e) => setModel(e.target.value)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 12, padding: '4px 8px', outline: 'none' }}>
          {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={reset} style={{ fontSize: 12, color: T.muted, background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}>새 대화</button>
          <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none', alignSelf: 'center' }}>갤러리로</Link>
        </div>
      </header>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', maxWidth: 720, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 14 }}>
            <div style={{ maxWidth: '80%' }}>
              <div
                style={{
                  background: m.role === 'user' ? T.indigo : T.surface,
                  color: m.role === 'user' ? '#fff' : T.text,
                  border: m.role === 'user' ? 'none' : `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.text}
              </div>
              {m.kind === 'weather' && <WeatherCard />}
              {m.kind === 'code' && <CodeArtifactCard />}
            </div>
          </div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 14 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 14px', fontSize: 13, color: T.muted }}>
              {modelName}가 입력 중…
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, padding: 16 }}>
        <form
          onSubmit={(e) => { e.preventDefault(); send() }}
          style={{ display: 'flex', gap: 8, maxWidth: 720, margin: '0 auto' }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요… (예: 오늘 날씨 어때? / 파이썬 코드 짜줘)"
            style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontSize: 13.5, padding: '10px 12px', outline: 'none' }}
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            style={{ fontSize: 13.5, fontWeight: 600, color: T.bg, background: T.emerald, border: `1px solid ${T.emerald}`, borderRadius: 8, padding: '10px 18px', cursor: thinking ? 'not-allowed' : 'pointer', opacity: thinking ? 0.6 : 1 }}
          >
            보내기
          </button>
        </form>
      </div>
    </div>
  )
}
