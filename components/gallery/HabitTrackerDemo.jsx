'use client'
import { useState } from 'react'
import Link from 'next/link'
import { DARK as T } from './theme'

const INITIAL_HABITS = [
  { id: 1, name: '물 8잔 마시기', streak: 4, doneToday: false },
  { id: 2, name: '30분 운동하기', streak: 12, doneToday: true },
  { id: 3, name: '독서 20페이지', streak: 0, doneToday: false },
  { id: 4, name: '일찍 자기', streak: 7, doneToday: true },
]

export default function HabitTrackerDemo() {
  const [habits, setHabits] = useState(INITIAL_HABITS)
  const [name, setName] = useState('')

  const toggleToday = (id) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit
        const doneToday = !habit.doneToday
        return { ...habit, doneToday, streak: doneToday ? habit.streak + 1 : Math.max(0, habit.streak - 1) }
      })
    )
  }

  const addHabit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setHabits((prev) => [...prev, { id: Date.now(), name: trimmed, streak: 0, doneToday: false }])
    setName('')
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px 80px' }}>
      <Link href="/portfolio" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>
        ← 갤러리로 돌아가기
      </Link>

      <header style={{ margin: '16px 0 8px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>Habit Tracker 데모</h1>
        <p style={{ marginTop: 6, fontSize: 13.5, color: T.muted }}>
          로그인 없이 더미 데이터로 체험하는 습관 트래커입니다. 새로고침하면 초기화돼요.
        </p>
      </header>

      <form onSubmit={addHabit} style={{ display: 'flex', gap: 8, margin: '24px 0' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="새 습관을 입력하세요"
          style={{
            flex: 1,
            fontSize: 13.5,
            color: T.text,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: '10px 12px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: T.bg,
            background: T.emerald,
            border: `1px solid ${T.emerald}`,
            borderRadius: 8,
            padding: '10px 16px',
            cursor: 'pointer',
          }}
        >
          추가
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {habits.map((habit) => (
          <div
            key={habit.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={() => toggleToday(habit.id)}
                aria-label="오늘 완료 체크"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  border: `1px solid ${habit.doneToday ? T.emerald : T.border}`,
                  background: habit.doneToday ? T.emerald : 'transparent',
                  color: T.bg,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {habit.doneToday ? '✓' : ''}
              </button>
              <span style={{ fontSize: 14, color: T.text }}>{habit.name}</span>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: habit.streak > 0 ? T.amber : T.muted,
                border: `1px solid ${habit.streak > 0 ? T.amber : T.border}`,
                borderRadius: 999,
                padding: '3px 10px',
              }}
            >
              🔥 {habit.streak}일 연속
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
