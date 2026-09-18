'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apps } from '../../data/apps'

const T = { bg: '#09090b', surface: '#18181b', border: '#27272a', text: '#f4f4f5', muted: '#71717a', emerald: '#10b981', indigo: '#6366f1', red: '#ef4444', amber: '#f59e0b' }
const STORAGE_KEY = 'tf_service_dashboard_demo_v1'
const SERVICE_COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9']

const SERVICES = apps.map((a, i) => ({ id: a.id, name: a.name, color: SERVICE_COLORS[i % SERVICE_COLORS.length] }))
const SERVICE_OPTIONS = [{ id: 'general', name: '공통' }, ...SERVICES]

const TABS = [
  { key: 'status', label: '현황' },
  { key: 'automation', label: '자동화' },
  { key: 'cycle', label: 'AI PM' },
  { key: 'ideas', label: '아이디어' },
  { key: 'arch', label: '비용·아키텍처' },
  { key: 'briefing', label: '모닝 브리핑' },
  { key: 'feedback', label: '피드백' },
]

const CATEGORY_STYLE = {
  action: { label: '핵심 액션', color: T.indigo },
  plan: { label: '2주 플랜', color: T.emerald },
  warning: { label: '주의 신호', color: T.red },
}

const COST_PRESETS = [
  { label: 'Vercel Pro', item: 'Vercel Pro', service: 'general', currency: 'USD' },
  { label: 'Neon DB', item: 'Neon DB', service: 'general', currency: 'USD' },
  { label: 'AI API', item: 'AI API 사용료', service: 'general', currency: 'USD' },
]

const AUTOMATION_PHASES = [
  {
    phase: '1단계 — 콘텐츠 자동화',
    items: [
      { label: '가이드 페이지 자동 생성', detail: 'data/apps.js에 항목만 추가하면 가이드 페이지가 자동으로 생겨요', done: true },
      { label: '태그 필터 자동 반영', detail: '새 앱의 태그가 갤러리 필터 바에 자동으로 추가돼요', done: true },
      { label: 'SNS 홍보 자동 발행', detail: '앱 출시 시 SNS에 자동으로 소개 글 발행 (샘플)', done: false },
    ],
  },
  {
    phase: '2단계 — 운영 모니터링',
    items: [
      { label: '서비스 헬스체크', detail: '각 데모 앱이 정상 응답하는지 주기적으로 확인', done: true },
      { label: '비용 장부 자동 집계', detail: '월별 비용을 통화별로 자동 합산', done: true },
      { label: 'AI 모닝 브리핑', detail: '전날 현황을 요약해서 매일 아침 브리핑 (샘플)', done: false },
    ],
  },
]

const CRON_SCHEDULE = [
  { service: '전체 데모', path: '/api/health-check', schedule: '매일 09:00', desc: '데모 앱 응답 상태 점검 (샘플)' },
  { service: '비용 장부', path: '/api/cost-summary', schedule: '매월 1일', desc: '월간 비용 요약 (샘플)' },
]

function seedStats() {
  const stats = {}
  SERVICES.forEach((s, i) => {
    stats[s.id] = {
      blogTotal: 10 + i * 7,
      blogWeek: [2, 0, 1, 3, 0, 1][i % 6],
      ga4Users: 120 + i * 45,
      ga4Sessions: 200 + i * 60,
    }
  })
  return stats
}

const STATS = seedStats()

const PLAN_BANK = [
  [
    { category: 'action', title: '갤러리 카드 설명 다듬기', body: '한 줄 설명이 너무 길어 잘리는 카드가 있어요.', steps: ['카드별 설명 길이 확인', '20자 내외로 축약'], goal: '갤러리에서 설명이 안 잘리게' },
    { category: 'plan', title: '신규 데모 앱 1개 추가', body: '다음 2주 안에 새 데모 앱을 하나 더 포팅해보세요.', steps: ['후보 리포 선정', '핵심 화면만 포팅'], goal: '갤러리 앱 수 +1' },
    { category: 'warning', title: '방문자 유입 정체', body: '최근 신규 방문자 증가세가 둔화됐어요 (샘플 데이터).', steps: ['공유 채널 점검'], goal: '' },
  ],
  [
    { category: 'action', title: '피드백 게시판 확인', body: '방문자 피드백에 응답할 시간이에요.', steps: ['새 피드백 확인', '개선 아이디어 메모'], goal: '피드백 응답률 개선' },
    { category: 'plan', title: '가이드 페이지 보강', body: '가이드 페이지에 스크린샷을 추가하면 좋아요.', steps: ['앱별 스크린샷 촬영', '가이드에 삽입'], goal: '' },
  ],
]

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { costs: [], ideas: {}, cycle: null, feedback: [], ...JSON.parse(raw) }
  } catch { /* corrupt or unavailable storage */ }
  return { costs: [], ideas: {}, cycle: null, feedback: [] }
}

function Badge({ children, color }) {
  return (
    <span style={{ display: 'inline-block', padding: '1px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, border: `1px solid ${color}55`, color, background: `${color}18` }}>
      {children}
    </span>
  )
}

export default function ServiceDashboardDemo() {
  const [state, setState] = useState(null)
  const [tab, setTab] = useState('status')
  const [health, setHealth] = useState(null)
  const [healthLoading, setHealthLoading] = useState(false)
  const [planLoading, setPlanLoading] = useState(false)
  const [expanded, setExpanded] = useState(new Set())
  const [briefing, setBriefing] = useState('')
  const [briefingLoading, setBriefingLoading] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [costMonth, setCostMonth] = useState('')
  const [costForm, setCostForm] = useState({ service: 'general', item: '', amount: '', currency: 'USD', note: '' })
  const [showCostForm, setShowCostForm] = useState(false)
  const [editingIdea, setEditingIdea] = useState(null)
  const [ideaDraft, setIdeaDraft] = useState('')
  const [fbForm, setFbForm] = useState({ service: SERVICES[0]?.id || 'general', nickname: '', content: '', captchaAnswer: '' })
  const [captcha, setCaptcha] = useState({ a: 3, b: 4 })
  const [fbError, setFbError] = useState('')

  useEffect(() => {
    setState(loadState())
    setCostMonth(new Date().toISOString().slice(0, 7))
    setCaptcha({ a: Math.ceil(Math.random() * 8), b: Math.ceil(Math.random() * 8) })
  }, [])

  useEffect(() => {
    if (!state) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* private mode */ }
  }, [state])

  if (!state) return null

  const update = (fn) => setState((prev) => fn({ ...prev }))

  const runHealthCheck = () => {
    setHealthLoading(true)
    setTimeout(() => {
      setHealth({
        checkedAt: new Date().toISOString(),
        results: SERVICES.map((s) => {
          const roll = Math.random()
          const status = roll > 0.85 ? 'degraded' : 'up'
          return { key: s.id, name: s.name, status, latency: 80 + Math.round(Math.random() * 300), blogTotal: STATS[s.id].blogTotal }
        }),
      })
      setHealthLoading(false)
    }, 900)
  }

  const generatePlan = () => {
    setPlanLoading(true)
    setTimeout(() => {
      const tasks = PLAN_BANK[Math.floor(Math.random() * PLAN_BANK.length)].map((t, i) => ({
        id: `${Date.now()}_${i}`,
        service: SERVICES[i % SERVICES.length]?.id || 'general',
        done: false,
        ...t,
      }))
      update((s) => ({ ...s, cycle: { id: Date.now(), createdAt: new Date().toISOString(), tasks } }))
      setPlanLoading(false)
    }, 800)
  }

  const toggleTask = (taskId) => {
    update((s) => ({ ...s, cycle: { ...s.cycle, tasks: s.cycle.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) } }))
  }

  const toggleExpand = (id) => setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const loadBriefing = () => {
    setBriefingLoading(true)
    setTimeout(() => {
      const lines = SERVICES.map((s) => `${s.name}: 블로그 ${STATS[s.id].blogTotal}개(이번 주 +${STATS[s.id].blogWeek}), 최근 7일 사용자 ${STATS[s.id].ga4Users}명`)
      setBriefing(`좋은 아침이에요! 오늘의 포트폴리오 현황을 요약해드릴게요.\n\n${lines.join('\n')}\n\n오늘은 피드백 게시판을 확인하고, 가장 반응이 좋은 앱의 가이드 페이지를 다듬어보는 걸 추천해요. (샘플 브리핑)`)
      setBriefingLoading(false)
    }, 700)
  }

  const speak = () => {
    if (!briefing) return
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return }
    const u = new SpeechSynthesisUtterance(briefing)
    u.lang = 'ko-KR'
    u.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
    setSpeaking(true)
  }

  const costs = (state.costs || []).filter((c) => c.month === costMonth)
  const usdTotal = costs.filter((c) => c.currency === 'USD').reduce((sum, c) => sum + Number(c.amount), 0)
  const krwTotal = costs.filter((c) => c.currency === 'KRW').reduce((sum, c) => sum + Number(c.amount), 0)
  const totalKRW = Math.round(usdTotal * 1450) + krwTotal

  const addCost = () => {
    if (!costForm.item || !costForm.amount) return
    update((s) => ({ ...s, costs: [...(s.costs || []), { id: Date.now(), month: costMonth, ...costForm, amount: Number(costForm.amount) }] }))
    setCostForm({ service: 'general', item: '', amount: '', currency: 'USD', note: '' })
    setShowCostForm(false)
  }
  const deleteCost = (id) => update((s) => ({ ...s, costs: (s.costs || []).filter((c) => c.id !== id) }))

  const saveIdea = (serviceId) => {
    update((s) => ({ ...s, ideas: { ...s.ideas, [serviceId]: ideaDraft } }))
    setEditingIdea(null)
  }

  const submitFeedback = (e) => {
    e.preventDefault()
    setFbError('')
    if (Number(fbForm.captchaAnswer) !== captcha.a + captcha.b) {
      setFbError('자동 입력 방지 답이 틀렸어요.')
      return
    }
    if (fbForm.content.trim().length < 5) {
      setFbError('5자 이상 입력해주세요.')
      return
    }
    update((s) => ({
      ...s,
      feedback: [{ id: Date.now(), service: fbForm.service, nickname: fbForm.nickname.trim() || '익명', content: fbForm.content.trim(), createdAt: new Date().toISOString() }, ...(s.feedback || [])],
    }))
    setFbForm({ service: fbForm.service, nickname: '', content: '', captchaAnswer: '' })
    setCaptcha({ a: Math.ceil(Math.random() * 8), b: Math.ceil(Math.random() * 8) })
  }
  const deleteFeedback = (id) => update((s) => ({ ...s, feedback: (s.feedback || []).filter((f) => f.id !== id) }))

  const inputStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, padding: '7px 10px', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text }}>
      <div style={{ background: `${T.amber}18`, borderBottom: `1px solid ${T.amber}44`, padding: '8px 24px', textAlign: 'center', fontSize: 12, color: T.amber }}>
        🧪 샘플 데이터 데모 — 외부 API·GA4·실제 AI 호출 없이 이 브라우저에만 데이터가 저장돼요.
      </div>
      <header style={{ borderBottom: `1px solid ${T.border}`, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/portfolio" style={{ fontWeight: 800, fontSize: 15, textDecoration: 'none', color: T.text }}>
          Task<span style={{ color: T.emerald }}>Grid</span> Ops
        </Link>
        <div style={{ display: 'flex', gap: 2, marginLeft: 8, flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{ padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: tab === t.key ? T.border : 'transparent', color: tab === t.key ? T.text : T.muted, fontSize: 12, fontWeight: tab === t.key ? 600 : 400 }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Link href="/portfolio" style={{ marginLeft: 'auto', fontSize: 12, color: T.muted, textDecoration: 'none' }}>갤러리로</Link>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
        {tab === 'status' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {SERVICES.map((s) => {
              const d = STATS[s.id]
              return (
                <div key={s.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                    <div style={{ background: T.bg, borderRadius: 8, padding: 10 }}>
                      <div style={{ color: T.muted, marginBottom: 2 }}>블로그 총</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{d.blogTotal}</div>
                    </div>
                    <div style={{ background: T.bg, borderRadius: 8, padding: 10 }}>
                      <div style={{ color: T.muted, marginBottom: 2 }}>이번 주 신규</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{d.blogWeek}</div>
                    </div>
                    <div style={{ background: T.bg, borderRadius: 8, padding: 10 }}>
                      <div style={{ color: T.muted, marginBottom: 2 }}>GA4 7일 사용자</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{d.ga4Users}</div>
                    </div>
                    <div style={{ background: T.bg, borderRadius: 8, padding: 10 }}>
                      <div style={{ color: T.muted, marginBottom: 2 }}>GA4 7일 세션</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{d.ga4Sessions}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'automation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {AUTOMATION_PHASES.map((phase) => (
              <div key={phase.phase} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{phase.phase}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {phase.items.map((item) => (
                    <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: T.surface, borderRadius: 8, padding: 10 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.done ? T.emerald : T.border, color: item.done ? T.bg : T.muted, fontSize: 11 }}>
                        {item.done ? '✓' : ''}
                      </span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: item.done ? T.text : T.muted }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>⏰ 크론 스케줄 (샘플)</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', color: T.muted, padding: '4px 8px' }}>서비스</th>
                    <th style={{ textAlign: 'left', color: T.muted, padding: '4px 8px' }}>엔드포인트</th>
                    <th style={{ textAlign: 'left', color: T.muted, padding: '4px 8px' }}>스케줄</th>
                    <th style={{ textAlign: 'left', color: T.muted, padding: '4px 8px' }}>설명</th>
                  </tr>
                </thead>
                <tbody>
                  {CRON_SCHEDULE.map((c) => (
                    <tr key={c.path} style={{ borderTop: `1px solid ${T.border}` }}>
                      <td style={{ padding: '6px 8px' }}>{c.service}</td>
                      <td style={{ padding: '6px 8px', color: T.indigo, fontFamily: 'monospace' }}>{c.path}</td>
                      <td style={{ padding: '6px 8px', color: T.muted }}>{c.schedule}</td>
                      <td style={{ padding: '6px 8px', color: T.muted }}>{c.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>🩺 서비스 헬스체크 (샘플)</div>
                <button onClick={runHealthCheck} disabled={healthLoading} style={{ fontSize: 12, fontWeight: 600, color: T.bg, background: T.indigo, border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', opacity: healthLoading ? 0.6 : 1 }}>
                  {healthLoading ? '점검 중…' : '지금 점검'}
                </button>
              </div>
              {!health && !healthLoading && <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: 16 }}>버튼을 누르면 데모 앱들의 상태를 가상으로 점검해요.</div>}
              {health && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                  {health.results.map((r) => (
                    <div key={r.key} style={{ border: `1px solid ${r.status === 'up' ? T.emerald : T.amber}55`, background: `${r.status === 'up' ? T.emerald : T.amber}11`, borderRadius: 8, padding: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: r.status === 'up' ? T.emerald : T.amber }} />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{r.name}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 11, color: T.muted }}>{r.latency}ms</span>
                      </div>
                      <div style={{ fontSize: 11, color: T.muted }}>블로그 {r.blogTotal}개 · {r.status === 'up' ? '정상' : '일부 지연'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'cycle' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: T.muted }}>
                {state.cycle ? `진행 중: ${state.cycle.tasks.filter((t) => t.done).length}/${state.cycle.tasks.length} 완료` : 'AI 플랜을 생성해보세요'}
              </div>
              <button onClick={generatePlan} disabled={planLoading} style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: T.indigo, border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', opacity: planLoading ? 0.6 : 1 }}>
                {planLoading ? '생성 중…' : '✨ 새 AI 플랜 생성 (샘플)'}
              </button>
            </div>
            {!state.cycle ? (
              <div style={{ textAlign: 'center', color: T.muted, padding: 40 }}>아직 생성된 플랜이 없어요.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {state.cycle.tasks.map((task) => {
                  const style = CATEGORY_STYLE[task.category]
                  const svc = SERVICES.find((s) => s.id === task.service)
                  const isExpanded = expanded.has(task.id)
                  return (
                    <div key={task.id} style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12 }}>
                        <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} style={{ marginTop: 3, cursor: 'pointer' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                            {svc && <span style={{ width: 8, height: 8, borderRadius: '50%', background: svc.color }} />}
                            <span style={{ fontSize: 11, color: T.muted }}>{svc?.name}</span>
                            <Badge color={style.color}>{style.label}</Badge>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? T.muted : T.text }}>{task.title}</div>
                          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{task.body}</div>
                        </div>
                        {(task.steps?.length > 0 || task.goal) && (
                          <button onClick={() => toggleExpand(task.id)} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer' }}>{isExpanded ? '▲' : '▼'}</button>
                        )}
                      </div>
                      {isExpanded && (
                        <div style={{ padding: '0 12px 12px', borderTop: `1px solid ${T.border}` }}>
                          {task.steps?.length > 0 && (
                            <ol style={{ margin: '10px 0 0', paddingLeft: 18, fontSize: 12, color: T.text }}>
                              {task.steps.map((step, i) => <li key={i} style={{ marginBottom: 4 }}>{step}</li>)}
                            </ol>
                          )}
                          {task.goal && <div style={{ fontSize: 12, color: T.muted, marginTop: 8 }}>🎯 {task.goal}</div>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'ideas' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {SERVICES.map((s) => (
              <div key={s.id} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</span>
                  <button onClick={() => { setEditingIdea(s.id); setIdeaDraft(state.ideas[s.id] || '') }} style={{ marginLeft: 'auto', fontSize: 11, color: T.indigo, background: 'none', border: 'none', cursor: 'pointer' }}>편집</button>
                </div>
                {editingIdea === s.id ? (
                  <div>
                    <textarea value={ideaDraft} onChange={(e) => setIdeaDraft(e.target.value)} style={{ ...inputStyle, width: '100%', height: 90, resize: 'none', boxSizing: 'border-box' }} placeholder="아이디어를 자유롭게 적어보세요…" />
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <button onClick={() => saveIdea(s.id)} style={{ fontSize: 11, color: '#fff', background: T.indigo, border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}>저장</button>
                      <button onClick={() => setEditingIdea(null)} style={{ fontSize: 11, color: T.muted, background: T.border, border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}>취소</button>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: 12.5, color: T.muted, whiteSpace: 'pre-wrap', minHeight: 40 }}>{state.ideas[s.id] || '아직 아이디어가 없어요.'}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'arch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>💰 월별 비용 장부</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="month" value={costMonth} onChange={(e) => setCostMonth(e.target.value)} style={inputStyle} />
                  <button onClick={() => setShowCostForm((v) => !v)} style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: T.indigo, border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>
                    {showCostForm ? '취소' : '+ 추가'}
                  </button>
                </div>
              </div>
              {showCostForm && (
                <div style={{ background: T.surface, borderRadius: 8, padding: 12, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {COST_PRESETS.map((p) => (
                      <button key={p.label} onClick={() => setCostForm((prev) => ({ ...prev, item: p.item, service: p.service, currency: p.currency }))} style={{ fontSize: 11, color: T.text, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 999, padding: '4px 10px', cursor: 'pointer' }}>{p.label}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <select value={costForm.service} onChange={(e) => setCostForm((p) => ({ ...p, service: e.target.value }))} style={inputStyle}>
                      {SERVICE_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select value={costForm.currency} onChange={(e) => setCostForm((p) => ({ ...p, currency: e.target.value }))} style={inputStyle}>
                      <option value="USD">USD ($)</option>
                      <option value="KRW">KRW (₩)</option>
                    </select>
                    <input value={costForm.item} onChange={(e) => setCostForm((p) => ({ ...p, item: e.target.value }))} placeholder="항목명" style={{ ...inputStyle, flex: 1, minWidth: 120 }} />
                    <input type="number" value={costForm.amount} onChange={(e) => setCostForm((p) => ({ ...p, amount: e.target.value }))} placeholder="금액" style={{ ...inputStyle, width: 100 }} />
                  </div>
                  <button onClick={addCost} disabled={!costForm.item || !costForm.amount} style={{ fontSize: 12, fontWeight: 600, color: T.bg, background: T.emerald, border: 'none', borderRadius: 6, padding: '8px', cursor: 'pointer' }}>저장</button>
                </div>
              )}
              {costs.length === 0 ? (
                <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: 20 }}>{costMonth} 등록된 비용이 없어요.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {costs.map((c) => {
                    const svc = SERVICE_OPTIONS.find((s) => s.id === c.service)
                    return (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: T.surface, borderRadius: 8, fontSize: 12.5 }}>
                        <span style={{ color: T.muted, minWidth: 70 }}>{svc?.name}</span>
                        <span style={{ flex: 1 }}>{c.item}</span>
                        <span style={{ fontWeight: 700 }}>{c.currency === 'USD' ? `$${Number(c.amount).toFixed(2)}` : `₩${Number(c.amount).toLocaleString()}`}</span>
                        <button onClick={() => deleteCost(c.id)} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', fontSize: 11 }}>삭제</button>
                      </div>
                    )
                  })}
                </div>
              )}
              {costs.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, textAlign: 'right', fontSize: 12.5 }}>
                  원화 환산 총계 <strong style={{ color: T.indigo }}>₩{totalKRW.toLocaleString()}</strong>
                </div>
              )}
            </div>

            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>🏗️ 아키텍처</div>
              <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.7 }}>
                이 포트폴리오의 모든 데모 앱은 같은 Next.js 리포 안에서 동작해요. 서버 DB나 로그인 없이, 각 앱이 브라우저의 <code>localStorage</code>에만 데이터를 저장하기 때문에 실행 비용은 사실상 0원이에요.
              </p>
            </div>
          </div>
        )}

        {tab === 'briefing' && (
          <div style={{ maxWidth: 560 }}>
            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🌅 AI 모닝 브리핑 (샘플)</div>
              {!briefing ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <p style={{ fontSize: 13, color: T.muted, marginBottom: 14 }}>오늘의 데모 현황을 요약해드릴게요.</p>
                  <button onClick={loadBriefing} disabled={briefingLoading} style={{ fontSize: 13, fontWeight: 600, color: T.bg, background: T.emerald, border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer' }}>
                    {briefingLoading ? '생성 중…' : '📋 브리핑 생성'}
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: T.text, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{briefing}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button onClick={speak} style={{ fontSize: 12, fontWeight: 600, color: speaking ? T.red : T.indigo, background: `${speaking ? T.red : T.indigo}18`, border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}>
                      {speaking ? '⏹ 중지' : '🔊 읽어주기'}
                    </button>
                    <button onClick={loadBriefing} style={{ fontSize: 12, color: T.muted, background: T.border, border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer' }}>다시 생성</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
            <form onSubmit={submitFeedback} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>의견 남기기</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <select value={fbForm.service} onChange={(e) => setFbForm((f) => ({ ...f, service: e.target.value }))} style={inputStyle}>
                  {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input value={fbForm.nickname} onChange={(e) => setFbForm((f) => ({ ...f, nickname: e.target.value }))} placeholder="닉네임 (선택)" style={{ ...inputStyle, flex: 1 }} />
              </div>
              <textarea value={fbForm.content} onChange={(e) => setFbForm((f) => ({ ...f, content: e.target.value }))} placeholder="의견·제안·버그 제보를 남겨주세요 (5자 이상)" style={{ ...inputStyle, height: 70, resize: 'none' }} />
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: T.muted }}>자동 입력 방지: {captcha.a} + {captcha.b} =</span>
                <input value={fbForm.captchaAnswer} onChange={(e) => setFbForm((f) => ({ ...f, captchaAnswer: e.target.value }))} style={{ ...inputStyle, width: 60 }} />
                <button type="submit" style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#fff', background: T.indigo, border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>등록</button>
              </div>
              {fbError && <div style={{ fontSize: 12, color: T.red }}>⚠ {fbError}</div>}
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(state.feedback || []).length === 0 && <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: 20 }}>아직 등록된 의견이 없어요.</div>}
              {(state.feedback || []).map((f) => {
                const svc = SERVICES.find((s) => s.id === f.service)
                return (
                  <div key={f.id} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      {svc && <span style={{ width: 7, height: 7, borderRadius: '50%', background: svc.color }} />}
                      <span style={{ fontSize: 12, color: T.muted }}>{svc?.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{f.nickname}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: T.muted }}>{new Date(f.createdAt).toLocaleString('ko-KR')}</span>
                      <button onClick={() => deleteFeedback(f.id)} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', fontSize: 11 }}>삭제</button>
                    </div>
                    <div style={{ fontSize: 13, color: T.text, whiteSpace: 'pre-wrap' }}>{f.content}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
