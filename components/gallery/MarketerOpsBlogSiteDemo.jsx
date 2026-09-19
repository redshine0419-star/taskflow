'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const T = {
  bg: '#ffffff', surface: '#f6f8fa', border: '#eaeef2', text: '#24292f', muted: '#57606a',
  indigo: '#6366f1', emerald: '#10b981', amber: '#f59e0b', rose: '#ef4444', dark: '#0d1117',
}
const STORAGE_KEY = 'tf_marketerops_blogsite_demo_v1'

const LANGS = [{ key: 'ko', label: '국문 (KO)' }, { key: 'en', label: '영문 (EN)' }, { key: 'ja', label: '일문 (JA)' }]
const TONES = { ko: ['전문적이고 실용적인', '친근하고 쉬운', '격식체', '캐주얼'], en: ['Professional', 'Friendly', 'Formal', 'Casual'], ja: ['プロフェッショナル', '親しみやすい', '格式体', 'カジュアル'] }

function slugify(s) { return s.trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/(^-|-$)/g, '') || 'post' }

function genPost(lang, keyword, audience, tone) {
  const slug = `${slugify(keyword)}-${Date.now().toString(36)}`
  const bodies = {
    ko: `## ${keyword}, 왜 지금 중요할까요?\n\n${audience || '마케터'}라면 ${keyword}를 놓칠 수 없어요. 최근 검색 트렌드에서도 꾸준히 상승 중이에요.\n\n## 실전 적용 팁\n\n1. 핵심 지표부터 점검하세요.\n2. 작은 실험부터 시작하세요.\n3. 결과를 데이터로 검증하세요.\n\n> 💡 **무료로 진단받기** — 지금 사이트를 점검해보세요.\n\n${tone} 톤으로 정리했어요. 도움이 되셨다면 다음 글도 확인해보세요.`,
    en: `## Why ${keyword} matters right now\n\nFor ${audience || 'marketers'}, ${keyword} is impossible to ignore this year.\n\n## Practical tips\n\n1. Audit your core metrics first.\n2. Start with small experiments.\n3. Validate results with data.\n\n> 💡 **Free Site Diagnosis** — check your site instantly.`,
    ja: `## なぜ${keyword}が今重要なのか\n\n${audience || 'マーケター'}なら${keyword}は見逃せません。\n\n## 実践のヒント\n\n1. 主要指標をまず確認\n2. 小さく実験を始める\n3. データで検証する\n\n> 💡 **無料サイト診断** — 今すぐチェック。`,
  }
  return {
    slug, lang, keyword, title: lang === 'ko' ? `${keyword}, 지금 시작해야 하는 이유` : lang === 'en' ? `Why you should start with ${keyword} now` : `${keyword}を今始めるべき理由`,
    metaDescription: lang === 'ko' ? `${keyword}에 대한 실전 가이드를 정리했어요. 지금 확인해보세요.` : `A practical guide to ${keyword}.`,
    tags: [keyword, tone, lang.toUpperCase()], content: bodies[lang], createdAt: new Date().toISOString(),
  }
}

function genFileTree() {
  return {
    'components/Header.jsx': `export default function Header() {\n  return (\n    <header style={{ background: '#111827', color: '#fff', padding: 16 }}>\n      <h1>My Site</h1>\n    </header>\n  )\n}`,
    'app/page.jsx': `export default function Home() {\n  return (\n    <main>\n      <h1>Welcome</h1>\n      <p>This is the homepage.</p>\n    </main>\n  )\n}`,
    'lib/utils.js': `export function formatDate(d) {\n  return new Date(d).toLocaleDateString()\n}`,
  }
}
function applyEdit(content, prompt) {
  const p = prompt.toLowerCase()
  let out = content
  if (p.includes('색') || p.includes('color')) out = out.replace(/#[0-9a-fA-F]{6}/, '#1e3a8a')
  if (p.includes('크게') || p.includes('large') || p.includes('font')) out = out.replace(/padding: 16/, 'padding: 16, fontSize: 20')
  if (out === content) out = content + `\n// AI 편집: "${prompt}" 반영`
  return out
}
function diffLines(before, after) {
  const a = before.split('\n'), b = after.split('\n')
  const out = []
  const max = Math.max(a.length, b.length)
  for (let i = 0; i < max; i++) {
    if (a[i] === b[i]) out.push({ type: 'same', content: a[i] ?? '' })
    else {
      if (a[i] !== undefined) out.push({ type: 'remove', content: a[i] })
      if (b[i] !== undefined) out.push({ type: 'add', content: b[i] })
    }
  }
  return out
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
    tab: 'blog',
    blog: { lang: 'ko', keyword: '', audience: '', tone: TONES.ko[0], generating: false, preview: null, posts: [], editingSlug: null, editDraft: null, schedule: { enabled: false, interval: 24 } },
    editor: { selectedFile: 'components/Header.jsx', prompt: '', generated: null, committed: [] },
    newsletter: { email: '', status: 'idle', subscribers: [] },
  }
}

function Card({ children, style }) { return <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div> }
function Banner() {
  return (
    <div style={{ background: '#fff8ec', border: '1px solid #f5deb3', borderRadius: 12, padding: '10px 14px', fontSize: 12.5, color: '#7a5b1f', marginBottom: 16 }}>
      🧪 데모 모드 — 실제 AI 생성·GitHub 커밋·이메일 발송 없이 로컬에만 저장돼요.
    </div>
  )
}

function BlogTab({ data, update }) {
  const setF = (k, v) => update({ ...data, [k]: v })
  const generate = () => {
    if (!data.keyword.trim()) return
    setF('generating', true)
    setTimeout(() => {
      const post = genPost(data.lang, data.keyword, data.audience, data.tone)
      update({ ...data, generating: false, preview: post, posts: [post, ...data.posts] })
    }, 900)
  }
  const openEdit = (slug) => {
    const post = data.posts.find((p) => p.slug === slug)
    update({ ...data, editingSlug: slug, editDraft: { ...post, tagsText: post.tags.join(', ') } })
  }
  const saveEdit = () => {
    const d = data.editDraft
    const posts = data.posts.map((p) => p.slug === d.slug ? { ...p, title: d.title, metaDescription: d.metaDescription, content: d.content, tags: d.tagsText.split(',').map((t) => t.trim()).filter(Boolean) } : p)
    update({ ...data, posts, editingSlug: null, editDraft: null })
  }
  const del = (slug) => update({ ...data, posts: data.posts.filter((p) => p.slug !== slug) })
  const langPosts = data.posts.filter((p) => p.lang === data.lang)

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>📝 Blog 관리</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {LANGS.map((l) => (
            <button key={l.key} onClick={() => setF('lang', l.key)} style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${T.border}`, background: data.lang === l.key ? T.text : T.bg, color: data.lang === l.key ? '#fff' : T.text, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>{l.label}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <input value={data.keyword} onChange={(e) => setF('keyword', e.target.value)} placeholder="키워드 *" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
          <input value={data.audience} onChange={(e) => setF('audience', e.target.value)} placeholder="타겟 독자" style={{ padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {TONES[data.lang].map((t) => <button key={t} onClick={() => setF('tone', t)} style={{ padding: '5px 10px', borderRadius: 999, fontSize: 11.5, border: data.tone === t ? `1px solid ${T.indigo}` : `1px solid ${T.border}`, background: data.tone === t ? '#eef0ff' : T.bg, color: data.tone === t ? T.indigo : T.muted, cursor: 'pointer' }}>{t}</button>)}
        </div>
        <button onClick={generate} disabled={data.generating || !data.keyword.trim()} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: data.generating ? T.muted : T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {data.generating ? '생성 중... (샘플 10~20초)' : 'AI 블로그 포스트 생성'}
        </button>
      </Card>
      {data.preview && (
        <Card style={{ marginBottom: 16, background: T.surface }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{data.preview.title}</div>
          <div style={{ fontSize: 12, color: T.muted, margin: '6px 0' }}>{data.preview.metaDescription}</div>
          <div style={{ display: 'flex', gap: 6 }}>{data.preview.tags.map((t) => <span key={t} style={{ fontSize: 11, background: T.bg, border: `1px solid ${T.border}`, padding: '2px 8px', borderRadius: 999 }}>{t}</span>)}</div>
        </Card>
      )}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{LANGS.find((l) => l.key === data.lang).label} 포스트 ({langPosts.length})</div>
        </div>
        {langPosts.length === 0 && <div style={{ color: T.muted, fontSize: 12.5, textAlign: 'center', padding: 20 }}>아직 포스트가 없습니다.</div>}
        {langPosts.map((p) => (
          <div key={p.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{p.keyword} · {new Date(p.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => openEdit(p.slug)} style={{ border: 'none', background: 'none', color: T.indigo, cursor: 'pointer', fontSize: 12 }}>수정</button>
              <button onClick={() => { if (confirm(`"${p.slug}" 포스트를 삭제할까요?`)) del(p.slug) }} style={{ border: 'none', background: 'none', color: T.rose, cursor: 'pointer', fontSize: 12 }}>삭제</button>
            </div>
          </div>
        ))}
      </Card>

      {data.editDraft && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ background: T.bg, borderRadius: 16, padding: 20, width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ fontWeight: 800, marginBottom: 12 }}>포스트 수정</div>
            <input value={data.editDraft.title} onChange={(e) => setF('editDraft', { ...data.editDraft, title: e.target.value })} placeholder="제목" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 8 }} />
            <input value={data.editDraft.metaDescription} onChange={(e) => setF('editDraft', { ...data.editDraft, metaDescription: e.target.value })} placeholder="Meta Description" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 8 }} />
            <input value={data.editDraft.tagsText} onChange={(e) => setF('editDraft', { ...data.editDraft, tagsText: e.target.value })} placeholder="태그 (쉼표 구분)" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 8 }} />
            <textarea value={data.editDraft.content} onChange={(e) => setF('editDraft', { ...data.editDraft, content: e.target.value })} rows={10} style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, fontFamily: 'monospace', fontSize: 12.5, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => update({ ...data, editingSlug: null, editDraft: null })} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, cursor: 'pointer' }}>취소</button>
              <button onClick={saveEdit} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: T.text, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EditorTab({ data, update }) {
  const files = genFileTree()
  const [loading, setLoading] = useState(false)
  const [committing, setCommitting] = useState(false)
  const content = files[data.selectedFile]
  const generate = () => {
    if (!data.prompt.trim()) return
    setLoading(true)
    setTimeout(() => { update({ ...data, generated: applyEdit(content, data.prompt) }); setLoading(false) }, 800)
  }
  const commit = () => {
    setCommitting(true)
    setTimeout(() => {
      const url = `https://github.com/sample/portfolio-demo/commit/${Math.random().toString(16).slice(2, 9)}`
      update({ ...data, committed: [{ file: data.selectedFile, url, message: `feat: AI 편집기 — ${data.prompt.slice(0, 40)}` }, ...data.committed], generated: null, prompt: '' })
      setCommitting(false)
    }, 700)
  }
  const diff = data.generated ? diffLines(content, data.generated) : []
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>🖥️ 사이트 편집기</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>수정할 파일</div>
        <select value={data.selectedFile} onChange={(e) => update({ ...data, selectedFile: e.target.value, generated: null })} style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, marginBottom: 12 }}>
          {Object.keys(files).map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <pre style={{ background: T.surface, padding: 12, borderRadius: 8, fontSize: 11.5, overflowX: 'auto', marginBottom: 12 }}>{content}</pre>
        <textarea value={data.prompt} onChange={(e) => update({ ...data, prompt: e.target.value })} rows={2} placeholder="예: 헤더 배경색을 짙은 남색으로 변경해줘" style={{ width: '100%', boxSizing: 'border-box', padding: 10, borderRadius: 8, border: `1px solid ${T.border}`, fontFamily: 'inherit', marginBottom: 10 }} />
        <button onClick={generate} disabled={loading || !data.prompt.trim()} style={{ width: '100%', padding: 11, borderRadius: 10, border: 'none', background: loading ? T.muted : T.indigo, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
          {loading ? '생성 중...' : '✨ AI 수정 코드 생성'}
        </button>
      </Card>
      {data.generated && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>변경 미리보기</div>
          <div style={{ fontFamily: 'monospace', fontSize: 11.5, background: T.dark, borderRadius: 8, padding: 10, marginBottom: 12 }}>
            {diff.map((l, i) => (
              <div key={i} style={{ color: l.type === 'add' ? '#4ade80' : l.type === 'remove' ? '#f87171' : '#9ca3af', background: l.type === 'add' ? '#052e16' : l.type === 'remove' ? '#450a0a' : 'transparent' }}>
                {l.type === 'add' ? '+ ' : l.type === 'remove' ? '- ' : '  '}{l.content}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => update({ ...data, generated: null })} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, cursor: 'pointer' }}>취소</button>
            <button onClick={commit} disabled={committing} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: T.emerald, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>{committing ? '커밋 중...' : '승인 & 커밋'}</button>
          </div>
        </Card>
      )}
      {data.committed.length > 0 && (
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>최근 커밋 (샘플)</div>
          {data.committed.map((c, i) => <div key={i} style={{ fontSize: 12, padding: '4px 0' }}>✅ {c.file} — <a href={c.url} style={{ color: T.indigo }}>{c.url.split('/').pop()}</a></div>)}
        </Card>
      )}
    </div>
  )
}

function NewsletterTab({ data, update }) {
  const [status, setStatus] = useState('idle')
  const subscribe = () => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(data.email)) { setStatus('error'); return }
    setStatus('loading')
    setTimeout(() => {
      const exists = data.subscribers.some((s) => s.email.toLowerCase() === data.email.toLowerCase())
      const subscribers = exists ? data.subscribers : [{ email: data.email, lang: 'ko', createdAt: new Date().toISOString() }, ...data.subscribers]
      update({ ...data, subscribers, email: '' })
      setStatus('success')
    }, 500)
  }
  return (
    <div>
      <Card style={{ marginBottom: 16, background: T.surface, maxWidth: 420 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}><span>✉️</span><div style={{ fontWeight: 800, fontSize: 14 }}>주간 마케팅 인사이트 구독</div></div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>매주 최신 GEO·SEO 팁과 마케팅 트렌드를 이메일로 받아보세요.</div>
        {status === 'success' ? (
          <div style={{ color: T.emerald, fontSize: 13 }}>✅ 구독 완료! 매주 수요일 인사이트를 보내드립니다.</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={data.email} onChange={(e) => update({ ...data, email: e.target.value })} placeholder="이메일 주소" style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${T.border}` }} />
              <button onClick={subscribe} disabled={status === 'loading'} style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: T.text, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>{status === 'loading' ? '처리 중…' : '무료 구독'}</button>
            </div>
            {status === 'error' && <div style={{ color: T.rose, fontSize: 11.5, marginTop: 6 }}>올바른 이메일 주소를 입력해주세요.</div>}
          </>
        )}
      </Card>
      <Card>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>수집 이메일 현황 (관리자 뷰)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10, marginBottom: 12 }}>
          <div style={{ background: T.dark, color: '#fff', borderRadius: 10, padding: 12, textAlign: 'center' }}><div style={{ fontSize: 11 }}>전체 구독자</div><div style={{ fontWeight: 800, fontSize: 20 }}>{data.subscribers.length}</div></div>
        </div>
        {data.subscribers.length === 0 ? <div style={{ color: T.muted, fontSize: 12.5, textAlign: 'center', padding: 10 }}>아직 구독자가 없습니다.</div> : data.subscribers.slice(0, 20).map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: `1px solid ${T.border}` }}><span style={{ fontFamily: 'monospace' }}>{s.email}</span><span style={{ color: T.muted }}>{new Date(s.createdAt).toLocaleDateString('ko-KR')}</span></div>
        ))}
      </Card>
    </div>
  )
}

export default function MarketerOpsBlogSiteDemo() {
  const [state, setState] = useState(null)
  useEffect(() => { setState(loadState()) }, [])
  useEffect(() => {
    if (!state) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* private mode */ }
  }, [state])
  if (!state) return null

  const TABS = [
    { key: 'blog', label: '📝 Blog 관리' },
    { key: 'editor', label: '🖥️ 사이트 편집기' },
    { key: 'newsletter', label: '✉️ 뉴스레터' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: T.surface, color: T.text, fontFamily: "'Noto Sans KR', -apple-system, sans-serif" }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: T.bg, borderBottom: `1px solid ${T.border}`, padding: '14px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17 }}>MarketerOps 블로그·사이트 관리</div>
            <div style={{ fontSize: 12, color: T.muted }}>Blog CMS · AI 사이트 편집기 · 뉴스레터</div>
          </div>
          <Link href="/portfolio" style={{ fontSize: 12.5, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        <Banner />
        <div style={{ display: 'flex', gap: 4, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 4, marginBottom: 16, width: 'fit-content' }}>
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setState({ ...state, tab: t.key })} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
              background: state.tab === t.key ? T.text : 'transparent', color: state.tab === t.key ? '#fff' : T.muted,
            }}>{t.label}</button>
          ))}
        </div>
        {state.tab === 'blog' && <BlogTab data={state.blog} update={(d) => setState({ ...state, blog: d })} />}
        {state.tab === 'editor' && <EditorTab data={state.editor} update={(d) => setState({ ...state, editor: d })} />}
        {state.tab === 'newsletter' && <NewsletterTab data={state.newsletter} update={(d) => setState({ ...state, newsletter: d })} />}
      </div>
    </div>
  )
}
