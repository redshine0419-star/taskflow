'use client'
import { useState } from 'react'
import Link from 'next/link'
import { DARK as T } from './theme'

const COLUMNS = [
  { id: 'todo', label: '할 일' },
  { id: 'doing', label: '진행중' },
  { id: 'done', label: '완료' },
]

const PRIORITY_COLOR = { high: T.red, medium: T.amber, low: T.indigo }
const PRIORITY_LABEL = { high: '높음', medium: '보통', low: '낮음' }

const INITIAL_TASKS = [
  { id: 1, title: '랜딩 페이지 카피 초안 작성', priority: 'high', column: 'todo' },
  { id: 2, title: '칸반 보드 드래그 앤 드롭 구현', priority: 'medium', column: 'doing' },
  { id: 3, title: '구글 시트 연동 테스트', priority: 'medium', column: 'doing' },
  { id: 4, title: '온보딩 튜토리얼 UI', priority: 'low', column: 'todo' },
  { id: 5, title: '반응형 레이아웃 QA', priority: 'high', column: 'done' },
]

export default function TaskflowDemo() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [draft, setDraft] = useState('')

  const move = (id, direction) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task
        const idx = COLUMNS.findIndex((c) => c.id === task.column)
        const nextIdx = idx + direction
        if (nextIdx < 0 || nextIdx >= COLUMNS.length) return task
        return { ...task, column: COLUMNS[nextIdx].id }
      })
    )
  }

  const addTask = (e) => {
    e.preventDefault()
    const title = draft.trim()
    if (!title) return
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title, priority: 'medium', column: 'todo' },
    ])
    setDraft('')
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 80px' }}>
      <Link href="/portfolio" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>
        ← 갤러리로 돌아가기
      </Link>

      <header style={{ margin: '16px 0 8px' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>TaskFlow 데모</h1>
        <p style={{ marginTop: 6, fontSize: 13.5, color: T.muted }}>
          로그인 없이 더미 데이터로 체험하는 칸반 보드입니다. 새로고침하면 초기화돼요.
        </p>
      </header>

      <form onSubmit={addTask} style={{ display: 'flex', gap: 8, margin: '24px 0' }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="새 할 일을 입력하세요"
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {COLUMNS.map((column, colIdx) => (
          <div
            key={column.id}
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 14,
              background: T.bg,
              minHeight: 160,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, marginBottom: 12 }}>
              {column.label} · {tasks.filter((t) => t.column === column.id).length}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks
                .filter((task) => task.column === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    style={{
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: 12,
                      background: T.surface,
                    }}
                  >
                    <div style={{ fontSize: 13.5, color: T.text, marginBottom: 8 }}>{task.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: PRIORITY_COLOR[task.priority],
                          border: `1px solid ${PRIORITY_COLOR[task.priority]}`,
                          borderRadius: 999,
                          padding: '2px 8px',
                        }}
                      >
                        {PRIORITY_LABEL[task.priority]}
                      </span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          type="button"
                          onClick={() => move(task.id, -1)}
                          disabled={colIdx === 0}
                          style={navBtnStyle(colIdx === 0)}
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          onClick={() => move(task.id, 1)}
                          disabled={colIdx === COLUMNS.length - 1}
                          style={navBtnStyle(colIdx === COLUMNS.length - 1)}
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function navBtnStyle(disabled) {
  return {
    fontSize: 11,
    color: disabled ? T.border : T.text,
    background: 'transparent',
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    padding: '3px 7px',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
}
