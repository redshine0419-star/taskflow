'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const T = {
  bg: '#ffffff', surface: '#f6f8fa', border: '#eaeef2', text: '#24292f', muted: '#57606a',
  indigo: '#6366f1', emerald: '#10b981', amber: '#f59e0b', rose: '#ef4444', purple: '#8b5cf6',
  blue: '#0969da', pink: '#ec4899', dark: '#0d1117',
}
const STORAGE_KEY = 'tf_marketerops_channels_demo_v1'

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
function pick(arr, h, salt = 0) { return arr[(h + salt) % arr.length] }
function fmtNum(n) { return n >= 10000 ? (n / 1000).toFixed(1) + 'k' : n.toLocaleString() }
function scoreColor(score, good = 80, warn = 50) { return score >= good ? T.emerald : score >= warn ? T.amber : T.rose }
function cleanUrl(u) { try { return new URL(u.startsWith('http') ? u : `https://${u}`).origin } catch { return u } }

const CHANNEL_COLORS = { 'Organic Search': T.indigo, Direct: T.emerald, Referral: T.amber, 'Organic Social': T.pink, 'Paid Search': T.purple, Email: '#06b6d4' }

function genGa4Data(seed) {
  const h = hash(seed)
  const trend = Array.from({ length: 14 }).map((_, i) => ({
    date: `${i + 1}일`,
    sessions: 200 + ((h >>> i) % 300),
    newUsers: 80 + ((h >>> (i + 3)) % 150),
  }))
  const totals = {
    sessions: trend.reduce((s, t) => s + t.sessions, 0),
    activeUsers: 1800 + (h % 2000),
    newUsers: trend.reduce((s, t) => s + t.newUsers, 0),
    pageViews: 8000 + (h % 12000),
    avgBounceRate: 0.35 + (h % 40) / 100,
    avgSessionDuration: 60 + (h % 180),
  }
  const channels = Object.keys(CHANNEL_COLORS).map((c, i) => ({ channel: c, sessions: 300 + ((h >>> (i + 2)) % 900), conversions: 5 + ((h >>> i) % 40) }))
  const topPages = ['/', '/pricing', '/blog/geo-guide', '/features', '/blog/seo-tips'].map((p, i) => ({
    path: p, pageViews: 500 + ((h >>> i) % 3000), bounceRate: 0.3 + ((h >>> (i + 1)) % 55) / 100, avgDuration: 20 + ((h >>> i) % 150), activeUsers: 100 + ((h >>> i) % 500),
  }))
  const devices = [
    { device: 'mobile', sessions: Math.round(totals.sessions * 0.58) },
    { device: 'desktop', sessions: Math.round(totals.sessions * 0.34) },
    { device: 'tablet', sessions: Math.round(totals.sessions * 0.08) },
  ]
  return { totals, trend, channels, topPages, devices }
}
function genInsight(data, seed) {
  const h = hash(seed)
  const healthScore = 45 + (h % 45)
  return {
    healthScore,
    trendDirection: healthScore >= 70 ? 'growing' : healthScore >= 45 ? 'stable' : 'declining',
    executiveSummary: `최근 14일간 세션이 ${fmtNum(data.totals.sessions)}건 발생했고, 평균 이탈률은 ${(data.totals.avgBounceRate * 100).toFixed(0)}%예요. 전반적으로 ${healthScore >= 70 ? '건강한 성장세' : healthScore >= 45 ? '안정적인 흐름' : '개선이 필요한 구간'}을 보이고 있어요.`,
    keyFindings: [
      '모바일 트래픽 비중이 절반을 넘어 모바일 최적화가 중요해졌어요.',
      '오가닉 서치 채널이 가장 많은 세션을 만들고 있어요.',
      '상위 페이지 중 일부는 이탈률이 55%를 넘어 콘텐츠 점검이 필요해요.',
    ],
    channelInsight: '오가닉 서치와 다이렉트 유입이 전체의 절반 이상을 차지해요. 페이드 서치 의존도는 낮은 편이에요.',
    audienceInsight: `신규 사용자 비율이 전체의 ${Math.round((data.totals.newUsers / data.totals.activeUsers) * 100)}%로, 재방문 유도 전략이 필요해요.`,
    strengths: [{ title: '꾸준한 오가닉 유입', detail: '검색 노출이 안정적으로 트래픽을 만들고 있어요.' }],
    risks: [{ title: '이탈률 상승 페이지 존재', severity: 'medium', detail: '일부 페이지의 이탈률이 55%를 초과했어요.', action: '콘텐츠 구조와 CTA 위치를 점검하세요.' }],
    quickWins: [{ action: '상위 페이지에 내부 링크 추가', detail: '체류시간을 늘릴 수 있어요.', kpi: '평균 세션시간 +15%', effort: '낮음' }],
    monthlyGoals: [{ goal: '이탈률 5%p 감소', strategy: '랜딩 페이지 콘텐츠 재구성', kpi: '평균 이탈률' }],
    quarterlyVision: '분기 내 오가닉 세션 30% 성장과 이탈률 10%p 개선을 목표로 콘텐츠·기술 SEO를 병행 강화하세요.',
  }
}
function genGscData(seed) {
  const h = hash(seed)
  const totals = { clicks: 800 + (h % 3000), impressions: 20000 + (h % 60000), avgCtr: 0.02 + (h % 6) / 100, avgPosition: 8 + (h % 15) }
  const queries = ['geo 최적화', 'ai 마케팅 도구', 'seo 자동화 서비스', '마케팅 대시보드', '키워드 분석 도구', '콘텐츠 자동 생성'].map((q, i) => ({
    query: q, clicks: 20 + ((h >>> i) % 200), impressions: 500 + ((h >>> i) % 5000), ctr: 0.01 + ((h >>> i) % 8) / 100, position: 2 + ((h >>> i) % 20),
  }))
  const pages = ['/', '/blog/geo-guide', '/pricing', '/features'].map((p, i) => ({
    page: p, clicks: 40 + ((h >>> i) % 300), impressions: 1000 + ((h >>> i) % 8000), ctr: 0.015 + ((h >>> i) % 6) / 100, position: 3 + ((h >>> i) % 18),
  }))
  const aiOverviewCandidates = queries.filter((q) => q.position <= 5).slice(0, 2).map((q) => ({ ...q, page: pages[0].page, ctrDrop: 0.02 + (h % 3) / 100 }))
  const nearMissQueries = queries.filter((q) => q.position > 3 && q.position <= 10).map((q) => ({ ...q, uplift: Math.round(q.impressions * 0.1) - q.clicks }))
  return { totals, queries, pages, aiOverviewCandidates, nearMissQueries }
}
function genSov(company, industry, competitors) {
  const h = hash(company + industry)
  const prompts = [
    `${industry} 분야에서 가장 추천하는 서비스는?`,
    `1인 마케터를 위한 ${industry} 도구 알려줘`,
    `${industry} SaaS 비교해줘`,
    `스타트업이 쓰기 좋은 ${industry} 툴은?`,
    `${industry} 자동화 솔루션 추천`,
    `${industry} 무료로 시작할 수 있는 도구는?`,
  ]
  const results = prompts.map((p, i) => {
    const mentioned = ((h >>> i) % 3) !== 0
    return {
      prompt: p, mentioned,
      context: mentioned ? `${company}은(는) ${industry} 분야의 효율적인 도구로 언급됐어요.` : '',
      aiResponse: mentioned ? `${company}, 그리고 몇 가지 대안 도구들이 포함된 응답이었어요...` : `이 카테고리에서는 다른 브랜드들이 먼저 언급됐어요...`,
      competitorMentions: competitors.map((c) => ({ name: c, mentioned: ((h >>> i) % 2) === 0 })),
    }
  })
  const mentionCount = results.filter((r) => r.mentioned).length
  const competitorSummary = competitors.map((c, i) => ({ name: c, mentionCount: 1 + ((h >>> i) % 5), mentionRate: 20 + ((h >>> i) % 60) }))
  return {
    mentionRate: Math.round((mentionCount / prompts.length) * 100), mentionCount, totalPrompts: prompts.length, results, competitorSummary, prompts,
    insights: `${company}의 AI 언급율은 ${Math.round((mentionCount / prompts.length) * 100)}%예요. FAQ와 비교 콘텐츠를 늘리면 AI 답변에 인용될 확률이 높아져요.`,
  }
}
function genCompetitorCompare(my, comp) {
  const h1 = hash(my), h2 = hash(comp)
  const metrics = ['Performance', 'SEO', 'Accessibility', 'GEO Score']
  const rows = metrics.map((m, i) => ({ metric: m, mine: 40 + ((h1 >>> i) % 50), theirs: 40 + ((h2 >>> i) % 50) }))
  const geoChecks = ['llms.txt', 'JSON-LD', 'AI 봇 허용', 'Meta Description', 'Canonical URL', 'H1 태그'].map((c, i) => ({ check: c, mine: ((h1 >>> i) % 2) === 0, theirs: ((h2 >>> i) % 2) === 0 }))
  return {
    rows, geoChecks,
    summary: `${cleanUrl(my)}는 SEO와 접근성에서 우위를, ${cleanUrl(comp)}는 GEO 대응에서 앞서고 있어요. 구조화 데이터 보강이 가장 시급해요.`,
    myStrengths: ['빠른 페이지 로딩 속도', '명확한 메타 정보'],
    myWeaknesses: ['JSON-LD 구조화 데이터 부족'],
    competitorStrengths: ['풍부한 FAQ 콘텐츠', 'llms.txt 파일 보유'],
    opportunities: ['비교 콘텐츠 선점', 'FAQ 스키마 도입으로 역전 가능'],
    priorityActions: [
      { action: 'llms.txt 파일 추가', impact: 'High', effort: '낮음' },
      { action: 'FAQ 섹션 신설', impact: 'Medium', effort: '보통' },
    ],
  }
}
function genContentGap(our, comp) {
  const h1 = hash(our), h2 = hash(comp)
  const ourProfile = { origin: cleanUrl(our), wordCount: 1200 + (h1 % 2000), h2Count: 4 + (h1 % 8), hasJsonLd: (h1 % 2) === 0 }
  const compProfile = { origin: cleanUrl(comp), wordCount: 1200 + (h2 % 2000), h2Count: 4 + (h2 % 8), hasJsonLd: (h2 % 2) === 0 }
  const topicPool = ['가격 비교', '도입 사례', 'API 연동 가이드', '보안 인증', 'GEO 체크리스트', '무료 템플릿']
  const topics = topicPool.map((t, i) => ({ topic: t, competitorHas: ((h2 >>> i) % 2) === 0, ourHas: ((h1 >>> i) % 2) === 0, importance: pick(['High', 'Medium', 'Low'], h1, i), reason: `${t} 관련 검색 수요가 꾸준히 있어요.` }))
  const gapScore = Math.round((topics.filter((t) => t.competitorHas && !t.ourHas).length / topics.length) * 100)
  return {
    ourProfile, compProfile, topics, gapScore,
    summary: `경쟁사는 ${compProfile.wordCount}자, 우리는 ${ourProfile.wordCount}자 분량으로 콘텐츠를 운영 중이에요. 격차 점수 ${gapScore}점은 ${gapScore >= 50 ? '보완이 시급함' : '준수한 수준'}을 의미해요.`,
    contentRecommendations: topics.filter((t) => t.competitorHas && !t.ourHas).slice(0, 3).map((t) => ({ title: `${t.topic} 콘텐츠 제작`, keyword: t.topic, format: '블로그', reason: t.reason, estimatedImpact: t.importance })),
    ourAdvantages: topics.filter((t) => t.ourHas && !t.competitorHas).map((t) => t.topic),
  }
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
    tab: 'ga4',
    ga4: { connected: false, propertyId: '', data: null, insight: null },
    gsc: { connected: false, siteUrl: '', data: null },
    sov: { company: '', industry: '', competitorInput: '', competitors: [], result: null, history: [] },
    competitor: { mySite: '', compSite: '', result: null },
    gap: { ourUrl: '', compUrl: '', result: null },
  }
}

function Card({ children, style }) { return <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div> }
function Banner() {
  return (
    <div style={{ background: '#fff8ec', border: '1px solid #f5deb3', borderRadius: 12, padding: '10px 14px', fontSize: 12.5, color: '#7a5b1f', marginBottom: 16 }}>
      🧪 데모 모드 — 실제 Google OAuth 연동 없이 "연결하기"를 누르면 샘플 계정으로 즉시 연결돼요.
    </div>
  )
}
function StatCard({ label, value, sub }) {
  return <Card style={{ padding: 14, textAlign: 'center' }}><div style={{ fontSize: 11, color: T.muted }}>{label}</div><div style={{ fontWeight: 800, fontSize: 19 }}>{value}</div>{sub && <div style={{ fontSize: 10.5, color: T.muted }}>{sub}</div>}</Card>
}
function ConnectBox({ connected, label, desc, email, onConnect, onDisconnect }) {
  if (connected) return (
    <Card style={{ background: '#e6f4ea', border: '1px solid #b7e0c3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13 }}>✅ 연결됨: <b>{email}</b></span>
      <button onClick={onDisconnect} style={{ border: 'none', background: 'none', color: T.rose, cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}>연결 해제</button>
    </Card>
  )
  return (
    <Card style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}>
      <div style={{ fontSize: 13, marginBottom: 10 }}>{desc}</div>
      <button onClick={onConnect} style={{ padding: '9px 16px', borderRadius: 10, border: 'none', background: T.indigo, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{label}</button>
    </Card>
  )
}

function Ga4Tab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const connect = () => update({ ...data, connected: true, propertyId: '123456789' })
  const disconnect = () => update({ ...defaultState().ga4 })
  const run = () => {
    setLoading(true)
    setTimeout(() => {
      const d = genGa4Data(data.propertyId || 'demo')
      setTimeout(() => update({ ...data, data: d, insight: genInsight(d, data.propertyId || 'demo') }), 400)
    }, 500)
    setTimeout(() => setLoading(false), 900)
  }
  const d = data.data, ins = data.insight
  const maxSessions = d ? Math.max(...d.channels.map((c) => c.sessions)) : 1
  return (
    <div>
      {!data.connected ? (
        <ConnectBox connected={false} label="Google Analytics 4 연결" desc="Google 계정으로 연결하면 서비스 계정 없이 GA4 데이터를 바로 분석할 수 있어요." onConnect={connect} />
      ) : (
        <>
          <ConnectBox connected email="sample@marketerops.demo" onDisconnect={disconnect} />
          <Card style={{ margin: '12px 0' }}>
            <button onClick={run} disabled={loading} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              {loading ? '데이터 불러오는 중...' : '데이터 불러오기 + AI'}
            </button>
          </Card>
        </>
      )}
      {d && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }}>
            <StatCard label="총 세션" value={fmtNum(d.totals.sessions)} />
            <StatCard label="활성 사용자" value={fmtNum(d.totals.activeUsers)} sub={`신규 ${fmtNum(d.totals.newUsers)}`} />
            <StatCard label="평균 이탈률" value={`${(d.totals.avgBounceRate * 100).toFixed(0)}%`} />
            <StatCard label="평균 세션 시간" value={`${Math.floor(d.totals.avgSessionDuration / 60)}m ${d.totals.avgSessionDuration % 60}s`} />
          </div>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>최근 14일 세션 추이</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 70 }}>
              {d.trend.map((t, i) => (
                <div key={i} style={{ flex: 1, height: Math.max(3, (t.sessions / Math.max(...d.trend.map((x) => x.sessions))) * 70), background: T.indigo, borderRadius: 2, opacity: 0.85 }} title={`${t.date}: ${t.sessions}`} />
              ))}
            </div>
          </Card>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>채널별 세션</div>
            {d.channels.map((c) => (
              <div key={c.channel} style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>{c.channel}</span><span>{fmtNum(c.sessions)} · 전환 {c.conversions}</span></div>
                <div style={{ height: 6, background: T.surface, borderRadius: 4 }}><div style={{ height: 6, width: `${(c.sessions / maxSessions) * 100}%`, background: CHANNEL_COLORS[c.channel], borderRadius: 4 }} /></div>
              </div>
            ))}
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>기기별 분포</div>
              {d.devices.map((dv) => <div key={dv.device} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0' }}><span>{dv.device}</span><span>{Math.round((dv.sessions / d.totals.sessions) * 100)}%</span></div>)}
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>상위 페이지</div>
              {d.topPages.slice(0, 4).map((p) => <div key={p.path} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}><span>{p.path}</span><span style={{ color: p.bounceRate > 0.55 ? T.rose : T.emerald }}>{fmtNum(p.pageViews)}</span></div>)}
            </Card>
          </div>
          {ins && (
            <Card style={{ background: T.dark, color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 800 }}>🤖 AI 마케팅 건강도</div>
                <span style={{ fontWeight: 800, fontSize: 20, color: scoreColor(ins.healthScore) }}>{ins.healthScore}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                <div style={{ marginBottom: 8 }}>{ins.executiveSummary}</div>
                <div style={{ marginBottom: 6 }}><b>핵심 발견 사항</b></div>
                <ul style={{ margin: '0 0 8px', paddingLeft: 18 }}>{ins.keyFindings.map((f, i) => <li key={i} style={{ marginBottom: 3 }}>{f}</li>)}</ul>
                <div style={{ marginBottom: 8 }}><b>이번 주 Quick Win:</b> {ins.quickWins[0].action} — {ins.quickWins[0].detail} (예상 효과: {ins.quickWins[0].kpi})</div>
                <div><b>3개월 비전:</b> {ins.quarterlyVision}</div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function GscTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const connect = () => update({ ...data, connected: true, siteUrl: 'sc-domain:marketerops.demo' })
  const disconnect = () => update({ ...defaultState().gsc })
  const run = () => { setLoading(true); setTimeout(() => { update({ ...data, data: genGscData(data.siteUrl || 'demo') }); setLoading(false) }, 700) }
  const d = data.data
  return (
    <div>
      {!data.connected ? (
        <ConnectBox connected={false} label="Google Search Console 연결" desc="연결하면 검색 키워드, 노출수, 클릭률, 게재순위를 분석하고 AI Overview 피해 페이지를 자동 감지해요." onConnect={connect} />
      ) : (
        <>
          <ConnectBox connected email="sample@marketerops.demo" onDisconnect={disconnect} />
          <Card style={{ margin: '12px 0' }}>
            <button onClick={run} disabled={loading} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              {loading ? '데이터 가져오는 중...' : '검색 데이터 가져오기 (최근 28일)'}
            </button>
          </Card>
        </>
      )}
      {d && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }}>
            <StatCard label="총 클릭수" value={fmtNum(d.totals.clicks)} />
            <StatCard label="총 노출수" value={fmtNum(d.totals.impressions)} />
            <StatCard label="평균 CTR" value={`${(d.totals.avgCtr * 100).toFixed(1)}%`} />
            <StatCard label="평균 게재순위" value={d.totals.avgPosition.toFixed(1)} />
          </div>
          {d.aiOverviewCandidates.length > 0 && (
            <Card style={{ marginBottom: 12, border: `1px solid ${T.amber}55`, background: '#fff8ec' }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>⚠ AI Overview 피해 감지</div>
              <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 8 }}>순위·노출은 올랐는데 클릭이 줄었어요 — Google이 답을 직접 제공 중일 수 있어요.</div>
              {d.aiOverviewCandidates.map((q, i) => <div key={i} style={{ fontSize: 12.5, padding: '3px 0' }}>{q.page} · CTR 하락 {(q.ctrDrop * 100).toFixed(1)}%p</div>)}
            </Card>
          )}
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>클릭 기회 키워드 (Near Miss)</div>
            <div style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>순위를 조금만 올리면 클릭이 크게 늘어날 키워드예요.</div>
            {d.nearMissQueries.map((q) => (
              <div key={q.query} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0', borderBottom: `1px solid ${T.border}` }}>
                <span>{q.query}</span><span>{q.position.toFixed(1)}위 · 노출 {fmtNum(q.impressions)} · +{Math.max(0, q.uplift)} 클릭 예상</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>페이지별 검색 성과</div>
            {d.pages.map((p) => (
              <div key={p.page} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0' }}>
                <span>{p.page}</span><span>클릭 {p.clicks} · CTR {(p.ctr * 100).toFixed(1)}% · {p.position.toFixed(1)}위</span>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}

function SovTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const addCompetitor = () => {
    if (!data.competitorInput.trim()) return
    update({ ...data, competitors: [...data.competitors, data.competitorInput.trim()], competitorInput: '' })
  }
  const run = () => {
    if (!data.company.trim() || !data.industry.trim()) return
    setLoading(true)
    setTimeout(() => {
      const result = genSov(data.company, data.industry, data.competitors)
      update({ ...data, result, history: [{ company: data.company, industry: data.industry, mentionRate: result.mentionRate, timestamp: Date.now() }, ...data.history].slice(0, 10) })
      setLoading(false)
    }, 900)
  }
  const r = data.result
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>📣 AI Share of Voice</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <input value={data.company} onChange={(e) => update({ ...data, company: e.target.value })} placeholder="회사명 (예: MarketerOps)" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <input value={data.industry} onChange={(e) => update({ ...data, industry: e.target.value })} placeholder="업종/카테고리 (예: AI 마케팅 SaaS)" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input value={data.competitorInput} onChange={(e) => update({ ...data, competitorInput: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addCompetitor()} placeholder="경쟁사 이름 입력 후 Enter" style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {data.competitors.map((c, i) => <span key={c} style={{ padding: '4px 10px', borderRadius: 999, background: T.surface, fontSize: 12 }}>{c} <span onClick={() => update({ ...data, competitors: data.competitors.filter((_, j) => j !== i) })} style={{ cursor: 'pointer', color: T.rose }}>×</span></span>)}
        </div>
        <button onClick={run} disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? '프롬프트 분석 중...' : 'AI Share of Voice 측정 시작'}
        </button>
      </Card>
      {r && (
        <>
          <Card style={{ marginBottom: 12, textAlign: 'center' }}>
            <svg width={120} height={120}>
              <circle cx={60} cy={60} r={50} fill="none" stroke={T.border} strokeWidth={10} />
              <circle cx={60} cy={60} r={50} fill="none" stroke={scoreColor(r.mentionRate, 70, 40)} strokeWidth={10} strokeDasharray={2 * Math.PI * 50} strokeDashoffset={2 * Math.PI * 50 * (1 - r.mentionRate / 100)} strokeLinecap="round" transform="rotate(-90 60 60)" />
              <text x={60} y={66} textAnchor="middle" fontSize={26} fontWeight={800} fill={scoreColor(r.mentionRate, 70, 40)}>{r.mentionRate}%</text>
            </svg>
            <div style={{ fontSize: 12, color: T.muted }}>AI 언급율 ({r.mentionCount}/{r.totalPrompts})</div>
          </Card>
          {r.competitorSummary.length > 0 && (
            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>브랜드별 AI 언급율 비교</div>
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 12, marginBottom: 2 }}>{data.company} (우리)</div>
                <div style={{ height: 8, background: T.surface, borderRadius: 4 }}><div style={{ height: 8, width: `${r.mentionRate}%`, background: T.text, borderRadius: 4 }} /></div>
              </div>
              {r.competitorSummary.map((c) => (
                <div key={c.name} style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 12, marginBottom: 2 }}>{c.name}</div>
                  <div style={{ height: 8, background: T.surface, borderRadius: 4 }}><div style={{ height: 8, width: `${c.mentionRate}%`, background: T.muted, borderRadius: 4 }} /></div>
                </div>
              ))}
            </Card>
          )}
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>프롬프트별 언급 결과</div>
            {r.results.map((res, i) => (
              <div key={i} style={{ padding: '6px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12.5 }}>
                <div>{res.mentioned ? '✅' : '❌'} {res.prompt}</div>
                {res.mentioned && <div style={{ color: T.muted, fontSize: 11.5, marginTop: 2 }}>{res.context}</div>}
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>AI 가시성 개선 인사이트</div>
            <div style={{ fontSize: 12.5, color: T.muted }}>{r.insights}</div>
          </Card>
        </>
      )}
    </div>
  )
}

function CompetitorTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const run = () => {
    if (!data.mySite.trim() || !data.compSite.trim()) return
    setLoading(true)
    setTimeout(() => { update({ ...data, result: genCompetitorCompare(data.mySite, data.compSite) }); setLoading(false) }, 900)
  }
  const r = data.result
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>⚔️ 경쟁사 비교 분석</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <input value={data.mySite} onChange={(e) => update({ ...data, mySite: e.target.value })} placeholder="내 사이트 https://mysite.com" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.indigo}88` }} />
          <input value={data.compSite} onChange={(e) => update({ ...data, compSite: e.target.value })} placeholder="경쟁사 사이트 https://competitor.com" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.rose}88` }} />
        </div>
        <button onClick={run} disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? 'AI 경쟁 분석 중...' : '경쟁사 비교 분석 시작'}
        </button>
      </Card>
      {r && (
        <>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>점수 비교</div>
            {r.rows.map((row) => (
              <div key={row.metric} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12.5 }}>
                <span style={{ textAlign: 'right', color: scoreColor(row.mine) }}>{row.mine}</span>
                <span style={{ color: T.muted, fontSize: 11 }}>{row.metric}</span>
                <span style={{ color: scoreColor(row.theirs) }}>{row.theirs}</span>
              </div>
            ))}
          </Card>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>GEO 체크리스트 비교</div>
            {r.geoChecks.map((c) => (
              <div key={c.check} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0' }}>
                <span>{c.check}</span>
                <span>{c.mine ? '✅' : '❌'} vs {c.theirs ? '✅' : '❌'}</span>
              </div>
            ))}
          </Card>
          <Card style={{ marginBottom: 12, background: T.dark, color: '#fff' }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>AI 종합 진단</div>
            <div style={{ fontSize: 13 }}>{r.summary}</div>
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: T.emerald, marginBottom: 6 }}>내 사이트 강점</div>
              {r.myStrengths.map((s, i) => <div key={i} style={{ fontSize: 12 }}>✓ {s}</div>)}
              <div style={{ fontWeight: 700, fontSize: 12.5, color: T.amber, marginTop: 8, marginBottom: 6 }}>보완 필요</div>
              {r.myWeaknesses.map((s, i) => <div key={i} style={{ fontSize: 12 }}>△ {s}</div>)}
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: T.rose, marginBottom: 6 }}>경쟁사 강점</div>
              {r.competitorStrengths.map((s, i) => <div key={i} style={{ fontSize: 12 }}>↗ {s}</div>)}
              <div style={{ fontWeight: 700, fontSize: 12.5, color: T.indigo, marginTop: 8, marginBottom: 6 }}>역전 기회</div>
              {r.opportunities.map((s, i) => <div key={i} style={{ fontSize: 12 }}>⚡ {s}</div>)}
            </Card>
          </div>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>우선순위 실행 액션</div>
            {r.priorityActions.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0' }}>
                <span>{i + 1}. {a.action}</span>
                <span style={{ color: a.impact === 'High' ? T.rose : T.amber }}>{a.impact} · {a.effort}</span>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}

function GapTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const run = () => {
    if (!data.ourUrl.trim() || !data.compUrl.trim()) return
    setLoading(true)
    setTimeout(() => { update({ ...data, result: genContentGap(data.ourUrl, data.compUrl) }); setLoading(false) }, 900)
  }
  const r = data.result
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>🕳️ 경쟁사 콘텐츠 갭 분석</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <input value={data.ourUrl} onChange={(e) => update({ ...data, ourUrl: e.target.value })} placeholder="우리 사이트 URL" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <input value={data.compUrl} onChange={(e) => update({ ...data, compUrl: e.target.value })} placeholder="경쟁사 URL" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
        </div>
        <button onClick={run} disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? '분석 중...' : '갭 분석 시작'}
        </button>
      </Card>
      {r && (
        <>
          <Card style={{ marginBottom: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: T.muted }}>콘텐츠 갭 점수</div>
            <div style={{ fontWeight: 800, fontSize: 32, color: scoreColor(100 - r.gapScore, 60, 30) }}>{r.gapScore}</div>
            <div style={{ fontSize: 11, color: T.muted }}>100에 가까울수록 격차 큼</div>
          </Card>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>사이트 지표 비교</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '3px 0' }}><span>단어 수</span><span>{r.ourProfile.wordCount} (우리) vs {r.compProfile.wordCount} (경쟁사)</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '3px 0' }}><span>H2 개수</span><span>{r.ourProfile.h2Count} (우리) vs {r.compProfile.h2Count} (경쟁사)</span></div>
          </Card>
          <Card style={{ marginBottom: 12, background: T.dark, color: '#fff' }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>AI 분석 요약</div>
            <div style={{ fontSize: 13 }}>{r.summary}</div>
          </Card>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>경쟁사만 다루는 주제</div>
            {r.topics.filter((t) => t.competitorHas && !t.ourHas).map((t) => (
              <div key={t.topic} style={{ padding: '5px 0', fontSize: 12.5 }}>🔴 {t.topic} <span style={{ color: T.muted, fontSize: 11 }}>({t.importance})</span></div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>콘텐츠 제작 추천</div>
            {r.contentRecommendations.map((c, i) => (
              <div key={i} style={{ padding: '5px 0', fontSize: 12.5 }}>{i + 1}. {c.title} — 키워드: {c.keyword} (기대 효과 {c.estimatedImpact})</div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}

export default function MarketerOpsChannelsDemo() {
  const [state, setState] = useState(null)
  useEffect(() => { setState(loadState()) }, [])
  useEffect(() => {
    if (!state) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* private mode */ }
  }, [state])
  if (!state) return null

  const TABS = [
    { key: 'ga4', label: '📈 GA4' },
    { key: 'gsc', label: '🔎 Search Console' },
    { key: 'sov', label: '📣 SOV' },
    { key: 'competitor', label: '⚔️ 경쟁사 비교' },
    { key: 'gap', label: '🕳️ 콘텐츠 갭' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: T.surface, color: T.text, fontFamily: "'Noto Sans KR', -apple-system, sans-serif" }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: T.bg, borderBottom: `1px solid ${T.border}`, padding: '14px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>MarketerOps 채널 분석</div>
            <div style={{ fontSize: 12, color: T.muted }}>GA4 · Search Console · Share of Voice · 경쟁사 비교</div>
          </div>
          <Link href="/portfolio" style={{ fontSize: 12.5, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        <Banner />
        <div style={{ display: 'flex', gap: 4, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 4, marginBottom: 16, flexWrap: 'wrap', width: 'fit-content' }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setState({ ...state, tab: t.key })} style={{
              padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              background: state.tab === t.key ? T.text : 'transparent', color: state.tab === t.key ? '#fff' : T.muted,
            }}>{t.label}</button>
          ))}
        </div>
        {state.tab === 'ga4' && <Ga4Tab data={state.ga4} update={(d) => setState({ ...state, ga4: d })} />}
        {state.tab === 'gsc' && <GscTab data={state.gsc} update={(d) => setState({ ...state, gsc: d })} />}
        {state.tab === 'sov' && <SovTab data={state.sov} update={(d) => setState({ ...state, sov: d })} />}
        {state.tab === 'competitor' && <CompetitorTab data={state.competitor} update={(d) => setState({ ...state, competitor: d })} />}
        {state.tab === 'gap' && <GapTab data={state.gap} update={(d) => setState({ ...state, gap: d })} />}
      </div>
    </div>
  )
}
