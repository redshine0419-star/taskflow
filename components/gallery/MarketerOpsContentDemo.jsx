'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const T = {
  bg: '#ffffff', surface: '#f6f8fa', border: '#eaeef2', text: '#24292f', muted: '#57606a',
  indigo: '#6366f1', emerald: '#10b981', amber: '#f59e0b', rose: '#ef4444', purple: '#8b5cf6',
  blue: '#0969da', pink: '#ec4899', dark: '#0d1117',
}
const STORAGE_KEY = 'tf_marketerops_content_demo_v1'

const CHANNELS = [
  { key: 'blog', icon: '📝', label: '블로그', title: 'SEO 최적화 블로그 본문', color: T.indigo },
  { key: 'social', icon: '📸', label: '인스타그램', title: '인스타그램 카드뉴스 기획', color: T.pink },
  { key: 'newsletter', icon: '✉️', label: '뉴스레터', title: '고객 맞춤 이메일 뉴스레터', color: T.blue },
  { key: 'ads', icon: '📣', label: '광고카피', title: '퍼포먼스 광고 카피 (A/B)', color: T.purple },
]
const TONES = [
  { key: 'friendly', label: '친근한' },
  { key: 'professional', label: '전문적' },
  { key: 'humorous', label: '유머러스' },
  { key: 'emotional', label: '감성적' },
]
const GOALS = [
  { key: 'seo', label: 'SEO 최적화', desc: '검색 노출을 높이는 키워드·구조 개선', color: T.indigo },
  { key: 'geo', label: 'GEO 최적화', desc: 'AI 언어모델 인용·학습에 최적화', color: T.purple },
  { key: 'readability', label: '가독성 개선', desc: '문장을 짧고 명확하게 재구성', color: T.emerald },
  { key: 'concise', label: '간결하게', desc: '핵심만 남기고 분량 30~50% 절감', color: T.amber },
]
const INTENTS = [
  { key: '거래형', color: T.emerald, desc: '지금 바로 구매·가입·문의로 이어질 가능성이 높은 키워드예요.' },
  { key: '정보형', color: T.blue, desc: '개념이나 방법을 알아보려는 탐색 초반 단계의 키워드예요.' },
  { key: '비교형', color: T.purple, desc: '여러 대안을 놓고 비교·검토하는 단계의 키워드예요.' },
  { key: '탐색형', color: T.amber, desc: '특정 브랜드나 서비스를 이미 알고 찾아보는 키워드예요.' },
  { key: '로컬형', color: T.rose, desc: '지역 기반으로 서비스를 찾는 키워드예요.' },
]
const VOLUMES = ['100~1,000', '1,000~10,000', '1만~10만', '10만~50만']
const RELATED_SUFFIXES = ['추천', '비교', '가격', '후기', '무료', '사용법', '순위', 'vs', '초보자', '2026']
const LONGTAIL_SUFFIXES = ['하는 법 총정리', '무료로 시작하는 방법', '실패 없이 고르는 기준', '3개월 후기']

function hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}
function pick(arr, h, salt = 0) { return arr[(h + salt) % arr.length] }

function genBlog(topic, toneLabel) {
  return `## ${topic}, 지금 시작해야 하는 이유\n\n${toneLabel} 톤으로 안내드릴게요. 최근 "${topic}"에 대한 검색이 꾸준히 늘고 있어요. 핵심은 "왜 지금인가"를 첫 문단에서 명확히 전달하는 거예요.\n\n## 실전에서 바로 쓰는 팁 3가지\n\n1. 키워드를 제목과 첫 문단에 자연스럽게 배치하세요.\n2. 실제 사례와 숫자로 신뢰도를 높이세요.\n3. 마지막엔 다음 행동을 명확한 CTA로 제안하세요.\n\n지금 "${topic}" 체크리스트를 무료로 받아보세요 →`
}
function genSocial(topic) {
  const cards = [
    `${topic}, 이거 모르면 손해예요 👀`,
    `가장 많이 하는 실수 1가지`,
    `그래서 어떻게 시작하냐면`,
    `실제로 효과 본 방법`,
    `저장해두고 하나씩 따라해보세요 🔖`,
  ]
  const tags = ['#' + topic.replace(/\s/g, ''), '#마케팅팁', '#오늘의인사이트', '#콘텐츠기획', '#SNS마케팅', '#브랜딩', '#성장전략', '#실전꿀팁', '#마케터일상', '#팔로우저장']
  return cards.map((c, idx) => `[카드 ${idx + 1}] ${c}`).join('\n') + '\n\n' + tags.join(' ')
}
function genNewsletter(topic, toneLabel) {
  return `제목안 1: "${topic}" 알아야 할 3가지\n제목안 2: 이번 주, ${topic}에 집중해야 하는 이유\n제목안 3: [필독] ${topic} 업데이트\n프리헤더: 5분이면 충분해요\n\n안녕하세요 :)\n${toneLabel} 톤으로 이번 주 소식을 전해드려요. "${topic}"와 관련해 놓치기 쉬운 포인트를 정리했어요.\n\n👉 지금 확인하기`
}
function genAds(topic) {
  return `[A안 — 혜택 강조]\n헤드라인: ${topic}, 지금이 기회\n본문: 오늘 시작하면 첫 달 혜택까지. 망설일 이유가 없어요.\nCTA: 지금 시작하기\n\n[B안 — 공감 강조]\n헤드라인: ${topic}, 아직도 고민 중이신가요?\n본문: 많은 분들이 같은 고민을 하다가 이렇게 해결했어요.\nCTA: 무료로 알아보기`
}
const GENERATORS = { blog: genBlog, social: genSocial, newsletter: genNewsletter, ads: genAds }

function genRewrite(original, goal) {
  const lines = original.split(/\n+/).filter(Boolean)
  let rewritten
  const keyChanges = []
  if (goal === 'seo') {
    rewritten = `## 핵심 요약\n${lines[0] || original.slice(0, 60)}\n\n## 자세히 보기\n${lines.slice(1).join('\n') || original}`
    keyChanges.push('제목에 핵심 키워드 배치', 'H2 소제목 구조 추가', '문단 첫 문장에 의도 명시', '내부 링크 자리 표시 추가', '메타 설명 초안 제안')
  } else if (goal === 'geo') {
    rewritten = `**핵심 팩트**\n- ${lines[0] || original.slice(0, 60)}\n\n**FAQ**\nQ. 요약하면?\nA. ${lines[1] || original.slice(0, 80)}`
    keyChanges.push('팩트 중심 불릿 구조화', 'FAQ 형식 추가', '모호한 표현 제거', '수치·근거 명시', 'AI 인용 최적화 구조')
  } else if (goal === 'readability') {
    rewritten = lines.map((l) => l.length > 40 ? l.slice(0, 40) + '.\n' + l.slice(40) : l).join('\n\n')
    keyChanges.push('긴 문장을 2문장으로 분리', '수식어 제거', '단락 재구성', '접속사 정리', '핵심어 강조')
  } else {
    rewritten = lines.slice(0, Math.max(1, Math.ceil(lines.length * 0.5))).join('\n')
    keyChanges.push('반복 표현 제거', '핵심 메시지만 유지', '분량 약 40% 절감', '군더더기 삭제', '결론 앞으로 이동')
  }
  return {
    rewritten,
    keyChanges,
    seoScore: '검색 노출 가능성 약 30% 향상 (샘플 추정)',
    readabilityNote: '평균 문장 길이가 줄어 읽기 훨씬 편해졌어요.',
  }
}

function genKeyword(keyword) {
  const h = hash(keyword)
  const intent = pick(INTENTS, h, 0)
  const difficulty = pick(['Low', 'Medium', 'High'], h, 1)
  const diffMap = { Low: { label: '낮음', color: T.emerald, w: '33%' }, Medium: { label: '중간', color: T.amber, w: '66%' }, High: { label: '높음', color: T.rose, w: '100%' } }
  return {
    intent: intent.key,
    intentDesc: intent.desc,
    intentColor: intent.color,
    difficulty,
    difficultyInfo: diffMap[difficulty],
    difficultyDesc: difficulty === 'Low' ? '경쟁이 적어 지금 바로 콘텐츠를 만들면 상위 노출 가능성이 높아요.' : difficulty === 'Medium' ? '경쟁이 있지만 차별화된 앵글로 접근하면 승산이 있어요.' : '이미 큰 사이트들이 선점하고 있어 롱테일 전략이 유리해요.',
    monthlyVolume: pick(VOLUMES, h, 2),
    relatedKeywords: RELATED_SUFFIXES.slice(0, 8).map((s) => `${keyword} ${s}`),
    longTailKeywords: LONGTAIL_SUFFIXES.map((s) => `${keyword} ${s}`),
    contentAngles: [
      { title: '입문자용 완전 정복 가이드', description: `${keyword}를 처음 접하는 사람도 따라할 수 있는 단계별 안내` },
      { title: '실패 사례로 배우는 주의점', description: `${keyword} 시도 중 흔히 겪는 실수와 회피 방법` },
      { title: '전문가 vs 초보자 비교', description: `${keyword}에 접근하는 방식의 차이와 각각의 장단점` },
    ],
    seoTitles: [
      `${keyword}, 처음이라면 꼭 봐야 할 가이드`,
      `${keyword} 완벽 정리 — 2026년 최신판`,
      `${keyword} 시작 전 반드시 확인할 5가지`,
    ],
    metaDescription: `${keyword}에 대해 검색 의도부터 실전 팁까지 한 번에 정리했어요. 지금 바로 확인하고 시행착오를 줄여보세요.`,
  }
}

function genCluster(keywords) {
  const clusters = []
  const buckets = {}
  keywords.forEach((k, i) => {
    const intent = pick(INTENTS, hash(k), i).key
    buckets[intent] = buckets[intent] || []
    buckets[intent].push(k)
  })
  Object.entries(buckets).forEach(([intent, ks]) => {
    clusters.push({
      intent,
      pillar: ks[0],
      keywords: ks,
      description: `${intent} 의도의 키워드 ${ks.length}개가 한 그룹으로 묶여요. 유사한 검색 맥락을 공유해요.`,
      contentIdea: `"${ks[0]}"를 대표 키워드로 삼아 필러 페이지를 만들고 나머지를 서브 섹션으로 연결하세요.`,
    })
  })
  return {
    clusters,
    summary: `${keywords.length}개 키워드가 ${clusters.length}개 의도 그룹으로 클러스터링됐어요. 그룹별로 하나의 필러 콘텐츠를 만들면 효율적이에요.`,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupt or unavailable storage */ }
  return {
    tab: 'generate',
    generate: { channels: ['blog', 'social', 'newsletter', 'ads'], topic: '', tone: 'friendly', result: null },
    rewrite: { goal: 'seo', original: '', result: null },
    keyword: { mode: 'single', keyword: '', result: null, clusterText: 'AI 마케팅 도구\nSEO 자동화\nGEO 최적화\n마케팅 AI 솔루션\n콘텐츠 자동 생성', clusterResult: null },
  }
}

function Card({ children, style }) {
  return <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div>
}
function Banner() {
  return (
    <div style={{ background: '#fff8ec', border: '1px solid #f5deb3', borderRadius: 12, padding: '10px 14px', fontSize: 12.5, color: '#7a5b1f', marginBottom: 16 }}>
      🧪 데모 모드 — 실제 AI 호출 없이 미리 준비된 샘플 템플릿 결과를 보여드려요.
    </div>
  )
}

function ChannelPill({ ch, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
      border: active ? `1px solid ${T.text}` : `1px solid ${T.border}`, background: active ? T.text : T.bg, color: active ? '#fff' : T.text, fontSize: 13, fontWeight: 600,
    }}>
      {active ? '✓' : ch.icon} {ch.label}
    </button>
  )
}
function TonePill({ t, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 12px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, border: active ? `1px solid ${T.indigo}` : `1px solid ${T.border}`, background: active ? '#eef0ff' : T.bg, color: active ? T.indigo : T.muted }}>
      {t.label}
    </button>
  )
}

function ContentCard({ ch, text }) {
  const [expanded, setExpanded] = useState(false)
  const truncated = text && text.length > 220 && !expanded
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ height: 4, background: ch.color }} />
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: ch.color, background: `${ch.color}18`, padding: '2px 8px', borderRadius: 999 }}>{ch.icon} {ch.label}</span>
          {text && <button onClick={() => navigator.clipboard?.writeText(text)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: T.muted }}>복사</button>}
        </div>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>{ch.title}</div>
        <div style={{ fontSize: 13, color: T.text, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
          {text ? (truncated ? text.slice(0, 220) + '…' : text) : <span style={{ color: T.muted }}>AI 대기 중…</span>}
        </div>
        {text && text.length > 220 && (
          <button onClick={() => setExpanded((v) => !v)} style={{ marginTop: 6, border: 'none', background: 'none', color: T.indigo, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            {expanded ? '접기' : '전체 보기'}
          </button>
        )}
      </div>
    </Card>
  )
}

function GenerateTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const channels = new Set(data.channels)
  const toggle = (key) => {
    if (channels.has(key) && channels.size === 1) return
    const next = new Set(channels)
    next.has(key) ? next.delete(key) : next.add(key)
    update({ ...data, channels: Array.from(next) })
  }
  const run = () => {
    if (!data.topic.trim()) return
    setLoading(true)
    setTimeout(() => {
      const toneLabel = TONES.find((t) => t.key === data.tone)?.label || '친근한'
      const result = {}
      data.channels.forEach((c) => { result[c] = GENERATORS[c](data.topic, toneLabel) })
      update({ ...data, result })
      setLoading(false)
    }, 700)
  }
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 2 }}>✨ Multi-Channel 콘텐츠 생성</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>주제와 채널을 선택하면 4개 채널에 맞는 콘텐츠를 자동 생성해요.</div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: T.muted, marginBottom: 8 }}>생성할 채널 선택</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {CHANNELS.map((ch) => <ChannelPill key={ch.key} ch={ch} active={channels.has(ch.key)} onClick={() => toggle(ch.key)} />)}
        </div>
        <input
          value={data.topic}
          onChange={(e) => update({ ...data, topic: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && run()}
          placeholder="주제나 키워드를 입력하세요 (예: 봄 신제품 출시, 건강한 아침 루틴)"
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14, marginBottom: 12 }}
        />
        <div style={{ fontSize: 12.5, fontWeight: 700, color: T.muted, marginBottom: 8 }}>톤 선택</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {TONES.map((t) => <TonePill key={t.key} t={t} active={data.tone === t.key} onClick={() => update({ ...data, tone: t.key })} />)}
        </div>
        <button onClick={run} disabled={loading || !data.topic.trim()} style={{
          width: '100%', padding: '12px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, fontSize: 14,
        }}>
          {loading ? '생성 중...' : 'AI 콘텐츠 생성'}
        </button>
      </Card>
      {(loading || data.result) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {data.channels.map((c) => {
            const ch = CHANNELS.find((x) => x.key === c)
            return <ContentCard key={c} ch={ch} text={loading ? '' : data.result?.[c]} />
          })}
        </div>
      )}
    </div>
  )
}

function RewriteTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState('split')
  const goal = GOALS.find((g) => g.key === data.goal)
  const run = () => {
    if (!data.original.trim()) return
    setLoading(true)
    setTimeout(() => {
      update({ ...data, result: genRewrite(data.original, data.goal) })
      setLoading(false)
    }, 600)
  }
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 2 }}>✏️ AI 콘텐츠 리라이터</div>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>목표를 고르고 원본 텍스트를 붙여넣으면 목적에 맞게 다시 써드려요.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8, marginBottom: 14 }}>
          {GOALS.map((g) => (
            <button key={g.key} onClick={() => update({ ...data, goal: g.key })} style={{
              textAlign: 'left', padding: 12, borderRadius: 10, cursor: 'pointer',
              border: data.goal === g.key ? `1px solid ${g.color}` : `1px solid ${T.border}`,
              background: data.goal === g.key ? g.color : T.bg, color: data.goal === g.key ? '#fff' : T.text,
            }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{g.label}</div>
              <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>{g.desc}</div>
            </button>
          ))}
        </div>
        <textarea
          value={data.original}
          onChange={(e) => update({ ...data, original: e.target.value })}
          placeholder="리라이팅할 원본 텍스트를 붙여넣으세요"
          rows={5}
          style={{ width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 13.5, marginBottom: 12, fontFamily: 'inherit' }}
        />
        <button onClick={run} disabled={loading || !data.original.trim()} style={{
          width: '100%', padding: 12, borderRadius: 10, border: 'none', cursor: 'pointer',
          background: loading ? T.muted : goal.color, color: '#fff', fontWeight: 700, fontSize: 14,
        }}>
          {loading ? 'AI 리라이팅 중...' : goal.label}
        </button>
      </Card>
      {data.result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
            <Card style={{ background: T.dark, color: '#fff' }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>주요 변경 사항</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.8 }}>
                {data.result.keyChanges.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Card style={{ background: '#e6f4ea', border: '1px solid #b7e0c3', padding: 12 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: T.emerald }}>SEO 효과</div>
                <div style={{ fontSize: 12.5, marginTop: 4 }}>{data.result.seoScore}</div>
              </Card>
              <Card style={{ background: '#eef2ff', border: '1px solid #c7d2fe', padding: 12 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: T.indigo }}>가독성</div>
                <div style={{ fontSize: 12.5, marginTop: 4 }}>{data.result.readabilityNote}</div>
              </Card>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button onClick={() => setView('split')} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: view === 'split' ? T.text : T.bg, color: view === 'split' ? '#fff' : T.text, fontSize: 12.5, cursor: 'pointer' }}>원본·결과 비교</button>
            <button onClick={() => setView('rewritten')} style={{ padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: view === 'rewritten' ? T.text : T.bg, color: view === 'rewritten' ? '#fff' : T.text, fontSize: 12.5, cursor: 'pointer' }}>결과만 보기</button>
          </div>
          {view === 'split' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Card>
                <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 6 }}>원본 ({data.original.length}자)</div>
                <div style={{ fontSize: 13, whiteSpace: 'pre-wrap', color: T.muted }}>{data.original}</div>
              </Card>
              <Card style={{ background: '#eef0ff' }}>
                <div style={{ fontSize: 11.5, color: T.indigo, marginBottom: 6 }}>리라이팅 결과 ({data.result.rewritten.length}자)</div>
                <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{data.result.rewritten}</div>
              </Card>
            </div>
          ) : (
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>✅ 리라이팅 완료</div>
                <button onClick={() => navigator.clipboard?.writeText(data.result.rewritten)} style={{ border: 'none', background: 'none', color: T.indigo, cursor: 'pointer', fontSize: 12.5, fontWeight: 700 }}>전체 복사</button>
              </div>
              <div style={{ fontSize: 13.5, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{data.result.rewritten}</div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function KeywordTab({ data, update }) {
  const [loading, setLoading] = useState(false)
  const runSingle = (kw) => {
    const k = (kw ?? data.keyword).trim()
    if (!k) return
    setLoading(true)
    setTimeout(() => { update({ ...data, keyword: k, result: genKeyword(k) }); setLoading(false) }, 500)
  }
  const runCluster = () => {
    const list = data.clusterText.split('\n').map((s) => s.trim()).filter(Boolean)
    if (list.length < 2) return
    setLoading(true)
    setTimeout(() => { update({ ...data, clusterResult: genCluster(list) }); setLoading(false) }, 700)
  }
  const r = data.result
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>🔍 AI 키워드 분석</div>
        <div style={{ display: 'flex', gap: 6, background: T.surface, padding: 4, borderRadius: 10, width: 'fit-content', marginBottom: 16 }}>
          {[{ k: 'single', l: '단일 분석' }, { k: 'cluster', l: '클러스터링' }].map((m) => (
            <button key={m.k} onClick={() => update({ ...data, mode: m.k })} style={{
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              background: data.mode === m.k ? T.bg : 'transparent', color: data.mode === m.k ? T.text : T.muted,
              boxShadow: data.mode === m.k ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>{m.l}</button>
          ))}
        </div>
        {data.mode === 'single' ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={data.keyword} onChange={(e) => update({ ...data, keyword: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && runSingle()}
              placeholder="분석할 키워드 입력 (예: AI 마케팅 도구)" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: `1px solid ${T.border}`, fontSize: 14 }} />
            <button onClick={() => runSingle()} disabled={loading} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              {loading ? '분석 중...' : '키워드 분석'}
            </button>
          </div>
        ) : (
          <div>
            <textarea value={data.clusterText} onChange={(e) => update({ ...data, clusterText: e.target.value })} rows={6}
              style={{ width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 10, border: `1px solid ${T.border}`, fontFamily: 'inherit', fontSize: 13.5, marginBottom: 8 }} />
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>{data.clusterText.split('\n').filter((s) => s.trim()).length}개 키워드 입력됨</div>
            <button onClick={runCluster} disabled={loading} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: loading ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              {loading ? '클러스터링 중...' : '의도별 클러스터링'}
            </button>
          </div>
        )}
      </Card>

      {data.mode === 'single' && r && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
            <Card>
              <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 6 }}>검색 의도</div>
              <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, color: r.intentColor, background: `${r.intentColor}18` }}>{r.intent}</span>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 8 }}>{r.intentDesc}</div>
            </Card>
            <Card>
              <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 6 }}>경쟁도</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: r.difficultyInfo.color }}>{r.difficultyInfo.label}</div>
              <div style={{ height: 6, background: T.surface, borderRadius: 4, marginTop: 8, marginBottom: 8 }}>
                <div style={{ height: 6, width: r.difficultyInfo.w, background: r.difficultyInfo.color, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 12, color: T.muted }}>{r.difficultyDesc}</div>
            </Card>
            <Card>
              <div style={{ fontSize: 11.5, color: T.muted, marginBottom: 6 }}>예상 월 검색량</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{r.monthlyVolume}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 8 }}>AI 추정치 (실제 값과 다를 수 있음)</div>
            </Card>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>연관 키워드</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {r.relatedKeywords.map((k) => <button key={k} onClick={() => runSingle(k)} style={{ padding: '5px 10px', borderRadius: 999, border: `1px solid ${T.border}`, background: T.surface, fontSize: 12, cursor: 'pointer' }}>{k}</button>)}
              </div>
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>롱테일 키워드</div>
              {r.longTailKeywords.map((k, i) => (
                <div key={k} onClick={() => runSingle(k)} style={{ padding: '6px 0', fontSize: 12.5, cursor: 'pointer', borderBottom: i < r.longTailKeywords.length - 1 ? `1px solid ${T.border}` : 'none' }}>{i + 1}. {k}</div>
              ))}
            </Card>
          </div>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>콘텐츠 방향 제안</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {r.contentAngles.map((a, i) => (
                <div key={i} style={{ padding: 12, background: T.surface, borderRadius: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 4 }}>{i + 1}. {a.title}</div>
                  <div style={{ fontSize: 11.5, color: T.muted }}>{a.description}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>SEO 최적화 제목 &amp; 메타 설명</div>
            {r.seoTitles.map((t, i) => (
              <div key={i} style={{ fontSize: 12.5, padding: '5px 0' }}><span style={{ color: T.indigo, fontWeight: 700, marginRight: 6 }}>T{i + 1}</span>{t}</div>
            ))}
            <div style={{ marginTop: 10, padding: 10, background: '#e6f4ea', borderRadius: 8, fontSize: 12 }}>{r.metaDescription}</div>
          </Card>
        </>
      )}

      {data.mode === 'cluster' && data.clusterResult && (
        <>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>전략 요약</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 10 }}>{data.clusterResult.summary}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {data.clusterResult.clusters.map((c) => {
                const color = INTENTS.find((i) => i.key === c.intent)?.color || T.muted
                return <span key={c.intent} style={{ fontSize: 11.5, fontWeight: 700, color, background: `${color}18`, padding: '3px 10px', borderRadius: 999 }}>{c.intent} {c.keywords.length}개</span>
              })}
            </div>
          </Card>
          {data.clusterResult.clusters.map((c) => {
            const color = INTENTS.find((i) => i.key === c.intent)?.color || T.muted
            return (
              <Card key={c.intent} style={{ marginBottom: 10, borderLeft: `4px solid ${color}`, background: `${color}08` }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color, background: `${color}18`, padding: '2px 8px', borderRadius: 999 }}>{c.intent}</span>
                <div style={{ fontWeight: 800, fontSize: 14, marginTop: 8 }}>대표: {c.pillar}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' }}>
                  {c.keywords.map((k) => <span key={k} style={{ fontSize: 11.5, background: T.bg, border: `1px solid ${T.border}`, padding: '3px 8px', borderRadius: 999 }}>{k}</span>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                  <div><div style={{ fontSize: 11, fontWeight: 700, color: T.muted }}>그룹 특징</div><div style={{ fontSize: 12 }}>{c.description}</div></div>
                  <div><div style={{ fontSize: 11, fontWeight: 700, color: T.muted }}>추천 콘텐츠</div><div style={{ fontSize: 12 }}>{c.contentIdea}</div></div>
                </div>
              </Card>
            )
          })}
        </>
      )}
    </div>
  )
}

export default function MarketerOpsContentDemo() {
  const [state, setState] = useState(null)

  useEffect(() => { setState(loadState()) }, [])
  useEffect(() => {
    if (!state) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* private mode */ }
  }, [state])

  if (!state) return null

  const TABS = [
    { key: 'generate', label: '✨ 콘텐츠 생성' },
    { key: 'rewrite', label: '✏️ 리라이터' },
    { key: 'keyword', label: '🔍 키워드 분석' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: T.surface, color: T.text, fontFamily: "'Noto Sans KR', -apple-system, sans-serif" }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: T.bg, borderBottom: `1px solid ${T.border}`, padding: '14px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>MarketerOps 콘텐츠·키워드</div>
            <div style={{ fontSize: 12, color: T.muted }}>멀티채널 콘텐츠 생성 · 리라이터 · 키워드 분석</div>
          </div>
          <Link href="/portfolio" style={{ fontSize: 12.5, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px' }}>
        <Banner />
        <div style={{ display: 'flex', gap: 4, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 4, marginBottom: 16, width: 'fit-content' }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setState({ ...state, tab: t.key })} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
              background: state.tab === t.key ? T.text : 'transparent', color: state.tab === t.key ? '#fff' : T.muted,
            }}>{t.label}</button>
          ))}
        </div>
        {state.tab === 'generate' && <GenerateTab data={state.generate} update={(d) => setState({ ...state, generate: d })} />}
        {state.tab === 'rewrite' && <RewriteTab data={state.rewrite} update={(d) => setState({ ...state, rewrite: d })} />}
        {state.tab === 'keyword' && <KeywordTab data={state.keyword} update={(d) => setState({ ...state, keyword: d })} />}
      </div>
    </div>
  )
}
