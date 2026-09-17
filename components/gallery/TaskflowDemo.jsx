'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import * as XLSX from 'xlsx'

const DARK = { bg: '#09090b', surface: '#18181b', border: '#27272a', text: '#f4f4f5', muted: '#71717a', emerald: '#10b981', indigo: '#6366f1', red: '#ef4444', amber: '#f59e0b' }
const LIGHT = { bg: '#f8fafc', surface: '#ffffff', border: '#e2e8f0', text: '#0f172a', muted: '#64748b', emerald: '#059669', indigo: '#4f46e5', red: '#dc2626', amber: '#d97706' }

const STAGE_KEYS = ['planning', 'design', 'publishing', 'dev']
const STAGE_DEFAULT_LABEL = { planning: '기획', design: '디자인', publishing: '퍼블', dev: '개발' }
const STAGE_COLORS = { planning: '#818cf8', design: '#34d399', publishing: '#fbbf24', dev: '#f87171' }
const PRIORITY_LABEL = { high: '높음', medium: '보통', low: '낮음' }
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }
const PROJECT_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9']
const STORAGE_KEY = 'tf_portfolio_demo_v1'

function seedState() {
  const soon = new Date()
  soon.setDate(soon.getDate() + 2)
  const soonStr = soon.toISOString().slice(0, 10)

  const start = new Date()
  start.setDate(start.getDate() - 10)
  const startStr = start.toISOString().slice(0, 10)

  const due = new Date()
  due.setDate(due.getDate() + 20)
  const dueStr = due.toISOString().slice(0, 10)

  return {
    darkMode: true,
    stageLabels: {},
    projects: [
      { id: 'p1', name: '웹사이트 리뉴얼', description: '회사 홈페이지 전면 개편', color: '#10b981', createdAt: Date.now(), startDate: startStr, dueDate: soonStr },
      { id: 'p2', name: '모바일 앱 출시', description: 'iOS/Android 1차 출시', color: '#6366f1', createdAt: Date.now(), startDate: '', dueDate: dueStr },
      { id: 'p3', name: '마케팅 캠페인', description: '3분기 신규 유입 캠페인', color: '#f59e0b', createdAt: Date.now(), startDate: '', dueDate: '' },
    ],
    members: [
      { id: 'm1', name: '김민지', role: 'PM' },
      { id: 'm2', name: '박서준', role: 'Designer' },
      { id: 'm3', name: '이하늘', role: 'Developer' },
    ],
    tasks: [
      { id: 1, projectId: 'p1', title: '경쟁사 벤치마킹', assignee: '김민지', priority: 'medium', stage: 'planning', dueDate: '', isKeyTask: false },
      { id: 2, projectId: 'p1', title: '메인 페이지 와이어프레임', assignee: '박서준', priority: 'high', stage: 'design', dueDate: soonStr, isKeyTask: true },
      { id: 3, projectId: 'p1', title: '반응형 퍼블리싱', assignee: '이하늘', priority: 'medium', stage: 'publishing', dueDate: '', isKeyTask: false },
      { id: 4, projectId: 'p2', title: '온보딩 플로우 설계', assignee: '김민지', priority: 'high', stage: 'planning', dueDate: soonStr, isKeyTask: true },
      { id: 5, projectId: 'p2', title: '푸시 알림 연동', assignee: '이하늘', priority: 'medium', stage: 'dev', dueDate: '', isKeyTask: false },
      { id: 6, projectId: 'p3', title: 'SNS 콘텐츠 캘린더', assignee: '박서준', priority: 'low', stage: 'planning', dueDate: '', isKeyTask: false },
    ],
    nextTaskId: 7,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...seedState(), ...JSON.parse(raw) }
  } catch { /* corrupt or unavailable storage, fall back to seed */ }
  return seedState()
}

function Btn({ children, onClick, variant = 'default', small, style, disabled, title }) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        border: variant === 'danger' ? undefined : 'none', borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600, opacity: disabled ? 0.5 : 1,
        fontSize: small ? 12 : 13, padding: small ? '4px 10px' : '7px 14px',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function Badge({ children, color }) {
  return (
    <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, border: `1px solid ${color}55`, color, background: `${color}18` }}>
      {children}
    </span>
  )
}

export default function TaskflowDemo() {
  const [state, setState] = useState(null)
  const [activeTab, setActiveTab] = useState('projects')
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [addTaskStage, setAddTaskStage] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [keyTasksOnly, setKeyTasksOnly] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRole, setNewMemberRole] = useState('')

  useEffect(() => { setState(loadState()) }, [])

  useEffect(() => {
    if (!state) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* private-mode storage may reject writes */ }
  }, [state])

  if (!state) return null

  const T = state.darkMode ? DARK : LIGHT
  const stageLabel = (key) => state.stageLabels[key] || STAGE_DEFAULT_LABEL[key]
  const selectedProject = state.projects.find((p) => p.id === selectedProjectId)
  const visibleTasks = selectedProjectId ? state.tasks.filter((t) => t.projectId === selectedProjectId) : state.tasks
  const me = state.members[0]?.name

  const update = (fn) => setState((prev) => fn({ ...prev }))

  const createProject = (form) => {
    update((s) => ({ ...s, projects: [...s.projects, { id: `p${Date.now()}`, createdAt: Date.now(), ...form }] }))
  }
  const deleteProject = (id) => {
    update((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id), tasks: s.tasks.filter((t) => t.projectId !== id) }))
    if (selectedProjectId === id) setSelectedProjectId(null)
  }
  const addTask = (form) => {
    update((s) => ({
      ...s,
      tasks: [...s.tasks, { id: s.nextTaskId, projectId: selectedProjectId || s.projects[0]?.id || '', ...form }],
      nextTaskId: s.nextTaskId + 1,
    }))
  }
  const moveTask = (id, stage) => update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, stage } : t)) }))
  const deleteTask = (id) => update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }))
  const toggleKeyTask = (id) => update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, isKeyTask: !t.isKeyTask } : t)) }))
  const updateTaskField = (id, field, value) => update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, [field]: value } : t)) }))
  const importTasks = (rows) => {
    update((s) => {
      let nextId = s.nextTaskId
      const projectId = selectedProjectId || s.projects[0]?.id || ''
      const added = rows.map((r) => ({ id: nextId++, projectId, ...r }))
      return { ...s, tasks: [...s.tasks, ...added], nextTaskId: nextId }
    })
  }
  const addMember = () => {
    if (!newMemberName.trim()) return
    update((s) => ({ ...s, members: [...s.members, { id: `m${Date.now()}`, name: newMemberName.trim(), role: newMemberRole.trim() || '팀원' }] }))
    setNewMemberName('')
    setNewMemberRole('')
  }
  const deleteMember = (id) => update((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) }))
  const resetDemo = () => {
    if (!confirm('데모 데이터를 초기 상태로 되돌릴까요?')) return
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    setState(seedState())
    setSelectedProjectId(null)
    setActiveTab('projects')
  }

  const tabs = [
    { id: 'projects', label: 'Projects', icon: '◈' },
    { id: 'kanban', label: 'Kanban', icon: '⬡' },
    { id: 'mytasks', label: 'My Tasks', icon: '✓' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'aipm', label: 'AI PM', icon: '✨' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text }}>
      <div style={{ background: `${T.amber}18`, borderBottom: `1px solid ${T.amber}44`, padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 12, flexWrap: 'wrap' }}>
        <span style={{ color: T.amber }}>🧪 데모 모드 — 로그인·구글 시트 연동 없이 이 브라우저에만 데이터가 저장돼요.</span>
        <button onClick={resetDemo} style={{ background: 'none', border: `1px solid ${T.amber}`, color: T.amber, borderRadius: 5, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>
          데모 초기화
        </button>
      </div>

      <header style={{ borderBottom: `1px solid ${T.border}`, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, background: T.bg, zIndex: 10, flexWrap: 'wrap' }}>
        <Link href="/portfolio" style={{ fontWeight: 800, fontSize: 15, textDecoration: 'none', color: T.text }}>
          Task<span style={{ color: T.emerald }}>Grid</span>
        </Link>
        {activeTab === 'kanban' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ color: T.muted }}>›</span>
            {selectedProject && <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedProject.color }} />}
            <span style={{ color: T.muted, cursor: selectedProjectId ? 'pointer' : 'default' }} onClick={() => selectedProjectId && setSelectedProjectId(null)}>
              {selectedProject ? selectedProject.name : '전체 프로젝트'}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? T.border : 'transparent',
                color: activeTab === tab.id ? T.text : T.muted,
                fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.emerald }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.emerald, display: 'inline-block' }} />
            로컬 저장됨
          </div>
          <button
            onClick={() => update((s) => ({ ...s, darkMode: !s.darkMode }))}
            title="테마 전환"
            style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 14, color: T.muted }}
          >
            {state.darkMode ? '☀️' : '🌙'}
          </button>
          <Link href="/guides/taskflow" style={{ fontSize: 12, fontWeight: 600, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: '5px 10px', textDecoration: 'none' }}>
            가이드
          </Link>
          <Link href="/portfolio" style={{ fontSize: 12, fontWeight: 600, color: T.muted, textDecoration: 'none' }}>
            갤러리로
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {activeTab === 'projects' && (
          <ProjectsTab
            T={T}
            projects={state.projects}
            tasks={state.tasks}
            onSelect={(id) => { setSelectedProjectId(id); setActiveTab('kanban') }}
            onDelete={deleteProject}
            onOpenNew={() => setProjectModalOpen(true)}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanTab
            T={T}
            tasks={visibleTasks}
            members={state.members}
            stageLabel={stageLabel}
            filterAssignee={filterAssignee}
            setFilterAssignee={setFilterAssignee}
            keyTasksOnly={keyTasksOnly}
            setKeyTasksOnly={setKeyTasksOnly}
            dragOverStage={dragOverStage}
            setDragOverStage={setDragOverStage}
            onMoveTask={moveTask}
            onDeleteTask={deleteTask}
            onToggleKeyTask={toggleKeyTask}
            onUpdateTask={updateTaskField}
            onImportTasks={importTasks}
            addTaskStage={addTaskStage}
            setAddTaskStage={setAddTaskStage}
            onAddTask={addTask}
          />
        )}

        {activeTab === 'mytasks' && (
          <MyTasksTab T={T} tasks={state.tasks} projects={state.projects} stageLabel={stageLabel} me={me} />
        )}

        {activeTab === 'aipm' && (
          <AiPmTab T={T} members={state.members} tasks={visibleTasks} />
        )}

        {activeTab === 'team' && (
          <TeamTab
            T={T}
            members={state.members}
            newMemberName={newMemberName}
            setNewMemberName={setNewMemberName}
            newMemberRole={newMemberRole}
            setNewMemberRole={setNewMemberRole}
            onAdd={addMember}
            onDelete={deleteMember}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            T={T}
            stageLabels={state.stageLabels}
            onChange={(key, value) => update((s) => ({ ...s, stageLabels: { ...s.stageLabels, [key]: value } }))}
            onReset={resetDemo}
          />
        )}
      </main>

      {projectModalOpen && (
        <ProjectModal T={T} onClose={() => setProjectModalOpen(false)} onSave={(form) => { createProject(form); setProjectModalOpen(false) }} />
      )}
    </div>
  )
}

function ProjectsTab({ T, projects, tasks, onSelect, onDelete, onOpenNew }) {
  const [viewMode, setViewMode] = useState('card')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Projects</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden' }}>
            {[{ id: 'card', label: 'Card' }, { id: 'gantt', label: 'Gantt' }].map((m) => (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                style={{ padding: '4px 12px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: viewMode === m.id ? T.border : 'transparent', color: viewMode === m.id ? T.text : T.muted }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Btn variant="primary" style={{ background: T.indigo, color: '#fff' }} onClick={onOpenNew}>+ New Project</Btn>
        </div>
      </div>

      {viewMode === 'gantt' && <ProjectGanttMini T={T} projects={projects} tasks={tasks} onSelect={onSelect} />}

      {viewMode === 'card' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 12 }}>
          {projects.map((project) => {
            const count = tasks.filter((t) => t.projectId === project.id).length
            return (
              <div key={project.id} onClick={() => onSelect(project.id)} style={{ display: 'flex', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ width: 5, background: project.color, flexShrink: 0 }} />
                <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name}</div>
                  {project.description && <div style={{ fontSize: 12, color: T.muted, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.description}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: T.muted }}>작업 {count}개</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (confirm(`"${project.name}" 프로젝트를 삭제할까요?`)) onDelete(project.id) }}
                      style={{ fontSize: 11, color: T.red, background: 'transparent', border: `1px solid ${T.red}55`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {projects.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: T.muted, fontSize: 13 }}>+ New Project로 첫 프로젝트를 만들어보세요</div>
          )}
        </div>
      )}
    </div>
  )
}

function ProjectGanttMini({ T, projects, tasks, onSelect }) {
  const DAY_W = 14
  const LEFT_COL = 160
  const ROW_H = 36

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const allDates = [today]
  projects.forEach((p) => {
    if (p.startDate) allDates.push(new Date(p.startDate))
    if (p.dueDate) allDates.push(new Date(p.dueDate))
  })
  const rangeStart = new Date(Math.min(...allDates.map((d) => d.getTime())))
  rangeStart.setDate(rangeStart.getDate() - 3)
  rangeStart.setHours(0, 0, 0, 0)

  const totalDays = 90
  const timelineWidth = totalDays * DAY_W

  const dateToX = (dateStr) => {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    return ((d.getTime() - rangeStart.getTime()) / 86400000) * DAY_W
  }
  const todayX = dateToX(today)

  if (projects.length === 0) {
    return <div style={{ textAlign: 'center', padding: 60, color: T.muted, fontSize: 13 }}>+ New Project로 첫 프로젝트를 만들어보세요</div>
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ width: LEFT_COL, flexShrink: 0, borderRight: `1px solid ${T.border}`, background: T.surface }}>
          <div style={{ height: 24, borderBottom: `1px solid ${T.border}`, background: T.bg }} />
          {projects.map((project) => {
            const count = tasks.filter((t) => t.projectId === project.id).length
            return (
              <div key={project.id} onClick={() => onSelect(project.id)} style={{ height: ROW_H, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', borderBottom: `1px solid ${T.border}`, cursor: 'pointer' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: project.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name}</span>
                <span style={{ fontSize: 10, color: T.muted, flexShrink: 0 }}>{count}</span>
              </div>
            )
          })}
        </div>
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <div style={{ minWidth: timelineWidth, position: 'relative' }}>
            <div style={{ height: 24, borderBottom: `1px solid ${T.border}`, background: T.bg }} />
            {todayX >= 0 && todayX <= timelineWidth && (
              <div style={{ position: 'absolute', top: 24, bottom: 0, left: todayX, borderLeft: `1.5px dashed ${T.red}`, zIndex: 3 }} />
            )}
            {projects.map((project) => {
              const count = tasks.filter((t) => t.projectId === project.id).length
              let startX, endX
              if (project.startDate && project.dueDate) {
                startX = dateToX(project.startDate)
                endX = dateToX(project.dueDate) + DAY_W
              } else if (project.dueDate) {
                endX = dateToX(project.dueDate) + DAY_W
                startX = endX - 20 * DAY_W
              } else {
                startX = dateToX(new Date(project.createdAt || rangeStart).toISOString().slice(0, 10))
                endX = startX + 20 * DAY_W
              }
              const barLeft = Math.max(0, startX)
              const barWidth = Math.max(endX - barLeft, 20)
              return (
                <div key={project.id} style={{ height: ROW_H, borderBottom: `1px solid ${T.border}`, position: 'relative' }}>
                  <div
                    onClick={() => onSelect(project.id)}
                    style={{ position: 'absolute', top: 7, height: ROW_H - 14, left: barLeft, width: barWidth, background: `${project.color}bb`, border: `1px solid ${project.color}`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', paddingLeft: 6, overflow: 'hidden' }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name} · {count}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ T, onClose, onSave }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(PROJECT_COLORS[0])
  const [startDate, setStartDate] = useState('')
  const [dueDate, setDueDate] = useState('')

  const inputStyle = { width: '100%', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 59 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, width: '100%', maxWidth: 420, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>New Project</div>
          <div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>이름</div>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="예: 웹사이트 리뉴얼" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>설명</div>
            <input value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} placeholder="한 줄 설명 (선택)" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>색상</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: color === c ? `2px solid ${T.text}` : '2px solid transparent', cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>시작일 (Gantt, 선택)</div>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>마감일 (Gantt, 선택)</div>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn onClick={onClose} style={{ background: T.border, color: T.text }}>취소</Btn>
            <Btn
              onClick={() => name.trim() && onSave({ name: name.trim(), description: description.trim(), color, startDate, dueDate })}
              style={{ background: T.indigo, color: '#fff' }}
            >
              만들기
            </Btn>
          </div>
        </div>
      </div>
    </>
  )
}

function KanbanTab({ T, tasks, members, stageLabel, filterAssignee, setFilterAssignee, keyTasksOnly, setKeyTasksOnly, dragOverStage, setDragOverStage, onMoveTask, onDeleteTask, onToggleKeyTask, onUpdateTask, onImportTasks, addTaskStage, setAddTaskStage, onAddTask }) {
  const [viewMode, setViewMode] = useState('kanban')
  const [sortBy, setSortBy] = useState('default')
  const [importOpen, setImportOpen] = useState(false)

  let filtered = tasks
  if (filterAssignee !== 'all') filtered = filtered.filter((t) => t.assignee === filterAssignee)
  if (keyTasksOnly) filtered = filtered.filter((t) => t.isKeyTask)
  if (sortBy === 'dueDate') filtered = [...filtered].sort((a, b) => (a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1)
  else if (sortBy === 'priority') filtered = [...filtered].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9))

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false
    const diff = (new Date(dueDate) - new Date(new Date().toDateString())) / 86400000
    return diff >= 0 && diff <= 3
  }

  const selectStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 12, padding: '4px 8px', outline: 'none', cursor: 'pointer' }

  const exportExcel = () => {
    const rows = tasks.map((t) => ({
      Title: t.title,
      Stage: stageLabel(t.stage),
      Priority: PRIORITY_LABEL[t.priority] || t.priority,
      Assignee: t.assignee || '',
      'Due Date': t.dueDate || '',
      'Key Task': t.isKeyTask ? 'Yes' : 'No',
    }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows.length ? rows : [{}]), 'Tasks')
    XLSX.writeFile(wb, `TaskGrid_Demo_Export_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden' }}>
          {[{ id: 'kanban', label: '⬡ Kanban' }, { id: 'gantt', label: '▬ Gantt' }, { id: 'table', label: '⊞ Table' }].map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id)}
              style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: viewMode === m.id ? T.border : 'transparent', color: viewMode === m.id ? T.text : T.muted }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn onClick={() => setImportOpen(true)} style={{ background: T.border, color: T.text }} small>📂 가져오기</Btn>
          <Btn onClick={exportExcel} style={{ background: T.border, color: T.text }} small>📥 내보내기</Btn>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>담당자:</span>
        <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} style={selectStyle}>
          <option value="all">전체</option>
          {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
        </select>
        <span style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>정렬:</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="default">기본</option>
          <option value="dueDate">마감일순</option>
          <option value="priority">우선순위순</option>
        </select>
        <button
          onClick={() => setKeyTasksOnly((v) => !v)}
          style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${keyTasksOnly ? T.amber : T.border}`, background: keyTasksOnly ? `${T.amber}22` : 'transparent', color: keyTasksOnly ? T.amber : T.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          ⭐ 핵심 작업만
        </button>
      </div>

      {viewMode === 'gantt' && <TaskGanttMini T={T} tasks={filtered} stageLabel={stageLabel} />}
      {viewMode === 'table' && <TaskTableMini T={T} tasks={filtered} stageLabel={stageLabel} onUpdateTask={onUpdateTask} />}

      {viewMode === 'kanban' && (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGE_KEYS.length}, 1fr)`, gap: 12 }}>
        {STAGE_KEYS.map((sk) => {
          const col = filtered.filter((t) => t.stage === sk)
          const isDragOver = dragOverStage === sk
          return (
            <div key={sk}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.muted }}>{stageLabel(sk)}</span>
                <span style={{ fontSize: 10, background: T.border, borderRadius: 10, padding: '1px 7px', color: T.muted }}>{col.length}</span>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOverStage(sk) }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={(e) => { e.preventDefault(); setDragOverStage(null); const id = Number(e.dataTransfer.getData('taskId')); if (id) onMoveTask(id, sk) }}
                style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60, borderRadius: 8, border: isDragOver ? `2px dashed ${T.indigo}` : '2px solid transparent', padding: isDragOver ? 4 : 0 }}
              >
                {col.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('taskId', String(task.id))}
                    style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 12px', cursor: 'grab' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6, marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <button onClick={() => onToggleKeyTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.isKeyTask ? T.amber : T.border, fontSize: 12, lineHeight: 1, padding: 0 }}>★</button>
                        <span>{task.title}</span>
                      </div>
                      <button onClick={() => onDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 12 }}>✕</button>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Badge T={T} color={task.priority === 'high' ? T.red : task.priority === 'medium' ? T.amber : T.muted}>{PRIORITY_LABEL[task.priority]}</Badge>
                      {task.assignee && <Badge T={T} color={T.indigo}>{task.assignee}</Badge>}
                      {task.dueDate && (
                        <span style={{ fontSize: 11, color: isDueSoon(task.dueDate) ? T.red : T.muted, fontWeight: isDueSoon(task.dueDate) ? 700 : 400 }}>
                          📅 {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setAddTaskStage(sk)}
                  style={{ border: `1px dashed ${T.border}`, borderRadius: 8, padding: 9, background: 'transparent', color: T.muted, fontSize: 12, cursor: 'pointer', width: '100%' }}
                >
                  + 작업 추가
                </button>
              </div>
            </div>
          )
        })}
      </div>
      )}

      {addTaskStage && (
        <AddTaskModal
          T={T}
          members={members}
          defaultStage={addTaskStage}
          onClose={() => setAddTaskStage(null)}
          onSave={(form) => { onAddTask(form); setAddTaskStage(null) }}
        />
      )}

      {importOpen && (
        <ExcelImportModal
          T={T}
          stageLabel={stageLabel}
          onClose={() => setImportOpen(false)}
          onImport={(rows) => { onImportTasks(rows); setImportOpen(false) }}
        />
      )}
    </div>
  )
}

function TaskGanttMini({ T, tasks, stageLabel }) {
  const DAY_WIDTH = 20
  const LEFT_COL = 150
  const datedTasks = tasks.filter((t) => t.dueDate)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let startDate = new Date(today)
  if (datedTasks.length > 0) {
    const earliest = new Date(Math.min(...datedTasks.map((t) => new Date(t.dueDate).getTime())))
    startDate = new Date(earliest)
    startDate.setDate(startDate.getDate() - 2)
  }

  const totalDays = 60
  const timelineWidth = totalDays * DAY_WIDTH
  const dateToX = (dateStr) => {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    return ((d.getTime() - startDate.getTime()) / 86400000) * DAY_WIDTH
  }
  const todayX = dateToX(today)
  const grouped = STAGE_KEYS.map((sk) => ({ stage: sk, tasks: datedTasks.filter((t) => t.stage === sk) }))
  const ROW_H = 34

  return (
    <div>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 10 }}>마감일이 있는 작업만 표시돼요.</div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ width: LEFT_COL, flexShrink: 0, borderRight: `1px solid ${T.border}`, background: T.surface }}>
            <div style={{ height: 24, borderBottom: `1px solid ${T.border}`, background: T.bg }} />
            {grouped.map(({ stage, tasks: stageTasks }) => stageTasks.length > 0 && (
              <div key={stage}>
                <div style={{ padding: '5px 10px', fontSize: 10, fontWeight: 700, color: STAGE_COLORS[stage], background: T.bg, borderBottom: `1px solid ${T.border}` }}>{stageLabel(stage).toUpperCase()}</div>
                {stageTasks.map((t) => (
                  <div key={t.id} style={{ height: ROW_H, display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>
                    {t.isKeyTask && <span style={{ color: T.amber, fontSize: 10 }}>⭐</span>}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                  </div>
                ))}
              </div>
            ))}
            {datedTasks.length === 0 && <div style={{ padding: 16, fontSize: 12, color: T.muted }}>표시할 작업 없음</div>}
          </div>
          <div style={{ flex: 1, overflowX: 'auto' }}>
            <div style={{ minWidth: timelineWidth, position: 'relative' }}>
              <div style={{ height: 24, borderBottom: `1px solid ${T.border}`, background: T.bg }} />
              {todayX >= 0 && todayX <= timelineWidth && (
                <div style={{ position: 'absolute', top: 24, bottom: 0, left: todayX, borderLeft: `1.5px dashed ${T.red}`, zIndex: 3 }} />
              )}
              {grouped.map(({ stage, tasks: stageTasks }) => stageTasks.length > 0 && (
                <div key={stage}>
                  <div style={{ height: 24, borderBottom: `1px solid ${T.border}`, background: T.bg }} />
                  {stageTasks.map((t) => {
                    const barLeft = Math.max(0, dateToX(t.dueDate))
                    return (
                      <div key={t.id} style={{ height: ROW_H, borderBottom: `1px solid ${T.border}`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 6, height: ROW_H - 12, left: barLeft, width: DAY_WIDTH * 2, background: `${STAGE_COLORS[stage]}aa`, border: `1px solid ${STAGE_COLORS[stage]}`, borderRadius: 4 }} />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskTableMini({ T, tasks, stageLabel, onUpdateTask }) {
  const [sortCol, setSortCol] = useState('title')
  const [sortAsc, setSortAsc] = useState(true)

  const handleSort = (col) => {
    if (sortCol === col) setSortAsc((a) => !a)
    else { setSortCol(col); setSortAsc(true) }
  }

  const sorted = [...tasks].sort((a, b) => {
    let av = a[sortCol] ?? '', bv = b[sortCol] ?? ''
    if (sortCol === 'priority') { av = PRIORITY_ORDER[av] ?? 9; bv = PRIORITY_ORDER[bv] ?? 9 }
    if (av < bv) return sortAsc ? -1 : 1
    if (av > bv) return sortAsc ? 1 : -1
    return 0
  })

  const cols = [
    { id: 'title', label: '제목' },
    { id: 'stage', label: '단계' },
    { id: 'priority', label: '우선순위' },
    { id: 'assignee', label: '담당자' },
    { id: 'dueDate', label: '마감일' },
    { id: 'isKeyTask', label: '핵심' },
  ]
  const thStyle = { padding: '8px 10px', textAlign: 'left', color: T.muted, fontWeight: 700, fontSize: 11, borderBottom: `1px solid ${T.border}`, cursor: 'pointer', userSelect: 'none' }
  const tdStyle = { padding: '6px 10px', borderBottom: `1px solid ${T.border}`, fontSize: 12 }
  const cellSelect = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, color: T.text, fontSize: 11, padding: '2px 4px', cursor: 'pointer' }

  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${T.border}`, borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.id} style={thStyle} onClick={() => handleSort(c.id)}>
                {c.label} {sortCol === c.id ? (sortAsc ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => (
            <tr key={t.id}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{t.title}</td>
              <td style={tdStyle}>
                <select value={t.stage} onChange={(e) => onUpdateTask(t.id, 'stage', e.target.value)} style={cellSelect}>
                  {STAGE_KEYS.map((sk) => <option key={sk} value={sk}>{stageLabel(sk)}</option>)}
                </select>
              </td>
              <td style={tdStyle}>
                <select value={t.priority} onChange={(e) => onUpdateTask(t.id, 'priority', e.target.value)} style={cellSelect}>
                  {Object.keys(PRIORITY_LABEL).map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
                </select>
              </td>
              <td style={tdStyle}>
                <input value={t.assignee || ''} onChange={(e) => onUpdateTask(t.id, 'assignee', e.target.value)} style={{ background: 'transparent', border: 'none', color: T.text, fontSize: 12, width: 80, outline: 'none' }} />
              </td>
              <td style={{ ...tdStyle, color: T.muted }}>{t.dueDate || '—'}</td>
              <td style={tdStyle}>
                <button onClick={() => onUpdateTask(t.id, 'isKeyTask', !t.isKeyTask)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.isKeyTask ? T.amber : T.border }}>★</button>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={cols.length} style={{ ...tdStyle, textAlign: 'center', color: T.muted }}>표시할 작업이 없어요</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function ExcelImportModal({ T, stageLabel, onClose, onImport }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  const stageByLabel = {}
  STAGE_KEYS.forEach((sk) => { stageByLabel[stageLabel(sk)] = sk; stageByLabel[sk] = sk })
  const priorityByLabel = {}
  Object.entries(PRIORITY_LABEL).forEach(([key, label]) => { priorityByLabel[label] = key; priorityByLabel[key] = key })

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const raw = XLSX.utils.sheet_to_json(ws, { defval: '' })
      const mapped = raw.slice(0, 50).map((r) => ({
        title: String(r.Title || r['제목'] || '').trim(),
        stage: stageByLabel[r.Stage || r['단계']] || STAGE_KEYS[0],
        priority: priorityByLabel[r.Priority || r['우선순위']] || 'medium',
        assignee: String(r.Assignee || r['담당자'] || ''),
        dueDate: String(r['Due Date'] || r['마감일'] || ''),
        isKeyTask: String(r['Key Task'] || r['핵심'] || '').toLowerCase().startsWith('y'),
      })).filter((r) => r.title)
      setRows(mapped)
    } catch {
      setError('파일을 읽을 수 없어요. TaskGrid에서 내보낸 xlsx 형식을 사용해 주세요.')
    }
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 59 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, width: '100%', maxWidth: 480, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '80vh', overflowY: 'auto' }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Excel 가져오기</div>
          <div style={{ fontSize: 12, color: T.muted }}>"내보내기"로 받은 xlsx 형식(Title/Stage/Priority/Assignee/Due Date/Key Task)을 그대로 업로드하면 미리보기 후 현재 프로젝트에 추가돼요.</div>
          <input type="file" accept=".xlsx,.xls" onChange={handleFile} style={{ fontSize: 12, color: T.text }} />
          {error && <div style={{ fontSize: 12, color: T.red }}>⚠ {error}</div>}
          {rows && (
            <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 10px', fontSize: 11, color: T.muted, borderBottom: `1px solid ${T.border}` }}>{rows.length}개 작업 미리보기</div>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {rows.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                    <Badge T={T} color={T.indigo}>{stageLabel(r.stage)}</Badge>
                    <Badge T={T} color={T.muted}>{PRIORITY_LABEL[r.priority]}</Badge>
                  </div>
                ))}
                {rows.length === 0 && <div style={{ padding: 12, fontSize: 12, color: T.muted }}>가져올 수 있는 행이 없어요.</div>}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn onClick={onClose} style={{ background: T.border, color: T.text }}>취소</Btn>
            <Btn disabled={!rows || rows.length === 0} onClick={() => onImport(rows)} style={{ background: T.emerald, color: T.bg }}>
              {rows ? `${rows.length}개 가져오기` : '가져오기'}
            </Btn>
          </div>
        </div>
      </div>
    </>
  )
}

function AddTaskModal({ T, members, defaultStage, onClose, onSave }) {
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState(members[0]?.name || '')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [isKeyTask, setIsKeyTask] = useState(false)

  const inputStyle = { width: '100%', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 59 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, width: '100%', maxWidth: 420, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>새 작업 추가</div>
          <div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>제목</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="작업 제목" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>담당자</div>
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} style={inputStyle}>
                <option value="">미지정</option>
                {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>우선순위</div>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
                <option value="high">높음</option>
                <option value="medium">보통</option>
                <option value="low">낮음</option>
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontWeight: 600 }}>마감일 (선택)</div>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={inputStyle} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: T.muted, cursor: 'pointer' }}>
            <input type="checkbox" checked={isKeyTask} onChange={(e) => setIsKeyTask(e.target.checked)} />
            ⭐ 핵심 작업으로 표시
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <Btn onClick={onClose} style={{ background: T.border, color: T.text }}>취소</Btn>
            <Btn
              onClick={() => title.trim() && onSave({ title: title.trim(), assignee, priority, dueDate, isKeyTask, stage: defaultStage })}
              style={{ background: T.emerald, color: T.bg }}
            >
              추가
            </Btn>
          </div>
        </div>
      </div>
    </>
  )
}

function MyTasksTab({ T, tasks, projects, stageLabel, me }) {
  const myTasks = tasks.filter((t) => t.assignee === me)
  const groups = {}
  myTasks.forEach((t) => {
    const pid = t.projectId || '__none__'
    if (!groups[pid]) groups[pid] = []
    groups[pid].push(t)
  })
  const projectName = (pid) => projects.find((p) => p.id === pid)?.name || '기타'
  const projectColor = (pid) => projects.find((p) => p.id === pid)?.color || T.muted

  if (myTasks.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 8 }}>
        <div style={{ fontSize: 32 }}>✓</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>My Tasks</div>
        <div style={{ fontSize: 12, color: T.muted }}>{me}님에게 할당된 작업이 없어요.</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ fontSize: 16, fontWeight: 700 }}>My Tasks <span style={{ fontWeight: 400, fontSize: 12, color: T.muted }}>({me})</span></div>
      {Object.entries(groups).map(([pid, groupTasks]) => (
        <div key={pid}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: projectColor(pid) }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: T.muted }}>{projectName(pid).toUpperCase()}</span>
            <span style={{ fontSize: 10, background: T.border, borderRadius: 10, padding: '1px 7px', color: T.muted }}>{groupTasks.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {groupTasks.map((t) => (
              <div key={t.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {t.isKeyTask && <span style={{ color: T.amber, fontSize: 12 }}>⭐</span>}
                    {t.title}
                  </div>
                  <Badge T={T} color={T.indigo}>{stageLabel(t.stage)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function buildSampleReport(members, tasks) {
  const total = tasks.length
  const done = tasks.filter((t) => t.stage === 'dev').length
  const keyTasks = tasks.filter((t) => t.isKeyTask)
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date(new Date().toDateString()))
  const byMember = members.map((m) => ({ name: m.name, count: tasks.filter((t) => t.assignee === m.name).length }))

  const lines = []
  lines.push('## 이번 주 요약')
  lines.push(`전체 ${total}개 작업 중 ${done}개가 개발 단계까지 진행됐어요. 핵심 작업은 ${keyTasks.length}개, 마감이 지난 작업은 ${overdue.length}개예요.`)
  lines.push('')
  lines.push('### 팀원별 작업량')
  byMember.forEach((m) => lines.push(`- ${m.name}: ${m.count}건`))
  lines.push('')
  lines.push('### 리스크')
  lines.push(overdue.length > 0
    ? `- ${overdue.map((t) => t.title).join(', ')} 작업이 마감일을 넘겼어요. 우선순위 재조정이 필요해요.`
    : '- 마감일을 넘긴 작업이 없어요. 현재 페이스를 유지하면 좋아요.')
  lines.push('')
  lines.push('### 다음 주 추천 액션')
  lines.push('- 핵심 작업(⭐) 위주로 담당자 리마인드를 보내세요.')
  lines.push('- 담당자가 몰린 팀원의 작업을 재분배해 보세요.')
  return lines.join('\n')
}

function AiPmTab({ T, members, tasks }) {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')
  const [copied, setCopied] = useState(false)
  const [slackUrl, setSlackUrl] = useState('')
  const [slackResult, setSlackResult] = useState('')

  const generate = () => {
    setLoading(true)
    setReport('')
    setTimeout(() => {
      setReport(buildSampleReport(members, tasks))
      setLoading(false)
    }, 500)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable, e.g. insecure context */ }
  }

  const sendSlack = () => {
    setSlackResult('🧪 샘플 모드에서는 실제로 전송되지 않아요.')
  }

  const renderReport = (text) => text.split('\n').map((line, i) => {
    if (line.startsWith('### ')) return <div key={i} style={{ fontWeight: 700, fontSize: 14, color: T.indigo, marginTop: 16, marginBottom: 4 }}>{line.slice(4)}</div>
    if (line.startsWith('## ')) return <div key={i} style={{ fontWeight: 800, fontSize: 15, color: T.emerald, marginTop: 4, marginBottom: 6 }}>{line.slice(3)}</div>
    if (line.trim() === '') return <div key={i} style={{ height: 6 }} />
    return <div key={i} style={{ fontSize: 13, color: T.text, lineHeight: 1.7 }}>{line}</div>
  })

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>✨ AI PM</div>
        <Badge T={T} color={T.amber}>샘플</Badge>
        <Btn onClick={generate} disabled={loading} style={{ background: T.indigo, color: '#fff', marginLeft: 'auto' }}>
          {loading ? '생성 중…' : '✨ 리포트 생성 (샘플)'}
        </Btn>
      </div>

      <div style={{ background: `${T.amber}18`, border: `1px solid ${T.amber}44`, borderRadius: 8, padding: '10px 16px', fontSize: 12, color: T.amber }}>
        이 탭은 실제 Gemini API·Slack 연동 없이, 현재 데모 데이터로 만든 샘플 리포트를 보여드려요.
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: T.indigo, fontSize: 13, padding: 20 }}>
          <span>◆</span> 샘플 리포트를 만들고 있어요…
        </div>
      )}

      {report && !loading && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <Btn onClick={copy} style={{ background: copied ? T.emerald : T.border, color: copied ? T.bg : T.text }} small>
              {copied ? '✓ 복사됨' : '복사'}
            </Btn>
            <div style={{ display: 'flex', gap: 6, flex: 1, minWidth: 200 }}>
              <input
                value={slackUrl}
                onChange={(e) => setSlackUrl(e.target.value)}
                placeholder="Slack Webhook URL (샘플)"
                style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 12, padding: '4px 8px', outline: 'none' }}
              />
              <Btn onClick={sendSlack} disabled={!slackUrl} style={{ background: T.border, color: T.text }} small>Slack로 보내기</Btn>
            </div>
            {slackResult && <span style={{ fontSize: 12, color: T.amber }}>{slackResult}</span>}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>{renderReport(report)}</div>
        </div>
      )}
    </div>
  )
}

function TeamTab({ T, members, newMemberName, setNewMemberName, newMemberRole, setNewMemberRole, onAdd, onDelete }) {
  const inputStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, padding: '8px 10px', outline: 'none' }
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Team</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="이름" style={{ ...inputStyle, flex: '1 1 140px' }} />
        <input value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} placeholder="역할 (예: Designer)" style={{ ...inputStyle, flex: '1 1 140px' }} />
        <Btn onClick={onAdd} style={{ background: T.indigo, color: '#fff' }}>+ 팀원 추가</Btn>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.indigo, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                {m.name.slice(0, 1)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{m.role}</div>
              </div>
            </div>
            <button onClick={() => onDelete(m.id)} style={{ fontSize: 11, color: T.red, background: 'transparent', border: `1px solid ${T.red}55`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ T, stageLabels, onChange, onReset }) {
  const inputStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, padding: '8px 10px', outline: 'none', width: 160 }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Settings</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 12 }}>칸반 단계 이름을 팀에 맞게 바꿀 수 있어요.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STAGE_KEYS.map((key) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: T.muted, width: 70 }}>{STAGE_DEFAULT_LABEL[key]}</span>
              <input
                value={stageLabels[key] || ''}
                placeholder={STAGE_DEFAULT_LABEL[key]}
                onChange={(e) => onChange(key, e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>데모 데이터</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>모든 변경 사항은 이 브라우저의 로컬 저장소에만 JSON으로 저장돼요. 서버나 데이터베이스에는 저장되지 않습니다.</div>
        <Btn onClick={onReset} style={{ background: T.red, color: '#fff' }}>데모 초기화</Btn>
      </div>
    </div>
  )
}
