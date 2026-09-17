'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { DARK as T } from './theme'

const FOCUS_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

export default function FocusTimerDemo() {
  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS)
  const [running, setRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextMode = mode === 'focus' ? 'break' : 'focus'
          if (mode === 'focus') setCompletedSessions((c) => c + 1)
          setMode(nextMode)
          return nextMode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const toggleRunning = () => setRunning((r) => !r)

  const reset = () => {
    setRunning(false)
    setMode('focus')
    setSecondsLeft(FOCUS_SECONDS)
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  const total = mode === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS
  const progress = 1 - secondsLeft / total

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 24px 80px' }}>
      <Link href="/portfolio" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>
        ← 갤러리로 돌아가기
      </Link>

      <header style={{ margin: '16px 0 8px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>Focus Timer 데모</h1>
        <p style={{ marginTop: 6, fontSize: 13.5, color: T.muted }}>
          25분 집중 · 5분 휴식 뽀모도로 사이클입니다. 새로고침하면 초기화돼요.
        </p>
      </header>

      <div
        style={{
          marginTop: 28,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            color: mode === 'focus' ? T.emerald : T.indigo,
            border: `1px solid ${mode === 'focus' ? T.emerald : T.indigo}`,
            borderRadius: 999,
            padding: '3px 12px',
          }}
        >
          {mode === 'focus' ? '집중 시간' : '휴식 시간'}
        </span>

        <div style={{ fontSize: 56, fontWeight: 700, color: T.text, margin: '20px 0', fontVariantNumeric: 'tabular-nums' }}>
          {minutes}:{seconds}
        </div>

        <div style={{ height: 6, borderRadius: 999, background: T.surface, overflow: 'hidden', marginBottom: 24 }}>
          <div
            style={{
              height: '100%',
              width: `${Math.round(progress * 100)}%`,
              background: mode === 'focus' ? T.emerald : T.indigo,
              transition: 'width 1s linear',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button type="button" onClick={toggleRunning} style={primaryBtn(T)}>
            {running ? '일시정지' : '시작'}
          </button>
          <button type="button" onClick={reset} style={secondaryBtn(T)}>
            리셋
          </button>
        </div>
      </div>

      <p style={{ marginTop: 20, fontSize: 13.5, color: T.muted, textAlign: 'center' }}>
        완료한 집중 세션: <strong style={{ color: T.text }}>{completedSessions}</strong>회
      </p>
    </div>
  )
}

function primaryBtn(T) {
  return {
    fontSize: 13.5,
    fontWeight: 600,
    color: T.bg,
    background: T.emerald,
    border: `1px solid ${T.emerald}`,
    borderRadius: 8,
    padding: '10px 24px',
    cursor: 'pointer',
  }
}

function secondaryBtn(T) {
  return {
    fontSize: 13.5,
    fontWeight: 600,
    color: T.text,
    background: 'transparent',
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: '10px 24px',
    cursor: 'pointer',
  }
}
