'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { DARK as T } from './theme'

const CATEGORIES = ['식비', '교통', '주거', '문화생활', '기타']

const INITIAL_EXPENSES = [
  { id: 1, title: '점심 식사', amount: 12000, category: '식비' },
  { id: 2, title: '지하철', amount: 1500, category: '교통' },
  { id: 3, title: '월세', amount: 550000, category: '주거' },
  { id: 4, title: '영화 관람', amount: 14000, category: '문화생활' },
  { id: 5, title: '커피', amount: 4800, category: '식비' },
]

export default function ExpenseTrackerDemo() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])

  const total = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses])

  const byCategory = useMemo(() => {
    const map = new Map(CATEGORIES.map((c) => [c, 0]))
    expenses.forEach((e) => map.set(e.category, (map.get(e.category) || 0) + e.amount))
    return Array.from(map.entries()).filter(([, sum]) => sum > 0)
  }, [expenses])

  const addExpense = (e) => {
    e.preventDefault()
    const trimmedTitle = title.trim()
    const parsedAmount = Number(amount)
    if (!trimmedTitle || !parsedAmount || parsedAmount <= 0) return
    setExpenses((prev) => [{ id: Date.now(), title: trimmedTitle, amount: parsedAmount, category }, ...prev])
    setTitle('')
    setAmount('')
  }

  const removeExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 80px' }}>
      <Link href="/portfolio" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>
        ← 갤러리로 돌아가기
      </Link>

      <header style={{ margin: '16px 0 8px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>Expense Tracker 데모</h1>
        <p style={{ marginTop: 6, fontSize: 13.5, color: T.muted }}>
          로그인 없이 더미 데이터로 체험하는 가계부입니다. 새로고침하면 초기화돼요.
        </p>
      </header>

      <form onSubmit={addExpense} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '24px 0' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="지출 항목"
          style={{ ...inputStyle(T), flex: '2 1 160px' }}
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="금액"
          type="number"
          min="0"
          style={{ ...inputStyle(T), flex: '1 1 100px' }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle(T), flex: '1 1 110px' }}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button type="submit" style={primaryBtn(T)}>추가</button>
      </form>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ ...summaryCard(T), flex: '1 1 160px' }}>
          <div style={{ fontSize: 12, color: T.muted }}>이번 달 총 지출</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.text, marginTop: 4 }}>{total.toLocaleString()}원</div>
        </div>
        <div style={{ ...summaryCard(T), flex: '2 1 260px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, color: T.muted }}>카테고리별 지출</div>
          {byCategory.map(([cat, sum]) => (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: T.text }}>
              <span>{cat}</span>
              <span>{sum.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {expenses.map((e) => (
          <div
            key={e.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: '10px 14px',
            }}
          >
            <div>
              <div style={{ fontSize: 13.5, color: T.text }}>{e.title}</div>
              <span style={{ fontSize: 11.5, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 999, padding: '2px 8px' }}>
                {e.category}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{e.amount.toLocaleString()}원</span>
              <button type="button" onClick={() => removeExpense(e.id)} style={deleteBtn(T)}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function inputStyle(T) {
  return {
    fontSize: 13.5,
    color: T.text,
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: '10px 12px',
    outline: 'none',
  }
}

function primaryBtn(T) {
  return {
    fontSize: 13.5,
    fontWeight: 600,
    color: T.bg,
    background: T.emerald,
    border: `1px solid ${T.emerald}`,
    borderRadius: 8,
    padding: '10px 16px',
    cursor: 'pointer',
  }
}

function summaryCard(T) {
  return {
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: 16,
  }
}

function deleteBtn(T) {
  return {
    fontSize: 12,
    color: T.muted,
    background: 'transparent',
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    padding: '4px 8px',
    cursor: 'pointer',
  }
}
