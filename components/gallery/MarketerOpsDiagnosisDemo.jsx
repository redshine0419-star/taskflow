'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const T = {
  bg: '#ffffff', surface: '#f6f8fa', border: '#eaeef2', text: '#24292f', muted: '#57606a',
  indigo: '#6366f1', emerald: '#10b981', amber: '#f59e0b', rose: '#ef4444', purple: '#8b5cf6',
  blue: '#0969da', dark: '#0d1117',
}
const STORAGE_KEY = 'tf_marketerops_diagnosis_demo_v1'

function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
function scoreColor(score, good = 80, warn = 50) { return score >= good ? T.emerald : score >= warn ? T.amber : T.rose }
function gradeOf(score) { return score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D' }
function gradeColor(g) { return g === 'A+' || g === 'A' ? T.emerald : g === 'B' ? T.blue : g === 'C' ? T.amber : T.rose }

function cleanUrl(u) {
  try { return new URL(u.startsWith('http') ? u : `https://${u}`).origin } catch { return u }
}

function genDiagnosis(rawUrl) {
  const url = cleanUrl(rawUrl)
  const h = hash(url)
  const base = 40 + (h % 55)
  const scores = {
    performance: Math.min(99, base + ((h >>> 2) % 15) - 5),
    seo: Math.min(99, base + ((h >>> 4) % 20) - 8),
    accessibility: Math.min(99, base + ((h >>> 6) % 18)),
    geo: Math.min(99, base + ((h >>> 8) % 25) - 10),
  }
  Object.keys(scores).forEach((k) => { scores[k] = Math.max(20, scores[k]) })
  const vitals = {
    LCP: (1.2 + (h % 30) / 10).toFixed(1) + 's',
    FID: (10 + (h % 90)) + 'ms',
    CLS: ((h % 25) / 100).toFixed(2),
  }
  const secHeaders = ['HSTS', 'CSP', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']
  const secPresent = secHeaders.map((_, i) => ((h >>> i) & 1) === 1)
  const secScore = Math.round((secPresent.filter(Boolean).length / secHeaders.length) * 100)
  const contentChecklist = [
    { label: '키워드가 본문에 3회 이상 등장', ok: (h % 3) !== 0 },
    { label: '권위 있는 외부 링크 포함', ok: (h % 4) !== 0 },
    { label: 'FAQ 섹션 존재', ok: (h % 5) === 0 },
    { label: 'H2 밀도 적정 (300단어당 1개 이상)', ok: (h % 2) === 0 },
  ]
  const passCount = 12 + (h % 10)
  const issues = [
    { title: '메타 설명 길이 부적절', detail: '70~160자 권장 범위를 벗어났어요.', impact: 'Medium' },
    { title: 'llms.txt 파일 없음', detail: 'AI 크롤러에게 사이트 정보를 안내할 파일이 없어요.', impact: (h % 2) ? 'High' : 'Medium' },
    { title: 'JSON-LD 구조화 데이터 없음', detail: '리치 스니펫 노출 기회를 놓치고 있어요.', impact: 'Low' },
  ].filter((_, i) => (h >>> i) % 2 === 0 || i === 0)
  const opportunities = [
    { title: '이미지 지연 로딩 적용', description: '초기 로딩 속도를 개선할 수 있어요.' },
    { title: '사용하지 않는 JS 제거', description: '번들 크기를 줄여 성능 점수를 높일 수 있어요.' },
  ]
  return { url, scores, vitals, secScore, secGrade: gradeOf(secScore), secPresent, secHeaders, contentChecklist, contentScore: Math.round((contentChecklist.filter((c) => c.ok).length / contentChecklist.length) * 100), passCount, totalChecks: 22, issues, opportunities }
}

function genAdvice(d) {
  const worst = Object.entries(d.scores).sort((a, b) => a[1] - b[1])[0]
  const label = { performance: '성능', seo: 'SEO', accessibility: '접근성', geo: 'GEO' }[worst[0]]
  return {
    immediate: `가장 시급한 영역은 ${label}이에요 (${worst[1]}점). ${d.issues[0]?.title || '메타 정보'}부터 손보면 빠르게 점수를 끌어올릴 수 있어요.`,
    midterm: `콘텐츠 체크리스트 통과율이 ${d.contentScore}%예요. FAQ 섹션과 권위 링크를 보강하면 체류시간과 신뢰도가 함께 올라가요.`,
    geo: `llms.txt와 JSON-LD를 추가하면 AI 검색·챗봇 답변에 인용될 확률이 높아져요. GEO 점수 ${d.scores.geo}점은 업계 평균보다 ${d.scores.geo > 60 ? '높은' : '낮은'} 편이에요.`,
  }
}

function genAiSearchQuality(brandName) {
  const h = hash(brandName || 'brand')
  const QS = [
    `${brandName} 같은 서비스 중에 뭐가 제일 나아?`,
    `1인 마케터에게 추천하는 도구는?`,
    `GEO 최적화를 해주는 SaaS 알려줘`,
    `SEO와 콘텐츠를 한번에 관리하는 툴은?`,
    `스타트업 마케팅 자동화 도구 추천해줘`,
  ]
  const tones = ['positive', 'neutral', 'negative', 'not_mentioned']
  const questions = QS.map((q, i) => {
    const t = pick(tones, h, i)
    const mentioned = t !== 'not_mentioned'
    return {
      question: q, tone: t, isMentioned: mentioned, isRecommended: t === 'positive',
      score: mentioned ? 12 + ((h >>> i) % 8) : 2 + (h % 4),
      analysis: mentioned ? `${brandName}이(가) 답변에 언급됐어요.` : `이 질문에는 언급되지 않았어요.`,
      answer: mentioned ? `${brandName}은 실시간 진단과 AI 콘텐츠 생성을 함께 제공하는 도구로 알려져 있어요...` : `이 카테고리에서는 다른 도구들이 먼저 언급되는 경향이 있어요...`,
    }
  })
  const mentionCount = questions.filter((q) => q.isMentioned).length
  const recommendCount = questions.filter((q) => q.isRecommended).length
  const geoSignals = [
    { label: 'llms.txt 존재', status: (h % 2) ? 'good' : 'missing', detail: 'AI 크롤러 안내 파일' },
    { label: 'JSON-LD 구조화 데이터', status: (h % 3) ? 'good' : 'warning', detail: '조직·상품 스키마' },
    { label: 'FAQ 스키마', status: (h % 2) ? 'warning' : 'good', detail: '질문-답변 구조' },
    { label: 'AI 봇 크롤링 허용', status: 'good', detail: 'robots.txt에서 차단하지 않음' },
  ]
  return {
    overallScore: Math.round((mentionCount / 5) * 60 + (recommendCount / 5) * 40),
    mentionCount, recommendCount, questions, geoSignals,
    recommendations: [
      { priority: 1, title: 'FAQ 콘텐츠 확대', detail: '자주 묻는 질문 10개를 구조화된 형식으로 추가하세요.' },
      { priority: 2, title: '비교 콘텐츠 제작', detail: '경쟁 서비스와의 비교 글은 AI 답변에 자주 인용돼요.' },
      { priority: 3, title: 'llms.txt 배포', detail: 'AI가 브랜드를 정확히 이해하도록 안내 파일을 추가하세요.' },
    ],
  }
}

function pick(arr, h, salt = 0) { return arr[(h + salt) % arr.length] }

function genBulkGeo(siteUrl) {
  const h = hash(cleanUrl(siteUrl))
  const paths = ['/', '/about', '/pricing', '/blog', '/blog/post-1', '/features', '/contact', '/docs', '/blog/post-2', '/faq']
  const pages = paths.map((p, i) => {
    const score = Math.max(15, 30 + ((h >>> i) % 65))
    return {
      url: p, score, wordCount: 200 + ((h >>> i) % 1500),
      hasJsonLd: ((h >>> i) & 1) === 0, hasOg: ((h >>> (i + 1)) & 1) === 0, hasCanonical: ((h >>> (i + 2)) & 1) === 0,
      issues: score < 50 ? [{ title: 'JSON-LD 없음', impact: 'High' }, { title: 'H2 부족', impact: 'Medium' }] : score < 75 ? [{ title: '메타 설명 길이', impact: 'Low' }] : [],
    }
  })
  const avg = Math.round(pages.reduce((s, p) => s + p.score, 0) / pages.length)
  const dist = { good: pages.filter((p) => p.score >= 70).length, warning: pages.filter((p) => p.score >= 40 && p.score < 70).length, critical: pages.filter((p) => p.score < 40).length }
  return {
    siteUrl: cleanUrl(siteUrl), totalUrls: pages.length, analyzedUrls: pages.length, avgScore: avg, distribution: dist, pages,
    topIssues: [
      { title: 'JSON-LD 구조화 데이터 누락', count: pages.filter((p) => !p.hasJsonLd).length, impact: 'High' },
      { title: '메타 설명 길이 부적절', count: Math.round(pages.length * 0.4), impact: 'Medium' },
    ],
    aiRecommendations: [
      { priority: 1, title: '핵심 페이지에 FAQ 스키마 추가', detail: '전환율이 높은 페이지부터 우선 적용하세요.' },
      { priority: 2, title: '블로그 글에 JSON-LD Article 스키마 적용', detail: '검색 결과 리치 스니펫 노출을 높여요.' },
    ],
  }
}

function genLlmsTxt(f) {
  return `# ${f.name || '브랜드명'}\n> ${f.description || '브랜드 설명을 입력하세요.'}\n\n## Services\n${(f.services || '서비스1, 서비스2').split(',').map((s) => `- ${s.trim()}`).join('\n')}\n\n## Target Audience\n${f.audience || '타겟 고객층'}\n\n## Important URLs\n${f.urls || 'https://example.com'}\n\n## Instructions for AI\n${f.instructions || '이 브랜드에 대해 정확하고 중립적으로 답변해 주세요.'}\n\n## Disallow\n${f.blocked || '/admin, /internal'}\n`
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
    tab: 'diagnosis', url: '', diagResult: null, advice: null,
    aiSearch: { brandUrl: '', brandName: '', result: null },
    bulk: { input: '', result: null },
    llmstxt: { form: { name: '', description: '', services: '', audience: '', urls: '', instructions: '', blocked: '' }, result: null },
    history: [],
  }
}

function Card({ children, style }) {
  return <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div>
}
function Banner() {
  return (
    <div style={{ background: '#fff8ec', border: '1px solid #f5deb3', borderRadius: 12, padding: '10px 14px', fontSize: 12.5, color: '#7a5b1f', marginBottom: 16 }}>
      🧪 데모 모드 — 실제 PageSpeed·AI 호출 없이 URL을 해시해 만든 샘플 진단 결과예요.
    </div>
  )
}
function ScoreRing({ label, score }) {
  const color = scoreColor(score)
  const r = 30, c = 2 * Math.PI * r
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={76} height={76}>
        <circle cx={38} cy={38} r={r} fill="none" stroke={T.border} strokeWidth={7} />
        <circle cx={38} cy={38} r={r} fill="none" stroke={color} strokeWidth={7} strokeDasharray={c} strokeDashoffset={c - (score / 100) * c} strokeLinecap="round" transform="rotate(-90 38 38)" />
        <text x={38} y={43} textAnchor="middle" fontSize={18} fontWeight={800} fill={color}>{score}</text>
      </svg>
      <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{label}</div>
    </div>
  )
}

function DiagnosisTab({ state, update }) {
  const [loading, setLoading] = useState(false)
  const run = () => {
    if (!state.url.trim()) return
    setLoading(true)
    setTimeout(() => {
      const d = genDiagnosis(state.url)
      const advice = genAdvice(d)
      const rec = { url: d.url, timestamp: Date.now(), scores: d.scores }
      update({ ...state, diagResult: d, advice, history: [rec, ...state.history].slice(0, 20) })
      setLoading(false)
    }, 800)
  }
  const d = state.diagResult
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>🩺 사이트 진단</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={state.url} onChange={(e) => update({ ...state, url: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="진단할 URL 입력 (예: https://mysite.com)" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
          <button onClick={run} disabled={loading} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? '분석 중...' : '진단 시작'}
          </button>
        </div>
      </Card>
      {d && (
        <>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'space-around', flexWrap: 'wrap' }}>
              <ScoreRing label="Performance" score={d.scores.performance} />
              <ScoreRing label="SEO" score={d.scores.seo} />
              <ScoreRing label="Accessibility" score={d.scores.accessibility} />
              <ScoreRing label="GEO Visibility" score={d.scores.geo} />
            </div>
          </Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>보안 헤더</div>
                <span style={{ fontWeight: 800, color: gradeColor(d.secGrade), fontSize: 14 }}>{d.secGrade}</span>
              </div>
              {d.secHeaders.map((h, i) => (
                <div key={h} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0' }}>
                  <span>{h}</span>
                  <span style={{ color: d.secPresent[i] ? T.emerald : T.rose }}>{d.secPresent[i] ? '✓ 적용' : '✕ 없음'}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>콘텐츠 품질 ({d.contentScore}점)</div>
              {d.contentChecklist.map((c) => (
                <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '4px 0' }}>
                  <span>{c.label}</span>
                  <span style={{ color: c.ok ? T.emerald : T.amber }}>{c.ok ? '✓' : '△'}</span>
                </div>
              ))}
            </Card>
          </div>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Core Web Vitals</div>
            <div style={{ display: 'flex', gap: 16 }}>
              {Object.entries(d.vitals).map(([k, v]) => (
                <div key={k} style={{ background: T.surface, borderRadius: 10, padding: '10px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: T.muted }}>{k}</div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>SEO &amp; GEO 체크리스트 — {d.passCount} / {d.totalChecks} passed</div>
            <div style={{ height: 6, background: T.surface, borderRadius: 4 }}>
              <div style={{ height: 6, width: `${(d.passCount / d.totalChecks) * 100}%`, background: T.indigo, borderRadius: 4 }} />
            </div>
          </Card>
          <Card style={{ marginBottom: 12, background: T.dark, color: '#fff' }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>🤖 AI Advisor</div>
            <div style={{ fontSize: 13, lineHeight: 1.8 }}>
              <div style={{ marginBottom: 8 }}><b>즉시 실행:</b> {state.advice.immediate}</div>
              <div style={{ marginBottom: 8 }}><b>중기 전략:</b> {state.advice.midterm}</div>
              <div><b>GEO 전략:</b> {state.advice.geo}</div>
            </div>
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>빠른 개선 패치</div>
            {d.issues.map((iss, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < d.issues.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 12.5 }}>{iss.title}</div>
                  <div style={{ fontSize: 11.5, color: T.muted }}>{iss.detail}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: iss.impact === 'High' ? T.rose : iss.impact === 'Medium' ? T.amber : T.muted, background: T.surface, padding: '2px 8px', borderRadius: 999 }}>{iss.impact}</span>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}

function AiSearchTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const [openIdx, setOpenIdx] = useState(null)
  const run = () => {
    if (!data.brandName.trim()) return
    setLoading(true)
    setTimeout(() => { update({ ...data, result: genAiSearchQuality(data.brandName) }); setLoading(false) }, 700)
  }
  const r = data.result
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>🤖 AI 검색 품질 진단</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <input value={data.brandUrl} onChange={(e) => update({ ...data, brandUrl: e.target.value })} placeholder="사이트 URL" style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
          <input value={data.brandName} onChange={(e) => update({ ...data, brandName: e.target.value })} placeholder="브랜드명" style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
        </div>
        <button onClick={run} disabled={loading} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? '5개 AI 질문 시뮬레이션 중...' : 'AI 검색 품질 진단 시작'}
        </button>
      </Card>
      {r && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 12 }}>
            <Card style={{ textAlign: 'center' }}><ScoreRing label="종합 점수" score={r.overallScore} /></Card>
            <Card style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 11.5, color: T.muted }}>AI 언급 횟수</div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>{r.mentionCount}/5</div>
            </Card>
            <Card style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 11.5, color: T.muted }}>추천 포함</div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>{r.recommendCount}/5</div>
            </Card>
          </div>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>GEO 최적화 신호</div>
            {r.geoSignals.map((g) => (
              <div key={g.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0' }}>
                <span>{g.status === 'good' ? '✅' : g.status === 'warning' ? '⚠️' : '❌'} {g.label}</span>
                <span style={{ color: T.muted }}>{g.detail}</span>
              </div>
            ))}
          </Card>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>AI 추천 사항</div>
            {r.recommendations.map((rc) => (
              <div key={rc.priority} style={{ display: 'flex', gap: 10, padding: '6px 0' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: T.indigo, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{rc.priority}</span>
                <div><div style={{ fontWeight: 700, fontSize: 12.5 }}>{rc.title}</div><div style={{ fontSize: 11.5, color: T.muted }}>{rc.detail}</div></div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>시뮬레이션된 AI Q&amp;A</div>
            {r.questions.map((q, i) => (
              <div key={i} style={{ borderBottom: i < r.questions.length - 1 ? `1px solid ${T.border}` : 'none', padding: '8px 0' }}>
                <div onClick={() => setOpenIdx(openIdx === i ? null : i)} style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ fontSize: 12.5 }}>{q.isRecommended ? '✅' : q.isMentioned ? '➖' : '❌'} {q.question}</span>
                  <span style={{ fontSize: 11, color: T.muted }}>{q.score}/20</span>
                </div>
                {openIdx === i && (
                  <div style={{ marginTop: 8, background: T.surface, padding: 10, borderRadius: 8, fontSize: 12 }}>
                    <div style={{ marginBottom: 4, color: T.muted }}>{q.analysis}</div>
                    <div>{q.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}

function BulkGeoTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const run = () => {
    if (!data.input.trim()) return
    setLoading(true)
    setTimeout(() => { update({ ...data, result: genBulkGeo(data.input) }); setLoading(false) }, 900)
  }
  const r = data.result
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>📑 대량 GEO 스캔</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={data.input} onChange={(e) => update({ ...data, input: e.target.value })}
            placeholder="https://example.com 또는 sitemap.xml URL" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
          <button onClick={run} disabled={loading} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            {loading ? '스캔 중...' : '스캔 시작'}
          </button>
        </div>
      </Card>
      {r && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
            <Card style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: T.muted }}>평균 점수</div><div style={{ fontWeight: 800, fontSize: 22, color: scoreColor(r.avgScore, 70, 40) }}>{r.avgScore}</div></Card>
            <Card style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: T.muted }}>양호</div><div style={{ fontWeight: 800, fontSize: 22, color: T.emerald }}>{r.distribution.good}</div></Card>
            <Card style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: T.muted }}>주의</div><div style={{ fontWeight: 800, fontSize: 22, color: T.amber }}>{r.distribution.warning}</div></Card>
            <Card style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: T.muted }}>위험</div><div style={{ fontWeight: 800, fontSize: 22, color: T.rose }}>{r.distribution.critical}</div></Card>
          </div>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>공통 이슈</div>
            {r.topIssues.map((iss) => (
              <div key={iss.title} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3 }}>
                  <span>{iss.title}</span><span style={{ color: T.muted }}>{iss.count}/{r.analyzedUrls} pages</span>
                </div>
                <div style={{ height: 5, background: T.surface, borderRadius: 4 }}><div style={{ height: 5, width: `${(iss.count / r.analyzedUrls) * 100}%`, background: iss.impact === 'High' ? T.rose : T.amber, borderRadius: 4 }} /></div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>페이지별 점수 ({r.pages.length}개)</div>
            {r.pages.map((p) => (
              <div key={p.url} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${T.border}` }}>
                <span style={{ width: 34, height: 22, borderRadius: 6, background: scoreColor(p.score, 70, 40), color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.score}</span>
                <span style={{ fontSize: 12.5, flex: 1 }}>{p.url}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{p.wordCount}자</span>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  )
}

function LlmsTxtTab({ data, update }) {
  const f = data.form
  const setF = (k, v) => update({ ...data, form: { ...f, [k]: v } })
  const generate = () => update({ ...data, result: genLlmsTxt(f) })
  const download = () => {
    const blob = new Blob([data.result], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'llms.txt'
    a.click()
  }
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>📄 llms.txt 생성기</div>
        <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 14 }}><b>llms.txt란?</b> AI 검색·챗봇이 브랜드를 정확히 이해하도록 안내하는 표준 파일이에요.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <input value={f.name} onChange={(e) => setF('name', e.target.value)} placeholder="브랜드 이름 *" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <input value={f.services} onChange={(e) => setF('services', e.target.value)} placeholder="서비스 (쉼표 구분)" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <textarea value={f.description} onChange={(e) => setF('description', e.target.value)} placeholder="브랜드 설명 *" rows={2} style={{ gridColumn: '1 / -1', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, fontFamily: 'inherit' }} />
          <input value={f.audience} onChange={(e) => setF('audience', e.target.value)} placeholder="타겟 고객층" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <input value={f.urls} onChange={(e) => setF('urls', e.target.value)} placeholder="주요 URL" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <input value={f.blocked} onChange={(e) => setF('blocked', e.target.value)} placeholder="비공개 경로 (/admin, /internal)" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <input value={f.instructions} onChange={(e) => setF('instructions', e.target.value)} placeholder="AI에게 전달할 지침" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
        </div>
        <button onClick={generate} disabled={!f.name || !f.description} style={{ marginTop: 14, width: '100%', padding: 12, borderRadius: 10, border: 'none', background: T.text, color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: (!f.name || !f.description) ? 0.5 : 1 }}>
          ✨ llms.txt 생성
        </button>
      </Card>
      {data.result && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>생성 결과</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigator.clipboard?.writeText(data.result)} style={{ border: 'none', background: 'none', color: T.indigo, cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}>복사</button>
              <button onClick={download} style={{ border: 'none', background: 'none', color: T.indigo, cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}>다운로드</button>
            </div>
          </div>
          <pre style={{ background: T.dark, color: '#4ade80', padding: 16, borderRadius: 10, fontSize: 12, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{data.result}</pre>
        </Card>
      )}
    </div>
  )
}

function HistoryTab({ history }) {
  if (!history.length) return <Card><div style={{ textAlign: 'center', color: T.muted, padding: 30 }}>아직 진단 기록이 없어요. "사이트 진단" 탭에서 먼저 진단을 실행해보세요.</div></Card>
  const recent = history.slice(0, 7).reverse()
  const latest = history[0]
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
        <Card style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: T.muted }}>총 진단 횟수</div><div style={{ fontWeight: 800, fontSize: 22 }}>{history.length}</div></Card>
        <Card style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: T.muted }}>최고 SEO</div><div style={{ fontWeight: 800, fontSize: 22, color: T.emerald }}>{Math.max(...history.map((h) => h.scores.seo))}</div></Card>
        <Card style={{ textAlign: 'center' }}><div style={{ fontSize: 11, color: T.muted }}>최고 GEO</div><div style={{ fontWeight: 800, fontSize: 22, color: T.amber }}>{Math.max(...history.map((h) => h.scores.geo))}</div></Card>
      </div>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>점수 추이 (최근 {recent.length}건)</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {recent.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: 90 }}>
                <div style={{ width: 22, height: Math.max(4, (h.scores.performance / 100) * 90), background: T.indigo, borderRadius: '4px 4px 0 0' }} title={`Performance ${h.scores.performance}`} />
              </div>
              <div style={{ fontSize: 9, color: T.muted }}>{h.scores.performance}</div>
            </div>
          ))}
        </div>
      </Card>
      {latest && (
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>최근 진단 상세 — {latest.url}</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {Object.entries(latest.scores).map(([k, v]) => <ScoreRing key={k} label={k} score={v} />)}
          </div>
        </Card>
      )}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>최근 기록</div>
        {history.slice(0, 8).map((h, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12.5 }}>
            <span>{h.url}</span>
            <span style={{ display: 'flex', gap: 6 }}>
              <span style={{ color: scoreColor(h.scores.performance) }}>P{h.scores.performance}</span>
              <span style={{ color: scoreColor(h.scores.seo) }}>S{h.scores.seo}</span>
              <span style={{ color: scoreColor(h.scores.geo) }}>G{h.scores.geo}</span>
            </span>
          </div>
        ))}
      </Card>
    </div>
  )
}

export default function MarketerOpsDiagnosisDemo() {
  const [state, setState] = useState(null)
  useEffect(() => { setState(loadState()) }, [])
  useEffect(() => {
    if (!state) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* private mode */ }
  }, [state])
  if (!state) return null

  const TABS = [
    { key: 'diagnosis', label: '🩺 사이트 진단' },
    { key: 'aisearch', label: '🤖 AI 검색 품질' },
    { key: 'bulk', label: '📑 대량 GEO 스캔' },
    { key: 'llmstxt', label: '📄 llms.txt' },
    { key: 'history', label: '📊 진단 이력' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: T.surface, color: T.text, fontFamily: "'Noto Sans KR', -apple-system, sans-serif" }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: T.bg, borderBottom: `1px solid ${T.border}`, padding: '14px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>MarketerOps 진단·AI 어드바이저</div>
            <div style={{ fontSize: 12, color: T.muted }}>사이트 진단 · AI 검색 품질 · 대량 GEO 스캔 · llms.txt</div>
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
        {state.tab === 'diagnosis' && <DiagnosisTab state={state} update={setState} />}
        {state.tab === 'aisearch' && <AiSearchTab data={state.aiSearch} update={(d) => setState({ ...state, aiSearch: d })} />}
        {state.tab === 'bulk' && <BulkGeoTab data={state.bulk} update={(d) => setState({ ...state, bulk: d })} />}
        {state.tab === 'llmstxt' && <LlmsTxtTab data={state.llmstxt} update={(d) => setState({ ...state, llmstxt: d })} />}
        {state.tab === 'history' && <HistoryTab history={state.history} />}
      </div>
    </div>
  )
}
