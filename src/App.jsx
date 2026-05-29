import { useState, useEffect, useRef, useCallback } from 'react'

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const Z = {
  bg:      '#09090b', // zinc-950
  surface: '#18181b', // zinc-900
  border:  '#27272a', // zinc-800
  text:    '#f4f4f5', // zinc-100
  muted:   '#a1a1aa', // zinc-400
  emerald: '#34d399', // emerald-400
  indigo:  '#818cf8', // indigo-400
  red:     '#f87171', // red-400
  amber:   '#fbbf24', // amber-400
}

const css = {
  root: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    background: Z.bg,
    color: Z.text,
    minHeight: '100vh',
    fontSize: 14,
    lineHeight: 1.5,
  },
}

// ─── INITIAL DATA ────────────────────────────────────────────────────────────
const STAGES = ['기획', '디자인', '퍼블', '개발']
const PRIORITIES = ['높음', '보통', '낮음']

const INITIAL_TASKS = [
  { id: 1, title: '홈페이지 리뉴얼 기획서', stage: '기획', assignee: '김민준', dueDate: '2026-06-10', priority: '높음', rowNum: 2, published: false },
  { id: 2, title: '로그인 UI 와이어프레임', stage: '디자인', assignee: '이서연', dueDate: '2026-06-15', priority: '보통', rowNum: 3, published: false },
  { id: 3, title: '메인 랜딩 퍼블리싱', stage: '퍼블', assignee: '박지호', dueDate: '2026-06-20', priority: '보통', rowNum: 4, published: false },
  { id: 4, title: 'API 인증 모듈 개발', stage: '개발', assignee: '최수아', dueDate: '2026-06-25', priority: '높음', rowNum: 5, published: false },
  { id: 5, title: '대시보드 컴포넌트 설계', stage: '기획', assignee: '정다은', dueDate: '2026-07-01', priority: '낮음', rowNum: 6, published: false },
  { id: 6, title: '모바일 반응형 디자인', stage: '디자인', assignee: '이서연', dueDate: '2026-07-05', priority: '높음', rowNum: 7, published: false },
  { id: 7, title: '검색 기능 구현', stage: '개발', assignee: '김민준', dueDate: '2026-07-10', priority: '보통', rowNum: 8, published: true },
]

const SAMPLE_MINUTES = `[2026-05-29 개발팀 주간 회의]
참석: 김민준, 이서연, 박지호

1. 알림 시스템 리팩터링 (담당: 박지호, 마감: 2026-07-15, 우선순위: 높음) — 기획 단계
2. 다크모드 토글 컴포넌트 개발 (담당: 이서연, 마감: 2026-07-20, 우선순위: 보통) — 디자인 단계
3. 성능 모니터링 대시보드 (담당: 김민준, 마감: 2026-07-25, 우선순위: 높음) — 개발 단계`

// ─── UTILS ───────────────────────────────────────────────────────────────────
let logId = 0
const makeLog = (msg, type = 'info') => ({
  id: ++logId,
  time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
  msg,
  type, // info | success | error | ai
})

const simulateApiCall = (desc, duration = 400) =>
  new Promise(resolve => setTimeout(() => resolve({ ok: true, desc }), duration))

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ children, color = Z.muted }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '1px 7px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      border: `1px solid ${color}33`,
      color,
      background: `${color}18`,
    }}>
      {children}
    </span>
  )
}

function PriorityBadge({ priority }) {
  const colors = { '높음': Z.red, '보통': Z.amber, '낮음': Z.muted }
  return <Badge color={colors[priority] || Z.muted}>{priority}</Badge>
}

// ─── BUTTON ──────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'default', small, style, disabled }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    border: 'none',
    borderRadius: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    transition: 'opacity .15s, background .15s',
    opacity: disabled ? 0.5 : 1,
    fontSize: small ? 12 : 13,
    padding: small ? '4px 10px' : '7px 14px',
  }
  const variants = {
    default:  { background: Z.border, color: Z.text },
    primary:  { background: Z.indigo, color: '#fff' },
    emerald:  { background: Z.emerald, color: '#052e16' },
    ghost:    { background: 'transparent', color: Z.muted, padding: small ? '3px 6px' : '6px 10px' },
    danger:   { background: '#7f1d1d33', color: Z.red, border: `1px solid ${Z.red}33` },
  }
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  )
}

// ─── INPUT ───────────────────────────────────────────────────────────────────
function Input({ value, onChange, placeholder, style, type = 'text', onKeyDown }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      style={{
        background: Z.surface,
        border: `1px solid ${Z.border}`,
        borderRadius: 6,
        color: Z.text,
        fontSize: 13,
        padding: '6px 10px',
        outline: 'none',
        width: '100%',
        ...style,
      }}
    />
  )
}

// ─── SELECT ──────────────────────────────────────────────────────────────────
function Select({ value, onChange, options, style }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: Z.surface,
        border: `1px solid ${Z.border}`,
        borderRadius: 6,
        color: Z.text,
        fontSize: 12,
        padding: '4px 8px',
        outline: 'none',
        cursor: 'pointer',
        ...style,
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ─── TOGGLE ──────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: checked ? Z.emerald : Z.border,
        position: 'relative', cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: checked ? 19 : 3,
        width: 14, height: 14, borderRadius: '50%',
        background: checked ? '#052e16' : Z.muted,
        transition: 'left .2s',
      }} />
    </div>
  )
}

// ─── SIDE DRAWER (API Log) ────────────────────────────────────────────────────
function SideDrawer({ open, onClose, logs }) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.4)', zIndex: 40,
          }}
        />
      )}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: Math.min(380, typeof window !== 'undefined' ? window.innerWidth : 380),
        height: '100vh',
        background: Z.surface,
        borderLeft: `1px solid ${Z.border}`,
        zIndex: 50,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${Z.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: Z.emerald, letterSpacing: 1 }}>
              ● SYNC CONSOLE
            </span>
          </div>
          <Btn variant="ghost" small onClick={onClose}>✕</Btn>
        </div>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '12px 16px',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: 11,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {logs.length === 0 && (
            <div style={{ color: Z.muted, textAlign: 'center', marginTop: 40 }}>
              아직 동기화 로그가 없습니다
            </div>
          )}
          {[...logs].reverse().map(l => (
            <div key={l.id} style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              padding: '4px 0',
              borderBottom: `1px solid ${Z.border}`,
            }}>
              <span style={{ color: Z.muted, flexShrink: 0 }}>{l.time}</span>
              <span style={{
                color: l.type === 'success' ? Z.emerald
                  : l.type === 'error' ? Z.red
                  : l.type === 'ai' ? Z.indigo
                  : Z.muted,
              }}>
                {l.type === 'success' ? '✓' : l.type === 'error' ? '✗' : l.type === 'ai' ? '◆' : '›'}
              </span>
              <span style={{ color: Z.text, wordBreak: 'break-all' }}>{l.msg}</span>
            </div>
          ))}
        </div>
        <div style={{
          padding: '10px 16px',
          borderTop: `1px solid ${Z.border}`,
          color: Z.muted, fontSize: 10,
        }}>
          Google Sheets API v4 · Drive API v3 · scope: drive.file
        </div>
      </div>
    </>
  )
}

// ─── AI PARSER MODAL ──────────────────────────────────────────────────────────
function AIParserModal({ open, onClose, onConfirm, addLog }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const parse = async () => {
    if (!text.trim()) return
    setLoading(true)
    addLog('Gemini 2.5 Flash API 요청 전송 중…', 'ai')
    await simulateApiCall('gemini', 600)

    const parsed = []
    const lines = text.split('\n').filter(l => l.trim())
    let nextId = Date.now()

    lines.forEach(line => {
      const titleMatch = line.match(/^\d+\.\s+(.+?)\s*[\(（]/)
      const assigneeMatch = line.match(/담당[:\s：]+([가-힣]+)/)
      const dueDateMatch = line.match(/마감[:\s：]+([\d\-]+)/)
      const priorityMatch = line.match(/우선순위[:\s：]+([가-힣]+)/)
      const stageMatch = line.match(/(기획|디자인|퍼블|개발)\s*단계/)

      if (titleMatch || (assigneeMatch && dueDateMatch)) {
        parsed.push({
          id: nextId++,
          title: titleMatch ? titleMatch[1].trim() : `태스크 #${parsed.length + 1}`,
          assignee: assigneeMatch ? assigneeMatch[1] : '미배정',
          dueDate: dueDateMatch ? dueDateMatch[1] : '',
          priority: priorityMatch ? priorityMatch[1] : '보통',
          stage: stageMatch ? stageMatch[1] : '기획',
          rowNum: 100 + parsed.length,
          published: false,
        })
      }
    })

    if (parsed.length === 0) {
      parsed.push({
        id: nextId,
        title: '신규 파싱 태스크',
        assignee: '미배정',
        dueDate: '2026-07-31',
        priority: '보통',
        stage: '기획',
        rowNum: 100,
        published: false,
      })
    }

    setResults(parsed)
    addLog(`AI 파싱 완료: ${parsed.length}개 태스크 추출`, 'ai')
    setLoading(false)
  }

  const confirm = async () => {
    addLog(`Google Sheets append 요청: ${results.length}행 일괄 적재`, 'info')
    await simulateApiCall('sheets_append', 500)
    addLog(`Sheets API 응답 200 · ${results.length}개 행 삽입 완료`, 'success')
    onConfirm(results)
    setText('')
    setResults(null)
    onClose()
  }

  const close = () => {
    setText('')
    setResults(null)
    onClose()
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,.6)',
      zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: Z.surface,
        border: `1px solid ${Z.border}`,
        borderRadius: 12,
        width: '100%', maxWidth: 640,
        maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: `1px solid ${Z.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              <span style={{ color: Z.indigo }}>◆</span> AI 회의록 파서
            </div>
            <div style={{ fontSize: 11, color: Z.muted, marginTop: 2 }}>
              Gemini 2.5 Flash · 비정형 텍스트 → 구조화 데이터
            </div>
          </div>
          <Btn variant="ghost" small onClick={close}>✕</Btn>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {!results ? (
            <>
              <div style={{ fontSize: 12, color: Z.muted, marginBottom: 8 }}>
                회의록, 슬랙 대화 로그 등을 붙여넣기 하세요
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={SAMPLE_MINUTES}
                rows={10}
                style={{
                  width: '100%', background: Z.bg,
                  border: `1px solid ${Z.border}`,
                  borderRadius: 8, color: Z.text,
                  fontSize: 12, padding: 12,
                  resize: 'vertical', outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <Btn
                  variant="ghost" small
                  onClick={() => setText(SAMPLE_MINUTES)}
                >
                  샘플 불러오기
                </Btn>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 12, color: Z.muted, marginBottom: 12 }}>
                AI가 {results.length}개의 태스크를 추출했습니다. 검수 후 확인하세요.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.map((t, i) => (
                  <div key={t.id} style={{
                    background: Z.bg, border: `1px solid ${Z.border}`,
                    borderRadius: 8, padding: '12px 14px',
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>
                      {i + 1}. {t.title}
                    </div>
                    <div style={{
                      display: 'flex', gap: 8, flexWrap: 'wrap',
                      fontSize: 11, color: Z.muted,
                    }}>
                      <span>단계: <span style={{ color: Z.indigo }}>{t.stage}</span></span>
                      <span>담당: {t.assignee}</span>
                      <span>마감: {t.dueDate}</span>
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${Z.border}`,
          display: 'flex', gap: 8, justifyContent: 'flex-end',
        }}>
          {!results ? (
            <>
              <Btn variant="ghost" onClick={close}>취소</Btn>
              <Btn
                variant="primary"
                onClick={parse}
                disabled={loading || !text.trim()}
              >
                {loading ? '분석 중…' : '◆ AI 분석'}
              </Btn>
            </>
          ) : (
            <>
              <Btn variant="ghost" onClick={() => setResults(null)}>다시 입력</Btn>
              <Btn variant="emerald" onClick={confirm}>✓ 확인 · 시트에 추가</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── TASK CARD ────────────────────────────────────────────────────────────────
function TaskCard({ task, isMobile, onStageChange, onPublish, addLog }) {
  const stageIdx = STAGES.indexOf(task.stage)

  const moveStage = async (dir) => {
    const newStage = STAGES[stageIdx + dir]
    if (!newStage) return
    addLog(`Sheets API 요청: row${task.rowNum} C열 → "${newStage}"`, 'info')
    onStageChange(task.id, newStage)
    simulateApiCall('sheets_update', 350).then(() =>
      addLog(`Sheets 동기화 완료: row${task.rowNum} "${newStage}"`, 'success')
    )
  }

  return (
    <div style={{
      background: Z.surface,
      border: `1px solid ${Z.border}`,
      borderRadius: 8, padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'border-color .15s',
    }}>
      <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4 }}>{task.title}</div>
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center',
        fontSize: 11, color: Z.muted,
      }}>
        <span>👤 {task.assignee}</span>
        <span>📅 {task.dueDate}</span>
        <PriorityBadge priority={task.priority} />
        {task.published && <Badge color={Z.emerald}>발행됨</Badge>}
      </div>
      {isMobile && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Btn
            variant="ghost" small
            onClick={() => moveStage(-1)}
            disabled={stageIdx === 0}
            style={{ flex: 1, justifyContent: 'center' }}
          >◀ 이전</Btn>
          <span style={{ fontSize: 10, color: Z.muted, flexShrink: 0 }}>{task.stage}</span>
          <Btn
            variant="ghost" small
            onClick={() => moveStage(1)}
            disabled={stageIdx === STAGES.length - 1}
            style={{ flex: 1, justifyContent: 'center' }}
          >다음 ▶</Btn>
        </div>
      )}
      {task.stage === '개발' && !task.published && (
        <Btn variant="emerald" small onClick={() => onPublish(task.id)}>
          ↑ Autopress 발행
        </Btn>
      )}
    </div>
  )
}

// ─── KANBAN VIEW ──────────────────────────────────────────────────────────────
function KanbanView({ tasks, isMobile, onStageChange, onPublish, addLog }) {
  const [activeStageIdx, setActiveStageIdx] = useState(0)

  const visibleStages = isMobile ? [STAGES[activeStageIdx]] : STAGES

  return (
    <div>
      {isMobile && (
        <div style={{
          display: 'flex', gap: 0,
          border: `1px solid ${Z.border}`,
          borderRadius: 8, overflow: 'hidden',
          marginBottom: 16,
        }}>
          {STAGES.map((s, i) => (
            <button
              key={s}
              onClick={() => setActiveStageIdx(i)}
              style={{
                flex: 1, padding: '8px 4px',
                background: i === activeStageIdx ? Z.indigo + '33' : 'transparent',
                border: 'none',
                borderRight: i < STAGES.length - 1 ? `1px solid ${Z.border}` : 'none',
                color: i === activeStageIdx ? Z.indigo : Z.muted,
                fontSize: 12, fontWeight: i === activeStageIdx ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : `repeat(${STAGES.length}, 1fr)`,
        gap: 12,
      }}>
        {visibleStages.map(stage => {
          const stageTasks = tasks.filter(t => t.stage === stage)
          return (
            <div key={stage}>
              {!isMobile && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 10,
                  paddingBottom: 8, borderBottom: `1px solid ${Z.border}`,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: Z.muted }}>{stage}</span>
                  <span style={{
                    fontSize: 10, background: Z.border,
                    borderRadius: 10, padding: '1px 7px', color: Z.muted,
                  }}>{stageTasks.length}</span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stageTasks.length === 0 && !isMobile && (
                  <div style={{
                    border: `1px dashed ${Z.border}`, borderRadius: 8,
                    padding: 20, textAlign: 'center', color: Z.muted, fontSize: 12,
                  }}>
                    태스크 없음
                  </div>
                )}
                {stageTasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    isMobile={isMobile}
                    onStageChange={onStageChange}
                    onPublish={onPublish}
                    addLog={addLog}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── SPREADSHEET VIEW ────────────────────────────────────────────────────────
function InlineInput({ value, onChange, type = 'text' }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  useEffect(() => { setVal(value) }, [value])

  const commit = () => {
    setEditing(false)
    if (val !== value) onChange(val)
  }

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit() }}
        style={{
          background: Z.bg, border: `1px solid ${Z.indigo}`,
          borderRadius: 4, color: Z.text, fontSize: 12,
          padding: '3px 6px', outline: 'none', width: '100%',
        }}
      />
    )
  }
  return (
    <div
      onClick={() => setEditing(true)}
      style={{
        padding: '3px 6px', borderRadius: 4, cursor: 'text',
        fontSize: 12, minHeight: 22,
        border: '1px solid transparent',
        transition: 'border-color .1s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = Z.border}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
    >
      {value || <span style={{ color: Z.muted }}>—</span>}
    </div>
  )
}

function SpreadsheetView({ tasks, onUpdateTask, addLog }) {
  const cols = ['#', '제목', '단계', '담당자', '마감일', '우선순위']

  const update = async (id, field, value) => {
    addLog(`인라인 편집: row${id} [${field}] → "${value}"`, 'info')
    onUpdateTask(id, field, value)
    simulateApiCall('sheets_update', 300).then(() =>
      addLog(`Sheets 동기화 완료: row${id} [${field}] 업데이트`, 'success')
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${Z.border}` }}>
            {cols.map(c => (
              <th key={c} style={{
                padding: '8px 10px', textAlign: 'left',
                color: Z.muted, fontWeight: 600, fontSize: 11,
                whiteSpace: 'nowrap',
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((t, i) => (
            <tr
              key={t.id}
              style={{ borderBottom: `1px solid ${Z.border}`, transition: 'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background = Z.surface}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '6px 10px', color: Z.muted }}>{i + 1}</td>
              <td style={{ padding: '4px 6px', minWidth: 180 }}>
                <InlineInput value={t.title} onChange={v => update(t.id, 'title', v)} />
              </td>
              <td style={{ padding: '4px 6px' }}>
                <Select
                  value={t.stage}
                  onChange={v => update(t.id, 'stage', v)}
                  options={STAGES}
                />
              </td>
              <td style={{ padding: '4px 6px', minWidth: 80 }}>
                <InlineInput value={t.assignee} onChange={v => update(t.id, 'assignee', v)} />
              </td>
              <td style={{ padding: '4px 6px', minWidth: 100 }}>
                <InlineInput value={t.dueDate} onChange={v => update(t.id, 'dueDate', v)} type="date" />
              </td>
              <td style={{ padding: '4px 6px' }}>
                <Select
                  value={t.priority}
                  onChange={v => update(t.id, 'priority', v)}
                  options={PRIORITIES}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── AUTOPRESS VIEW ──────────────────────────────────────────────────────────
function AutopressView({ tasks, addLog }) {
  const [selected, setSelected] = useState(null)
  const [article, setArticle] = useState(null)
  const [generating, setGenerating] = useState(false)

  const published = tasks.filter(t => t.published)

  const genArticle = async (task) => {
    setSelected(task)
    setGenerating(true)
    setArticle(null)
    addLog(`Autopress SEO 아티클 생성 요청: "${task.title}"`, 'ai')
    await simulateApiCall('autopress', 700)
    const md = `# ${task.title} — 개발 회고록

**담당자:** ${task.assignee}
**완료일:** ${task.dueDate}
**우선순위:** ${task.priority}

## 요약

본 태스크는 TaskFlow 워크스페이스에서 관리된 ${task.title} 작업의
최종 완료 회고록입니다.

## 주요 작업 내역

- 요건 분석 및 기술 스펙 정의
- UI/UX 설계 및 퍼블리싱 완료
- 코드 리뷰 및 QA 테스트 통과
- 프로덕션 배포 완료

## 성과 및 인사이트

${task.assignee} 담당자 주도 하에 ${task.dueDate} 기한 내 성공적으로
완료하였습니다. 아사나 지라 대체 무료 칸반보드 키워드 SEO 최적화 완료.

---
*taskflow.io/blog/${task.title.replace(/\s+/g, '-').toLowerCase()}*`
    setArticle(md)
    addLog(`SEO 아티클 생성 완료: taskflow.io/blog/`, 'success')
    setGenerating(false)
  }

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: '0 0 220px', minWidth: 180 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, marginBottom: 10, letterSpacing: 1 }}>
          발행된 태스크
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {published.length === 0 && (
            <div style={{ color: Z.muted, fontSize: 12 }}>
              칸반 개발 탭에서 발행하세요
            </div>
          )}
          {published.map(t => (
            <div
              key={t.id}
              onClick={() => genArticle(t)}
              style={{
                background: selected?.id === t.id ? `${Z.indigo}22` : Z.surface,
                border: `1px solid ${selected?.id === t.id ? Z.indigo : Z.border}`,
                borderRadius: 8, padding: '10px 12px',
                cursor: 'pointer', transition: 'border-color .15s',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600 }}>{t.title}</div>
              <div style={{ fontSize: 11, color: Z.muted, marginTop: 3 }}>
                {t.assignee} · {t.dueDate}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {generating && (
          <div style={{ color: Z.indigo, fontSize: 13, padding: 20 }}>
            ◆ SEO 아티클 생성 중…
          </div>
        )}
        {article && !generating && (
          <div style={{
            background: Z.surface, border: `1px solid ${Z.border}`,
            borderRadius: 8, padding: '16px 20px',
          }}>
            <div style={{
              fontSize: 10, color: Z.emerald, fontWeight: 700,
              letterSpacing: 1, marginBottom: 12,
            }}>
              ● PUBLISHED · taskflow.io/blog/
            </div>
            <pre style={{
              fontFamily: 'inherit', fontSize: 12, color: Z.text,
              whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.7,
            }}>{article}</pre>
          </div>
        )}
        {!article && !generating && (
          <div style={{
            border: `1px dashed ${Z.border}`, borderRadius: 8,
            padding: 40, textAlign: 'center', color: Z.muted, fontSize: 12,
          }}>
            좌측에서 발행된 태스크를 클릭하면 SEO 아티클이 생성됩니다
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SETTINGS VIEW ───────────────────────────────────────────────────────────
function SettingsView({ user }) {
  const [isPublic, setIsPublic] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [autoSync, setAutoSync] = useState(true)

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          {
            label: '구글 크롤봇 수집 허용',
            desc: 'Autopress 발행 포스트를 검색 엔진에 공개합니다',
            value: isPublic, set: setIsPublic,
          },
          {
            label: '실시간 자동 동기화',
            desc: 'Google Sheets API 자동 양방향 동기화',
            value: autoSync, set: setAutoSync,
          },
          {
            label: '동기화 알림',
            desc: '싱크 성공/실패 시 콘솔 배지에 알림 표시',
            value: notifications, set: setNotifications,
          },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 0',
            borderBottom: i < arr.length - 1 ? `1px solid ${Z.border}` : 'none',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: Z.muted, marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle checked={item.value} onChange={item.set} />
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 24,
        background: Z.surface, border: `1px solid ${Z.border}`,
        borderRadius: 8, padding: '14px 16px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, marginBottom: 8, letterSpacing: 1 }}>
          연결된 계정
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: Z.indigo + '44',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: Z.indigo,
          }}>
            {user?.name?.[0] ?? 'U'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name ?? '사용자'}</div>
            <div style={{ fontSize: 11, color: Z.muted }}>{user?.email ?? ''}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Badge color={Z.emerald}>Drive 연결됨</Badge>
          </div>
        </div>
        <div style={{
          marginTop: 10, fontSize: 10, color: Z.muted,
          padding: '6px 8px', background: Z.bg, borderRadius: 4,
        }}>
          🔒 scope: drive.file — 앱이 생성한 파일에만 접근. 개인 파일 접근 불가.
        </div>
      </div>
    </div>
  )
}

// ─── WORKSPACE ───────────────────────────────────────────────────────────────
function Workspace({ user, onSignOut, isMobile }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [activeTab, setActiveTab] = useState('kanban')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [aiModalOpen, setAIModalOpen] = useState(false)
  const [logs, setLogs] = useState([
    makeLog('Drive API: TaskFlow_Database_2026.xlsx 생성 완료', 'success'),
    makeLog('Google Sheets: 시트 초기화 완료 (7행)', 'success'),
    makeLog('양방향 실시간 동기화 활성화', 'info'),
  ])
  const [newLogCount, setNewLogCount] = useState(0)
  const drawerOpenRef = useRef(false)

  useEffect(() => { drawerOpenRef.current = drawerOpen }, [drawerOpen])

  const addLog = useCallback((msg, type = 'info') => {
    setLogs(prev => [...prev, makeLog(msg, type)])
    if (!drawerOpenRef.current) setNewLogCount(n => n + 1)
  }, [])

  const openDrawer = () => {
    setDrawerOpen(true)
    setNewLogCount(0)
  }

  const onStageChange = (id, newStage) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, stage: newStage } : t))
  }

  const onUpdateTask = (id, field, value) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t))
  }

  const onPublish = async (id) => {
    const task = tasks.find(t => t.id === id)
    addLog(`Autopress 발행 요청: "${task.title}"`, 'ai')
    setTasks(prev => prev.map(t => t.id === id ? { ...t, published: true } : t))
    await simulateApiCall('publish', 400)
    addLog(`발행 완료: taskflow.io/blog/${task.title.replace(/\s+/g, '-')}`, 'success')
  }

  const onAIConfirm = (newTasks) => {
    setTasks(prev => [...prev, ...newTasks])
  }

  const tabs = [
    { id: 'kanban', label: '칸반', icon: '⬡' },
    { id: 'sheet', label: '시트', icon: '⊞' },
    { id: 'blog',  label: 'SEO',  icon: '↑' },
    { id: 'settings', label: '설정', icon: '⚙' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top bar */}
      <header style={{
        borderBottom: `1px solid ${Z.border}`,
        padding: isMobile ? '10px 16px' : '10px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 20,
        background: Z.bg,
      }}>
        <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.5 }}>
          Task<span style={{ color: Z.emerald }}>Flow</span>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: activeTab === t.id ? Z.border : 'transparent',
                  color: activeTab === t.id ? Z.text : Z.muted,
                  fontSize: 12, fontWeight: activeTab === t.id ? 600 : 400,
                  transition: 'all .15s',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Btn variant="primary" small onClick={() => setAIModalOpen(true)}>
            ◆ AI 파서
          </Btn>
          <button
            onClick={openDrawer}
            style={{
              position: 'relative',
              background: Z.surface, border: `1px solid ${Z.border}`,
              borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
              color: Z.muted, fontSize: 11, fontWeight: 700,
            }}
          >
            SYNC LOG
            {newLogCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: Z.emerald, color: '#052e16',
                borderRadius: 10, fontSize: 9, padding: '1px 5px', fontWeight: 800,
              }}>
                {newLogCount}
              </span>
            )}
          </button>
          {!isMobile && (
            <Btn variant="ghost" small onClick={onSignOut}>로그아웃</Btn>
          )}
        </div>
      </header>

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: isMobile ? '16px 16px 80px' : '24px',
        maxWidth: 1200, width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {activeTab === 'kanban' && (
          <KanbanView
            tasks={tasks}
            isMobile={isMobile}
            onStageChange={onStageChange}
            onPublish={onPublish}
            addLog={addLog}
          />
        )}
        {activeTab === 'sheet' && (
          <SpreadsheetView
            tasks={tasks}
            onUpdateTask={onUpdateTask}
            addLog={addLog}
          />
        )}
        {activeTab === 'blog' && (
          <AutopressView tasks={tasks} addLog={addLog} />
        )}
        {activeTab === 'settings' && (
          <SettingsView user={user} />
        )}
      </main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: Z.surface, borderTop: `1px solid ${Z.border}`,
          display: 'flex', zIndex: 30,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: '10px 4px 8px',
                border: 'none', background: 'transparent', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                color: activeTab === t.id ? Z.indigo : Z.muted,
                fontSize: 18,
              }}
            >
              <span>{t.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600 }}>{t.label}</span>
            </button>
          ))}
        </nav>
      )}

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} logs={logs} />
      <AIParserModal
        open={aiModalOpen}
        onClose={() => setAIModalOpen(false)}
        onConfirm={onAIConfirm}
        addLog={addLog}
      />
    </div>
  )
}

// ─── LANDING WIDGETS ─────────────────────────────────────────────────────────
function ROICalculator() {
  const [members, setMembers] = useState(5)
  const [projects, setProjects] = useState(3)
  const monthly = members * projects * 4200
  const adsense = Math.round(projects * 2.3 * 1000)

  return (
    <div style={{
      background: Z.surface, border: `1px solid ${Z.border}`,
      borderRadius: 12, padding: 24,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 16 }}>
        ROI 예산 절감 계산기
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: Z.muted, marginBottom: 6 }}>
            팀원 수: <strong style={{ color: Z.text }}>{members}명</strong>
          </div>
          <input type="range" min={1} max={50} value={members}
            onChange={e => setMembers(+e.target.value)}
            style={{ width: '100%', accentColor: Z.emerald }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: Z.muted, marginBottom: 6 }}>
            프로젝트 수: <strong style={{ color: Z.text }}>{projects}개</strong>
          </div>
          <input type="range" min={1} max={20} value={projects}
            onChange={e => setProjects(+e.target.value)}
            style={{ width: '100%', accentColor: Z.indigo }} />
        </div>
        <div style={{
          background: Z.bg, borderRadius: 8, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: Z.muted }}>월간 도구 비용 절감</span>
            <span style={{ fontWeight: 800, color: Z.emerald, fontSize: 16 }}>
              ₩{monthly.toLocaleString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: Z.muted }}>예상 애드센스 월 수익</span>
            <span style={{ fontWeight: 800, color: Z.indigo, fontSize: 16 }}>
              ₩{adsense.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SyncShowcase() {
  const stageNames = ['기획', '디자인', '퍼블', '개발']
  const cards = [
    { id: 1, title: '기획서 작성' },
    { id: 2, title: 'UI 설계' },
    { id: 3, title: '프론트 개발' },
  ]
  const [stages, setStages] = useState([0, 1, 3])
  const [activeCell, setActiveCell] = useState(null)
  const [apiLogs, setApiLogs] = useState([])

  const clickCard = (i) => {
    const next = (stages[i] + 1) % 4
    setStages(prev => { const a = [...prev]; a[i] = next; return a })
    setActiveCell(i)
    setApiLogs(prev => [
      { id: Date.now(), msg: `PUT /v4/spreadsheets row${i + 2} C열 → "${stageNames[next]}" 200 OK` },
      ...prev.slice(0, 3),
    ])
    setTimeout(() => setActiveCell(null), 600)
  }

  return (
    <div style={{
      background: Z.surface, border: `1px solid ${Z.border}`,
      borderRadius: 12, padding: 24,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 16 }}>
        실시간 싱크 체감 위젯
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 130 }}>
          <div style={{ fontSize: 10, color: Z.muted, marginBottom: 8 }}>칸반 (클릭 → 다음 단계)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {cards.map((c, i) => (
              <div key={c.id} onClick={() => clickCard(i)} style={{
                background: Z.bg, border: `1px solid ${Z.border}`,
                borderRadius: 6, padding: '8px 10px', cursor: 'pointer', fontSize: 12,
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = Z.emerald}
                onMouseLeave={e => e.currentTarget.style.borderColor = Z.border}
              >
                <div style={{ fontWeight: 600 }}>{c.title}</div>
                <div style={{ fontSize: 10, color: Z.emerald, marginTop: 2 }}>{stageNames[stages[i]]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 130 }}>
          <div style={{ fontSize: 10, color: Z.muted, marginBottom: 8 }}>구글 시트 (즉시 반영)</div>
          <table style={{ fontSize: 11, borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ color: Z.muted, textAlign: 'left', padding: '3px 6px', fontWeight: 600 }}>제목</th>
                <th style={{ color: Z.muted, textAlign: 'left', padding: '3px 6px', fontWeight: 600 }}>단계</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c, i) => (
                <tr key={c.id} style={{
                  background: activeCell === i ? `${Z.emerald}22` : 'transparent',
                  transition: 'background .3s',
                }}>
                  <td style={{ padding: '4px 6px', borderBottom: `1px solid ${Z.border}` }}>{c.title}</td>
                  <td style={{
                    padding: '4px 6px', borderBottom: `1px solid ${Z.border}`,
                    color: activeCell === i ? Z.emerald : Z.text,
                    fontWeight: activeCell === i ? 700 : 400,
                    transition: 'color .3s',
                  }}>{stageNames[stages[i]]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {apiLogs.length > 0 && (
        <div style={{
          marginTop: 12, background: Z.bg, borderRadius: 6, padding: '8px 10px',
          fontFamily: 'monospace', fontSize: 10, color: Z.emerald,
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {apiLogs.map(l => <div key={l.id}>› {l.msg}</div>)}
        </div>
      )}
    </div>
  )
}

function AIDemo() {
  const [text, setText] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    await simulateApiCall('demo', 800)
    setResults([
      { title: '알림 시스템 리팩터링', stage: '기획', assignee: '박지호', dueDate: '2026-07-15', priority: '높음' },
      { title: '다크모드 토글 컴포넌트', stage: '디자인', assignee: '이서연', dueDate: '2026-07-20', priority: '보통' },
    ])
    setLoading(false)
  }

  return (
    <div style={{
      background: Z.surface, border: `1px solid ${Z.border}`,
      borderRadius: 12, padding: 24,
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 12 }}>
        <span style={{ color: Z.indigo }}>◆</span> AI 파서 체험
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="회의록을 붙여넣고 AI 분석을 눌러보세요…"
        rows={4}
        style={{
          width: '100%', background: Z.bg, border: `1px solid ${Z.border}`,
          borderRadius: 6, color: Z.text, fontSize: 12, padding: 10,
          resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Btn variant="ghost" small onClick={() => { setText(SAMPLE_MINUTES); setResults(null) }}>
          샘플
        </Btn>
        <Btn variant="primary" small onClick={run} disabled={loading}>
          {loading ? '분석 중…' : '◆ AI 분석'}
        </Btn>
      </div>
      {results && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map((r, i) => (
            <div key={i} style={{
              background: Z.bg, border: `1px solid ${Z.indigo}44`,
              borderRadius: 6, padding: '8px 10px', fontSize: 11,
            }}>
              <span style={{ fontWeight: 700, color: Z.indigo }}>◆</span>{' '}
              {r.title} · {r.stage} · {r.assignee} · {r.dueDate} · <PriorityBadge priority={r.priority} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ onSignIn }) {
  const [signingIn, setSigningIn] = useState(false)

  const handleSignIn = async () => {
    setSigningIn(true)
    await simulateApiCall('oauth', 900)
    onSignIn({ name: '김민준', email: 'minj@example.com' })
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 80px' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 0', borderBottom: `1px solid ${Z.border}`, marginBottom: 64,
      }}>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
          Task<span style={{ color: Z.emerald }}>Flow</span>
        </div>
        <Btn variant="emerald" onClick={handleSignIn} disabled={signingIn}>
          {signingIn ? '연결 중…' : 'G  Google로 시작'}
        </Btn>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 72 }}>
        <div style={{
          display: 'inline-block',
          background: `${Z.indigo}22`, border: `1px solid ${Z.indigo}44`,
          borderRadius: 20, padding: '4px 14px',
          fontSize: 11, color: Z.indigo, fontWeight: 700,
          marginBottom: 20, letterSpacing: 1,
        }}>
          BYOD · 서버리스 · Google Drive 네이티브
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 900, letterSpacing: -1.5,
          lineHeight: 1.1, margin: '0 0 20px',
        }}>
          팀의 모든 업무를<br />
          <span style={{ color: Z.emerald }}>구글 드라이브</span>에 저장하세요
        </h1>
        <p style={{ fontSize: 15, color: Z.muted, maxWidth: 480, margin: '0 auto 32px' }}>
          중앙 서버 없이 유저 개인 드라이브에 데이터를 저장합니다.
          칸반보드와 스프레드시트가 실시간으로 양방향 동기화됩니다.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn variant="emerald" onClick={handleSignIn} disabled={signingIn}
            style={{ fontSize: 14, padding: '10px 24px' }}>
            {signingIn ? '연결 중…' : '무료로 시작하기 →'}
          </Btn>
          <Btn variant="ghost" style={{ fontSize: 14 }}>데모 영상 보기</Btn>
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: Z.muted }}>
          🔒 scope: drive.file — 앱이 생성한 파일에만 접근합니다
        </div>
      </div>

      {/* Feature widgets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16, marginBottom: 60,
      }}>
        <ROICalculator />
        <SyncShowcase />
        <AIDemo />
      </div>

      {/* Feature pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
      }}>
        {[
          { icon: '⬡', title: '칸반 + 스프레드시트', desc: '양방향 실시간 동기화' },
          { icon: '◆', title: 'AI 회의록 파서', desc: 'Gemini 2.5 Flash 연동' },
          { icon: '↑', title: 'Autopress SEO', desc: '개발 회고록 자동 발행' },
          { icon: '🔒', title: '완전한 프라이버시', desc: 'drive.file 스코프 제한' },
        ].map(f => (
          <div key={f.title} style={{
            background: Z.surface, border: `1px solid ${Z.border}`,
            borderRadius: 10, padding: '18px 20px',
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: Z.muted }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [scene, setScene] = useState('landing')
  const [user, setUser] = useState(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const handleSignIn = async (userData) => {
    setUser(userData)
    setTransitioning(true)
    await simulateApiCall('transition', 300)
    setScene('workspace')
    setTransitioning(false)
  }

  const handleSignOut = () => {
    setScene('landing')
    setUser(null)
  }

  return (
    <div style={{
      ...css.root,
      opacity: transitioning ? 0 : 1,
      transition: 'opacity .3s',
    }}>
      {scene === 'landing' && <Landing onSignIn={handleSignIn} />}
      {scene === 'workspace' && (
        <Workspace user={user} onSignOut={handleSignOut} isMobile={isMobile} />
      )}
    </div>
  )
}
