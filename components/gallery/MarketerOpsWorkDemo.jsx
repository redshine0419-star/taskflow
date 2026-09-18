'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const T = {
  bg: '#ffffff', surface: '#f6f8fa', border: '#eaeef2', text: '#24292f', muted: '#57606a',
  indigo: '#6366f1', emerald: '#10b981', amber: '#f59e0b', rose: '#ef4444', purple: '#8b5cf6', dark: '#0d1117',
}
const STORAGE_KEY = 'tf_marketerops_work_demo_v1'

const STAGES = [
  { id: '기획', label: '기획', color: T.purple },
  { id: '디자인', label: '디자인', color: '#0969da' },
  { id: '퍼블', label: '퍼블', color: '#f97316' },
  { id: '개발', label: '개발', color: '#14b8a6' },
  { id: '완료', label: '완료', color: T.emerald },
]
const PRIORITIES = ['낮음', '보통', '높음', '긴급']
const PRIORITY_COLOR = { 낮음: T.muted, 보통: '#eab308', 높음: '#f97316', 긴급: T.rose }

function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
function todayStr() { return new Date().toISOString().slice(0, 10) }
function uid() { return Math.random().toString(36).slice(2, 10) }

function seedProjects() {
  return [
    { id: 'p1', name: '2026 봄 캠페인', color: '#6366f1', isOngoing: false, startDate: addDays(-10), dueDate: addDays(20) },
    { id: 'p2', name: '블로그 운영', color: '#14b8a6', isOngoing: true, startDate: null, dueDate: null },
  ]
}
function seedMembers() {
  return [
    { id: 'me', name: '나', email: 'me@demo.local', role: 'owner', jobTitle: 'PM' },
    { id: 'u2', name: '김디자인', email: 'design@demo.local', role: 'member', jobTitle: '디자이너' },
    { id: 'u3', name: '박콘텐츠', email: 'content@demo.local', role: 'member', jobTitle: '콘텐츠 마케터' },
  ]
}
function seedTasks() {
  return [
    { id: uid(), projectId: 'p1', title: '캠페인 랜딩페이지 기획안 작성', status: '기획', priority: '높음', dueDate: addDays(2), assigneeId: 'me', isKeyTask: true },
    { id: uid(), projectId: 'p1', title: '메인 비주얼 시안 3종', status: '디자인', priority: '보통', dueDate: addDays(5), assigneeId: 'u2', isKeyTask: false },
    { id: uid(), projectId: 'p1', title: '랜딩 퍼블리싱', status: '퍼블', priority: '보통', dueDate: addDays(9), assigneeId: 'u2', isKeyTask: false },
    { id: uid(), projectId: 'p1', title: '전환 트래킹 스크립트 삽입', status: '개발', priority: '긴급', dueDate: addDays(-1), assigneeId: 'me', isKeyTask: true },
    { id: uid(), projectId: 'p1', title: '캠페인 카피 초안', status: '완료', priority: '낮음', dueDate: addDays(-3), assigneeId: 'u3', isKeyTask: false },
    { id: uid(), projectId: 'p2', title: 'GEO 최적화 가이드 발행', status: '기획', priority: '보통', dueDate: addDays(1), assigneeId: 'u3', isKeyTask: false },
    { id: uid(), projectId: 'p2', title: '이번 주 SNS 카드뉴스', status: '디자인', priority: '높음', dueDate: todayStr(), assigneeId: 'u2', isKeyTask: false },
    { id: uid(), projectId: 'p2', title: '뉴스레터 발송', status: '완료', priority: '보통', dueDate: addDays(-5), assigneeId: 'me', isKeyTask: false },
  ]
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultState(), ...JSON.parse(raw) }
  } catch { /* corrupt or unavailable storage */ }
  return defaultState()
}
function defaultState() {
  return {
    tab: 'kanban', projects: seedProjects(), members: seedMembers(), tasks: seedTasks(),
    activeProject: 'p1', modalTask: null, myFilter: 'all', aiPmResult: null,
    inviteEmail: '',
  }
}

function Card({ children, style }) { return <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div> }
function Banner() {
  return (
    <div style={{ background: '#fff8ec', border: '1px solid #f5deb3', borderRadius: 12, padding: '10px 14px', fontSize: 12.5, color: '#7a5b1f', marginBottom: 16 }}>
      🧪 데모 모드 — 로그인 없이 샘플 팀원·프로젝트로 동작해요. 모든 변경사항은 이 브라우저에만 저장돼요.
    </div>
  )
}

function TaskCard({ task, members, onClick }) {
  const assignee = members.find((m) => m.id === task.assigneeId)
  return (
    <div draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)} onClick={onClick} style={{
      background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: 10, marginBottom: 8, cursor: 'grab',
    }}>
      {task.isKeyTask && <span style={{ fontSize: 11 }}>⭐ </span>}
      <span style={{ fontSize: 12.5, fontWeight: 700 }}>{task.title}</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: PRIORITY_COLOR[task.priority] }}>{task.priority}</span>
        <span style={{ fontSize: 10.5, color: task.dueDate < todayStr() ? T.rose : T.muted }}>{task.dueDate?.slice(5)}</span>
      </div>
      {assignee && <div style={{ fontSize: 10.5, color: T.muted, marginTop: 2 }}>👤 {assignee.name}</div>}
    </div>
  )
}

function TaskModal({ task, members, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(task)
  const isNew = !task.id
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ background: T.bg, borderRadius: 16, padding: 20, width: '100%', maxWidth: 440 }}>
        <div style={{ fontWeight: 800, marginBottom: 12 }}>{isNew ? '업무 추가' : '업무 편집'}</div>
        <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="제목" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 8 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })} style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <input type="date" value={draft.dueDate || ''} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <select value={draft.assigneeId || ''} onChange={(e) => setDraft({ ...draft, assigneeId: e.target.value })} style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }}>
            <option value="">배정 안 함</option>
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, marginBottom: 16 }}>
          <input type="checkbox" checked={draft.isKeyTask} onChange={(e) => setDraft({ ...draft, isKeyTask: e.target.checked })} /> 주요 업무로 표시
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {!isNew ? <button onClick={() => onDelete(draft.id)} style={{ border: 'none', background: 'none', color: T.rose, cursor: 'pointer', fontSize: 12.5 }}>삭제</button> : <span />}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, cursor: 'pointer' }}>취소</button>
            <button onClick={() => onSave(draft)} disabled={!draft.title.trim()} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: T.text, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function KanbanTab({ state, update }) {
  const tasks = state.tasks.filter((t) => t.projectId === state.activeProject)
  const setTask = (draft) => {
    const exists = state.tasks.some((t) => t.id === draft.id)
    const tasks = exists ? state.tasks.map((t) => t.id === draft.id ? draft : t) : [...state.tasks, { ...draft, id: uid() }]
    update({ ...state, tasks, modalTask: null })
  }
  const delTask = (id) => update({ ...state, tasks: state.tasks.filter((t) => t.id !== id), modalTask: null })
  const onDrop = (stageId) => (e) => {
    const id = e.dataTransfer.getData('text/plain')
    update({ ...state, tasks: state.tasks.map((t) => t.id === id ? { ...t, status: stageId } : t) })
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <select value={state.activeProject} onChange={(e) => update({ ...state, activeProject: e.target.value })} style={{ padding: 8, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {state.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button onClick={() => update({ ...state, modalTask: { title: '', status: '기획', priority: '보통', dueDate: todayStr(), assigneeId: '', isKeyTask: false, projectId: state.activeProject } })} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: T.text, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12.5 }}>+ 업무 추가</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: 10 }}>
        {STAGES.map((s) => (
          <div key={s.id} onDragOver={(e) => e.preventDefault()} onDrop={onDrop(s.id)} style={{ background: T.surface, borderRadius: 12, padding: 8, minHeight: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 12, fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />{s.label}
              <span style={{ color: T.muted, fontWeight: 400 }}>{tasks.filter((t) => t.status === s.id).length}</span>
            </div>
            {tasks.filter((t) => t.status === s.id).map((t) => <TaskCard key={t.id} task={t} members={state.members} onClick={() => update({ ...state, modalTask: t })} />)}
          </div>
        ))}
      </div>
      {state.modalTask && <TaskModal task={state.modalTask} members={state.members} onSave={setTask} onDelete={delTask} onClose={() => update({ ...state, modalTask: null })} />}
    </div>
  )
}

function ProjectsTab({ state, update }) {
  const [form, setForm] = useState(null)
  const addProject = () => {
    if (!form?.name?.trim()) return
    update({ ...state, projects: [...state.projects, { id: uid(), name: form.name, color: form.color || '#6366f1', isOngoing: !!form.isOngoing, startDate: form.isOngoing ? null : todayStr(), dueDate: form.isOngoing ? null : addDays(30) }] })
    setForm(null)
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={() => setForm({ name: '', color: '#6366f1', isOngoing: false })} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: T.text, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12.5 }}>+ 새 프로젝트</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {state.projects.map((p) => {
          const count = state.tasks.filter((t) => t.projectId === p.id).length
          return (
            <Card key={p.id} style={{ padding: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${p.color}22`, color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: 8 }}>📁</div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 6 }}>{p.isOngoing ? '상시' : `${p.startDate} ~ ${p.dueDate}`}</div>
              <div style={{ fontSize: 11.5, color: T.muted }}>{count}개 태스크 · {state.members.length}명</div>
            </Card>
          )
        })}
      </div>
      {form && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: T.bg, borderRadius: 16, padding: 20, width: 360 }}>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>새 프로젝트</div>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="예: 마케팅 Q2 캠페인" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 10 }} />
            <label style={{ display: 'flex', gap: 6, fontSize: 12.5, marginBottom: 14 }}><input type="checkbox" checked={form.isOngoing} onChange={(e) => setForm({ ...form, isOngoing: e.target.checked })} /> 상시 운영 (기간 없음)</label>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setForm(null)} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, cursor: 'pointer' }}>취소</button>
              <button onClick={addProject} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: T.text, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>만들기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MyTasksTab({ state, update }) {
  const mine = state.tasks.filter((t) => t.assigneeId === 'me')
  const toggleDone = (t) => update({ ...state, tasks: state.tasks.map((x) => x.id === t.id ? { ...x, status: x.status === '완료' ? '기획' : '완료' } : x) })
  const buckets = { 기한초과: [], 오늘마감: [], 이번주: [], 이후: [], 날짜없음: [] }
  const today = todayStr()
  const weekEnd = addDays(7)
  mine.forEach((t) => {
    const done = t.status === '완료'
    if (!t.dueDate) buckets.날짜없음.push(t)
    else if (t.dueDate < today && !done) buckets.기한초과.push(t)
    else if (t.dueDate === today) buckets.오늘마감.push(t)
    else if (t.dueDate <= weekEnd) buckets.이번주.push(t)
    else buckets.이후.push(t)
  })
  return (
    <div>
      {Object.entries(buckets).filter(([, list]) => list.length > 0).map(([label, list]) => (
        <Card key={label} style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: label === '기한초과' ? T.rose : label === '오늘마감' ? T.amber : T.text }}>{label} ({list.length})</div>
          {list.map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${T.border}` }}>
              <span onClick={() => toggleDone(t)} style={{ cursor: 'pointer' }}>{t.status === '완료' ? '✅' : '⬜'}</span>
              <span style={{ flex: 1, fontSize: 13, textDecoration: t.status === '완료' ? 'line-through' : 'none', color: t.status === '완료' ? T.muted : T.text }}>{t.isKeyTask && '⭐ '}{t.title}</span>
              <span style={{ fontSize: 11, color: PRIORITY_COLOR[t.priority] }}>{t.priority}</span>
              <span style={{ fontSize: 11, color: T.muted }}>{t.dueDate}</span>
            </div>
          ))}
        </Card>
      ))}
      {mine.length === 0 && <Card><div style={{ textAlign: 'center', color: T.muted, padding: 20 }}>배정된 태스크가 없어요</div></Card>}
    </div>
  )
}

function TeamTab({ state, update }) {
  const [loading, setLoading] = useState(false)
  const [inviteMsg, setInviteMsg] = useState('')
  const invite = () => {
    if (!state.inviteEmail.trim()) return
    const name = state.inviteEmail.split('@')[0]
    update({ ...state, members: [...state.members, { id: uid(), name, email: state.inviteEmail, role: 'member', jobTitle: '' }], inviteEmail: '' })
    setInviteMsg(`${name} 님이 추가됐습니다.`)
    setTimeout(() => setInviteMsg(''), 3000)
  }
  const runAiPm = () => {
    setLoading(true)
    setTimeout(() => {
      update({
        ...state, aiPmResult: {
          teamSummary: '이번 주 팀 전체 진행률은 양호해요. 다만 개발 단계 태스크가 한 명에게 몰려있어 병목이 우려돼요.',
          members: state.members.map((m, i) => ({ name: m.name, status: ['적정', '과부하', '여유'][i % 3], insight: ['업무 배분이 적절해요.', '이번 주 태스크가 많아 과부하 상태예요.', '여유가 있어 추가 업무 배정이 가능해요.'][i % 3] })),
          recommendations: ['개발 단계 태스크를 다른 팀원에게 일부 재분배하세요.', '주요 업무(⭐) 마감일을 팀 전체와 공유하세요.'],
        }
      })
      setLoading(false)
    }, 900)
  }
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>👥 팀 관리</div>
          <button onClick={runAiPm} disabled={loading} style={{ padding: '9px 16px', borderRadius: 10, border: 'none', background: T.purple, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12.5 }}>{loading ? '분석 중...' : '🤖 AI PM 분석 실행'}</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
          <input value={state.inviteEmail} onChange={(e) => update({ ...state, inviteEmail: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && invite()} placeholder="이메일 입력 (샘플 — 아무 이메일이나 가능)" style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <button onClick={invite} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>추가</button>
        </div>
        {inviteMsg && <div style={{ fontSize: 12, color: T.emerald }}>{inviteMsg}</div>}
      </Card>
      <Card style={{ marginBottom: 16 }}>
        {state.members.map((m) => (
          <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</span>
              <span style={{ fontSize: 11.5, color: T.muted, marginLeft: 8 }}>{m.email}</span>
              {m.jobTitle && <span style={{ fontSize: 11, background: `${T.purple}18`, color: T.purple, padding: '2px 8px', borderRadius: 999, marginLeft: 6 }}>{m.jobTitle}</span>}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: m.role === 'owner' ? T.amber : T.muted }}>{m.role === 'owner' ? '👑 소유자' : '멤버'}</span>
          </div>
        ))}
      </Card>
      {state.aiPmResult && (
        <Card style={{ background: T.dark, color: '#fff' }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>🤖 AI PM 주간 리포트 (샘플)</div>
          <div style={{ fontSize: 13, marginBottom: 10 }}>{state.aiPmResult.teamSummary}</div>
          {state.aiPmResult.members.map((m, i) => (
            <div key={i} style={{ fontSize: 12.5, padding: '4px 0' }}>
              <b>{m.name}</b> — <span style={{ color: m.status === '과부하' ? '#f87171' : m.status === '여유' ? '#4ade80' : '#fbbf24' }}>{m.status}</span>: {m.insight}
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 12.5 }}>
            {state.aiPmResult.recommendations.map((r, i) => <div key={i}>💡 {r}</div>)}
          </div>
        </Card>
      )}
    </div>
  )
}

export default function MarketerOpsWorkDemo() {
  const [state, setState] = useState(null)
  useEffect(() => { setState(loadState()) }, [])
  useEffect(() => {
    if (!state) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* private mode */ }
  }, [state])
  if (!state) return null

  const update = (v) => setState(typeof v === 'function' ? v(state) : v)
  const TABS = [
    { key: 'kanban', label: '🗂️ 칸반 보드' },
    { key: 'projects', label: '📁 프로젝트' },
    { key: 'mytasks', label: '✅ 내 할일' },
    { key: 'team', label: '👥 팀 관리' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: T.surface, color: T.text, fontFamily: "'Noto Sans KR', -apple-system, sans-serif" }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: T.bg, borderBottom: `1px solid ${T.border}`, padding: '14px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>MarketerOps 업무관리</div>
            <div style={{ fontSize: 12, color: T.muted }}>칸반 보드 · 프로젝트 · 내 할일 · 팀 관리</div>
          </div>
          <Link href="/portfolio" style={{ fontSize: 12.5, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
        </div>
      </div>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
        <Banner />
        <div style={{ display: 'flex', gap: 4, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 4, marginBottom: 16, width: 'fit-content' }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => update({ ...state, tab: t.key })} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              background: state.tab === t.key ? T.text : 'transparent', color: state.tab === t.key ? '#fff' : T.muted,
            }}>{t.label}</button>
          ))}
        </div>
        {state.tab === 'kanban' && <KanbanTab state={state} update={update} />}
        {state.tab === 'projects' && <ProjectsTab state={state} update={update} />}
        {state.tab === 'mytasks' && <MyTasksTab state={state} update={update} />}
        {state.tab === 'team' && <TeamTab state={state} update={update} />}
      </div>
    </div>
  )
}
