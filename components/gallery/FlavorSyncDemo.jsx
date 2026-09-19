'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { mockRecipes } from '../../data/flavorsyncRecipes'
import { mockBlogPosts } from '../../data/flavorsyncBlog'

// ─── Real FlavorSync design tokens (ported from app/globals.css) ───────────
const T = {
  brand: '#C94B2A', brandLight: '#FEF0E8', brandMid: '#F4C4AC',
  bg: '#F5F1EC', surface: '#FFFFFF', border: '#E6DDD4',
  text1: '#1A1208', text2: '#6B5B4E', text3: '#A89A90',
  green: '#2B7A4F', greenLight: '#E6F4ED',
  amber: '#B86B0A', amberLight: '#FEF3E2',
  red: '#B52A1A', redLight: '#FEE9E7',
  blue: '#2563EB', blueLight: '#EBF2FF',
  purple: '#6B3FD4', purpleLight: '#F5F2FF',
}
const FONT = "'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif"

const STORAGE_KEY = 'tf_flavorsync_demo_v1'
const CATEGORIES = ['요리팁', '식재료이야기', '건강식', '시즌레시피', '미각탐구']
const CATEGORY_EMOJI = { 요리팁: '💡', 식재료이야기: '🌿', 건강식: '💚', 시즌레시피: '🍂', 미각탐구: '👅' }
const BURNER_LABEL = { 1: '버너 1', 2: '버너 2', null: '공통' }

const SEED_FRIDGE = [
  { id: 'fr1', name: '돼지고기', amount: 300, unit: 'g', expireDate: addDays(2), icon: '🥩' },
  { id: 'fr2', name: '두부', amount: 1, unit: '개', expireDate: addDays(4), icon: '🧊' },
  { id: 'fr3', name: '대파', amount: 1, unit: '대', expireDate: addDays(7), icon: '🌿' },
]

const OCR_SAMPLE_RESULT = [
  { name: '양파', amount: 3, unit: '개', icon: '🧅' },
  { name: '달걀', amount: 10, unit: '개', icon: '🥚' },
  { name: '김치', amount: 500, unit: 'g', icon: '🥬' },
]

function addDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
function daysLeft(dateStr) {
  return Math.round((new Date(dateStr) - new Date(new Date().toDateString())) / 86400000)
}
function norm(s) { return String(s).replace(/\s+/g, '').toLowerCase() }
function ingredientMatches(fridgeItem, ing) {
  const fn = norm(fridgeItem.name), rn = norm(ing.name)
  if (fn.length < 2 || rn.length < 2) return false
  return fn === rn || fn.includes(rn) || rn.includes(fn)
}
function getMatchInfo(recipe, fridgeItems) {
  const mains = recipe.ingredients.filter((i) => i.type === 'main')
  const have = mains.filter((ing) => fridgeItems.some((f) => ingredientMatches(f, ing)))
  return { rate: mains.length === 0 ? 100 : Math.round((have.length / mains.length) * 100), have: have.length, total: mains.length }
}
function getTimings(recipe) {
  const b1 = recipe.steps.filter((s) => s.burner === 1).reduce((a, s) => a + s.duration_sec, 0)
  const b2 = recipe.steps.filter((s) => s.burner === 2).reduce((a, s) => a + s.duration_sec, 0)
  const sequential = b1 + b2
  const parallel = Math.max(b1, b2 || 0)
  return { sequential, parallel, savings: sequential - parallel }
}
function formatAmount(v) { return v === Math.floor(v) ? String(v) : v.toFixed(1).replace(/\.0$/, '') }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { fridge: SEED_FRIDGE, submittedRecipes: [], ...JSON.parse(raw) }
  } catch { /* corrupt or unavailable storage */ }
  return { fridge: SEED_FRIDGE, submittedRecipes: [] }
}

function renderMarkdownLite(text) {
  const blocks = text.split(/\n{2,}/)
  return blocks.map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i} style={{ fontSize: 16, fontWeight: 900, color: T.text1, marginTop: 16, marginBottom: 4 }}>{block.slice(3)}</h2>
    const items = block.split('\n').filter((l) => l.startsWith('- '))
    if (items.length > 0) {
      return (
        <ul key={i} style={{ paddingLeft: 18, margin: '6px 0' }}>
          {items.map((it, j) => <li key={j} style={{ fontSize: 13.5, color: T.text2, lineHeight: 1.7 }}>{it.slice(2).replace(/\*\*/g, '')}</li>)}
        </ul>
      )
    }
    return <p key={i} style={{ fontSize: 13.5, color: T.text2, lineHeight: 1.7, margin: '6px 0' }}>{block.replace(/\*\*/g, '')}</p>
  })
}

function ScreenHeader({ title, subtitle, action }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '18px 20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, maxWidth: 720, margin: '0 auto' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 21, fontWeight: 900, letterSpacing: -0.3, color: T.text1 }}>{title}</h1>
          {subtitle && <p style={{ margin: '3px 0 0', fontSize: 12.5, fontWeight: 500, color: T.text3 }}>{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  )
}

function Badge({ children, color, bg }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 999, color, background: bg || `${color}18` }}>{children}</span>
}

function MatchRing({ rate }) {
  const r = 14, circ = 2 * Math.PI * r
  const color = rate >= 80 ? T.green : rate >= 50 ? T.amber : T.text3
  return (
    <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
      <svg viewBox="0 0 36 36" width={44} height={44} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="18" cy="18" r={r} fill="none" stroke={T.border} strokeWidth="2.5" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={`${(rate / 100) * circ} ${circ}`} strokeLinecap="round" />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color }}>{rate}%</span>
    </div>
  )
}

export default function FlavorSyncDemo() {
  const [state, setState] = useState(null)
  const [tab, setTab] = useState('fridge')
  const [cookingRecipeId, setCookingRecipeId] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [blogFilter, setBlogFilter] = useState(null)
  const [blogQuery, setBlogQuery] = useState('')
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [submitForm, setSubmitForm] = useState({ title: '', story: '', servings: 2 })
  const [addForm, setAddForm] = useState({ name: '', amount: '', unit: 'g', expireDate: addDays(5) })
  const [ocrOpen, setOcrOpen] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrResult, setOcrResult] = useState(null)

  useEffect(() => { setState(loadState()) }, [])
  useEffect(() => {
    if (!state) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* private mode */ }
  }, [state])

  if (!state) return null

  const update = (fn) => setState((prev) => fn({ ...prev }))
  const allRecipes = [...mockRecipes, ...state.submittedRecipes]
  const cookingRecipe = cookingRecipeId ? allRecipes.find((r) => r.id === cookingRecipeId) : null

  const submitRecipe = () => {
    if (!submitForm.title.trim()) return
    update((s) => ({
      ...s,
      submittedRecipes: [...s.submittedRecipes, {
        id: `local_${Date.now()}`, title: submitForm.title.trim(), story: submitForm.story.trim() || '아직 이야기가 없어요.',
        thumbnail: '📝', isCombo: false, servings: Number(submitForm.servings) || 2, ingredients: [], steps: [], isLocalSubmission: true,
      }],
    }))
    setSubmitForm({ title: '', story: '', servings: 2 })
    setShowSubmitForm(false)
  }

  const addFridgeItem = () => {
    if (!addForm.name.trim() || !addForm.amount) return
    update((s) => ({ ...s, fridge: [...s.fridge, { id: `fr_${Date.now()}`, name: addForm.name.trim(), amount: Number(addForm.amount), unit: addForm.unit, expireDate: addForm.expireDate, icon: '🥕' }] }))
    setAddForm({ name: '', amount: '', unit: 'g', expireDate: addDays(5) })
  }
  const deleteFridgeItem = (id) => update((s) => ({ ...s, fridge: s.fridge.filter((i) => i.id !== id) }))

  const runOcr = () => { setOcrOpen(true); setOcrLoading(true); setOcrResult(null); setTimeout(() => { setOcrResult(OCR_SAMPLE_RESULT); setOcrLoading(false) }, 900) }
  const confirmOcr = () => {
    update((s) => ({ ...s, fridge: [...s.fridge, ...ocrResult.map((r, i) => ({ id: `fr_ocr_${Date.now()}_${i}`, ...r, expireDate: addDays(7) }))] }))
    setOcrOpen(false)
  }

  const filteredPosts = mockBlogPosts.filter((p) => (!blogFilter || p.category === blogFilter) && (!blogQuery || p.title.includes(blogQuery) || p.summary.includes(blogQuery)))

  const bodyStyle = { minHeight: '100vh', background: T.bg, color: T.text1, fontFamily: FONT, wordBreak: 'keep-all' }

  if (cookingRecipe) {
    return (
      <div style={bodyStyle}>
        <CookMode T={T} recipe={cookingRecipe} onQuit={() => setCookingRecipeId(null)} />
      </div>
    )
  }

  return (
    <div style={bodyStyle}>
      <div style={{ background: T.amberLight, borderBottom: `1px solid #F4C97A`, padding: '8px 20px', textAlign: 'center', fontSize: 11.5, color: T.amber, fontWeight: 600 }}>
        🧪 데모 모드 — 로그인·냉장고 서버 동기화·영수증 OCR AI 분석 없이 샘플 데이터로 동작해요.
      </div>

      {tab === 'fridge' && (
        <ScreenHeader
          title="🧊 냉장고"
          subtitle={`${state.fridge.length}가지 식재료 보관 중`}
          action={<button onClick={() => setTab('recipes')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, background: T.brand, color: '#fff', border: 'none', cursor: 'pointer' }}>레시피 보기</button>}
        />
      )}
      {tab === 'recipes' && (
        <ScreenHeader
          title="🧊 냉장고 맞춤 레시피"
          subtitle={state.fridge.length > 0 ? `지금 바로 만들 수 있는 레시피 ${allRecipes.filter((r) => getMatchInfo(r, state.fridge).rate >= 80).length}개` : '재료를 등록하면 맞춤 추천을 해드려요'}
          action={<button onClick={() => setShowSubmitForm((v) => !v)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, background: T.brand, color: '#fff', border: 'none', cursor: 'pointer' }}>{showSubmitForm ? '취소' : '+ 등록'}</button>}
        />
      )}
      {tab === 'blog' && <ScreenHeader title="📰 매거진" subtitle="플레이버 싱크 푸드 매거진" />}

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '16px 16px 100px' }}>
        {tab === 'fridge' && (
          <FridgeTab
            T={T}
            items={[...state.fridge].sort((a, b) => daysLeft(a.expireDate) - daysLeft(b.expireDate))}
            onDelete={deleteFridgeItem}
            addForm={addForm}
            setAddForm={setAddForm}
            onAdd={addFridgeItem}
            onOcr={runOcr}
          />
        )}

        {tab === 'recipes' && (
          <RecipesTab
            T={T}
            recipes={allRecipes}
            fridgeItems={state.fridge}
            onStart={setCookingRecipeId}
            showSubmitForm={showSubmitForm}
            submitForm={submitForm}
            setSubmitForm={setSubmitForm}
            onSubmit={submitRecipe}
          />
        )}

        {tab === 'blog' && (
          <BlogTab T={T} posts={filteredPosts} query={blogQuery} setQuery={setBlogQuery} filter={blogFilter} setFilter={setBlogFilter} onOpen={setSelectedPost} />
        )}
      </main>

      {selectedPost && (
        <BlogDetailSheet T={T} post={selectedPost} onClose={() => setSelectedPost(null)} onStartCooking={(id) => { setSelectedPost(null); setTab('recipes'); setCookingRecipeId(id) }} />
      )}

      {ocrOpen && <OcrModal T={T} loading={ocrLoading} result={ocrResult} onClose={() => setOcrOpen(false)} onConfirm={confirmOcr} />}

      <BottomNav T={T} tab={tab} setTab={setTab} />
    </div>
  )
}

function BottomNav({ T, tab, setTab }) {
  const NAV = [
    { id: 'fridge', label: '냉장고', icon: '🧊' },
    { id: 'recipes', label: '레시피', icon: '🍳' },
    { id: 'blog', label: '블로그', icon: '📰' },
  ]
  return (
    <>
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: T.surface, borderTop: `1px solid ${T.border}`, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-around', height: 60 }}>
          {NAV.map((n) => {
            const active = tab === n.id
            return (
              <button key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                {active && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 32, height: 2, borderRadius: 999, background: T.brand }} />}
                <span style={{ fontSize: 20 }}>{n.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? T.brand : T.text3 }}>{n.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
      <Link href="/portfolio" style={{ position: 'fixed', top: 40, right: 16, fontSize: 11, color: T.text3, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: '4px 12px', textDecoration: 'none', zIndex: 30 }}>갤러리로</Link>
    </>
  )
}

function FridgeTab({ T, items, onDelete, addForm, setAddForm, onAdd, onOcr }) {
  const urgent = items.map((i) => ({ ...i, days: daysLeft(i.expireDate) })).filter((i) => i.days <= 3).sort((a, b) => a.days - b.days)
  const inputStyle = { background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text1, fontSize: 13, padding: '9px 12px', outline: 'none' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onOcr} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: T.brandLight, border: `1px solid ${T.brandMid}`, borderRadius: 16, padding: '14px 16px', cursor: 'pointer' }}>
        <span style={{ fontSize: 22 }}>📷</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.brand }}>영수증으로 한 번에 등록 (샘플)</div>
          <div style={{ fontSize: 11.5, color: T.text2, marginTop: 2 }}>실제 OCR·AI 분석 없이 준비된 결과를 보여드려요</div>
        </div>
      </button>

      {urgent.length > 0 && (
        <div style={{ background: T.amberLight, border: '1px solid #F4C97A', borderRadius: 16, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span>⚠️</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.amber }}>유통기한 임박</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {urgent.map((i) => (
              <span key={i.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: '5px 12px', fontSize: 12, fontWeight: 600 }}>
                <span>{i.icon}</span><span>{i.name}</span>
                <span style={{ fontWeight: 900, color: T.amber }}>{i.days === 0 ? 'D-DAY' : `D-${i.days}`}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="재료명" style={{ ...inputStyle, flex: '1 1 120px' }} />
        <input type="number" value={addForm.amount} onChange={(e) => setAddForm((f) => ({ ...f, amount: e.target.value }))} placeholder="수량" style={{ ...inputStyle, width: 80 }} />
        <select value={addForm.unit} onChange={(e) => setAddForm((f) => ({ ...f, unit: e.target.value }))} style={inputStyle}>
          {['g', 'ml', '개', '대', '봉'].map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <input type="date" value={addForm.expireDate} onChange={(e) => setAddForm((f) => ({ ...f, expireDate: e.target.value }))} style={inputStyle} />
        <button onClick={onAdd} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.brand, border: 'none', borderRadius: 10, padding: '9px 16px', cursor: 'pointer' }}>추가</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 8 }}>
        {items.map((item) => {
          const days = daysLeft(item.expireDate)
          const badgeColor = days <= 0 ? T.red : days <= 3 ? T.amber : days <= 7 ? '#92740A' : T.text3
          const badgeBg = days <= 0 ? T.redLight : days <= 3 ? T.amberLight : days <= 7 ? '#FEF9E8' : T.bg
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '14px 16px' }}>
              <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: T.text3, marginTop: 2 }}>{item.amount} {item.unit}</div>
              </div>
              <Badge color={badgeColor} bg={badgeBg}>{days < 0 ? '기한 지남' : days === 0 ? 'D-DAY' : `D-${days}`}</Badge>
              <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', color: T.text3, cursor: 'pointer', fontSize: 13 }}>✕</button>
            </div>
          )
        })}
        {items.length === 0 && <div style={{ fontSize: 13, color: T.text3, textAlign: 'center', padding: 30 }}>냉장고가 비어있어요.</div>}
      </div>
    </div>
  )
}

function RecipesTab({ T, recipes, fridgeItems, onStart, showSubmitForm, submitForm, setSubmitForm, onSubmit }) {
  const sorted = [...recipes].sort((a, b) => getMatchInfo(b, fridgeItems).rate - getMatchInfo(a, fridgeItems).rate)
  const canMakeNow = sorted.filter((r) => getMatchInfo(r, fridgeItems).rate >= 80).length
  const inputStyle = { background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text1, fontSize: 13, padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showSubmitForm && (
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input value={submitForm.title} onChange={(e) => setSubmitForm((f) => ({ ...f, title: e.target.value }))} placeholder="레시피 제목" style={inputStyle} />
          <textarea value={submitForm.story} onChange={(e) => setSubmitForm((f) => ({ ...f, story: e.target.value }))} placeholder="이 레시피에 담긴 이야기 (선택)" style={{ ...inputStyle, height: 60, resize: 'none' }} />
          <div style={{ fontSize: 11, color: T.text3 }}>샘플 등록이라 이 브라우저에만 저장되고, 실제 위키에는 올라가지 않아요.</div>
          <button onClick={onSubmit} disabled={!submitForm.title.trim()} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.brand, border: 'none', borderRadius: 10, padding: '10px', cursor: 'pointer', alignSelf: 'flex-start' }}>등록하기</button>
        </div>
      )}

      {fridgeItems.length === 0 ? (
        <div style={{ borderRadius: 16, background: T.brandLight, border: `1px solid ${T.brandMid}`, padding: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 22 }}>💡</span>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.brand }}>냉장고 재료를 먼저 등록해 보세요</p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: T.text2 }}>재료를 등록하면 지금 당장 만들 수 있는 레시피를 % 기준으로 추천해 드립니다.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
          <div style={{ background: T.greenLight, borderRadius: 14, padding: 12 }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: T.green }}>{canMakeNow}</p>
            <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.green }}>바로 가능</p>
          </div>
          <div style={{ background: T.brandLight, borderRadius: 14, padding: 12 }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: T.brand }}>{fridgeItems.length}</p>
            <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.brand }}>보유 식재료</p>
          </div>
          <div style={{ background: T.purpleLight, borderRadius: 14, padding: 12 }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: T.purple }}>{sorted.filter((r) => r.isCombo).length}</p>
            <p style={{ margin: '2px 0 0', fontSize: 11.5, color: T.purple }}>2구 코스</p>
          </div>
        </div>
      )}

      <div style={{ background: `linear-gradient(90deg, ${T.purpleLight}, #EBF2FF)`, border: `1px solid #D9CFFF`, borderRadius: 16, padding: 14 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.purple }}>⚡ 2구 병렬 조리란?</p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B3FD4' }}>두 화구를 동시에 사용해 메인과 국을 함께 완성. 순차 조리 대비 최대 47% 시간 단축!</p>
      </div>

      <p style={{ fontSize: 11.5, fontWeight: 700, color: T.text3, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>
        {fridgeItems.length > 0 ? '보유 재료 많은 순' : '전체 레시피'}
      </p>

      {sorted.map((recipe) => (
        <RecipeCard key={recipe.id} T={T} recipe={recipe} fridgeItems={fridgeItems} onStart={onStart} />
      ))}
    </div>
  )
}

function RecipeCard({ T, recipe, fridgeItems, onStart }) {
  const [open, setOpen] = useState(false)
  const [servings, setServings] = useState(recipe.servings)
  const match = getMatchInfo(recipe, fridgeItems)
  const { parallel, sequential, savings } = getTimings(recipe)
  const ratio = servings / recipe.servings

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: T.surface, border: `1px solid ${T.border}` }}>
      <button onClick={() => setOpen((v) => !v)} style={{ width: '100%', textAlign: 'left', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
        <MatchRing rate={match.rate} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            {match.rate >= 80 && <Badge color={T.green} bg={T.greenLight}>✓ 바로 가능</Badge>}
            {match.rate >= 50 && match.rate < 80 && <Badge color={T.amber} bg={T.amberLight}>재료 {match.total - match.have}개 부족</Badge>}
            {match.rate < 50 && match.total > 0 && <Badge color={T.text3} bg={T.bg}>{match.have}/{match.total}개 보유</Badge>}
            {recipe.isCombo && <Badge color={T.purple} bg={T.purpleLight}>⚡ 2구</Badge>}
            {recipe.isLocalSubmission && <Badge color={T.brand} bg={T.brandLight}>내 등록 (샘플)</Badge>}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{recipe.thumbnail} {recipe.title}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 3, fontSize: 12, color: T.text3 }}>
            <span>⏱ {Math.round((parallel || 60) / 60)}분</span>
            <span>👥 {recipe.servings}인분</span>
          </div>
        </div>
        <span style={{ color: T.text3, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>⌄</span>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${T.border}` }}>
          {recipe.isCombo && savings > 60 && (
            <div style={{ margin: '16px 16px 0', borderRadius: 12, padding: 12, background: T.purpleLight, border: '1px solid #D9CFFF' }}>
              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: T.purple }}>⚡ 2구 병렬 시간 분석</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
                {[['1구 순차', `${Math.round(sequential / 60)}분`, T.text2], ['2구 병렬', `${Math.round(parallel / 60)}분`, T.purple], ['절약', `-${Math.round(savings / 60)}분`, T.green]].map(([l, v, c]) => (
                  <div key={l}><p style={{ margin: 0, fontSize: 11, color: T.text3 }}>{l}</p><p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 900, color: c }}>{v}</p></div>
                ))}
              </div>
            </div>
          )}

          {recipe.ingredients.length > 0 && (
            <div style={{ padding: '16px 16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 12, padding: '10px 14px', background: T.brandLight, border: '1px solid rgba(201,75,42,0.15)', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text2, flex: 1 }}>인분 조절</span>
                <button onClick={() => setServings((s) => Math.max(1, s - 1))} style={scalerBtn(T)}>−</button>
                <span style={{ width: 56, textAlign: 'center', fontWeight: 900, fontSize: 16, color: T.brand }}>{servings}인분</span>
                <button onClick={() => setServings((s) => Math.min(10, s + 1))} style={scalerBtn(T)}>+</button>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.text3, marginBottom: 8 }}>주재료</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recipe.ingredients.filter((i) => i.type === 'main').map((ing) => {
                  const owned = fridgeItems.some((f) => ingredientMatches(f, ing))
                  return (
                    <div key={ing.ingredient_id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: owned ? T.green : T.border, color: owned ? '#fff' : T.text3, fontSize: 11, fontWeight: 700 }}>{owned ? '✓' : '·'}</span>
                      <span style={{ fontSize: 13, color: owned ? T.text1 : T.text3 }}>{ing.name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: ratio !== 1 ? T.brand : T.text3, fontWeight: 600 }}>{formatAmount(ing.base_amount * ratio)}{ing.unit}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {recipe.steps.length > 0 && (
            <div style={{ padding: '16px 16px 0' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.text3, marginBottom: 8 }}>조리 순서</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recipe.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, background: step.burner === 1 ? T.brandLight : step.burner === 2 ? T.blueLight : T.bg, color: step.burner === 1 ? T.brand : step.burner === 2 ? T.blue : T.text2 }}>{step.burner ?? '·'}</span>
                    <span style={{ flex: 1, fontSize: 13, color: T.text2 }}>{step.action}</span>
                    <span style={{ fontSize: 12, color: T.text3 }}>{Math.round(step.duration_sec / 60)}분</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: 16 }}>
            {recipe.steps.length > 0 ? (
              <button onClick={() => onStart(recipe.id)} style={{ width: '100%', height: 52, borderRadius: 16, fontWeight: 700, fontSize: 15, background: T.brand, color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(201,75,42,0.3)' }}>
                {recipe.isCombo ? '2구 코스 조리 시작' : '조리 시작'}
              </button>
            ) : (
              <div style={{ fontSize: 12, color: T.text3, textAlign: 'center' }}>이 레시피는 아직 상세 조리 단계가 없어요.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
function scalerBtn(T) {
  return { width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, background: T.surface, color: T.brand, border: `1px solid ${T.brandMid}`, cursor: 'pointer' }
}

function CookMode({ T, recipe, onQuit }) {
  const isDessert = recipe.steps.every((s) => s.burner === null)
  const b1Steps = isDessert ? recipe.steps : recipe.steps.filter((s) => s.burner === 1)
  const b2Steps = recipe.steps.filter((s) => s.burner === 2)
  const [b1Idx, setB1Idx] = useState(0)
  const [b2Idx, setB2Idx] = useState(0)
  const [done, setDone] = useState(false)

  const b1Done = b1Idx >= b1Steps.length
  const b2Done = !recipe.isCombo || b2Idx >= b2Steps.length

  return (
    <div>
      <div style={{ background: T.amberLight, borderBottom: '1px solid #F4C97A', padding: '8px 20px', textAlign: 'center', fontSize: 11.5, color: T.amber, fontWeight: 600 }}>
        🧪 샘플 요리 모드 — 실제 화구·음성인식 연동 없이 타이머만 동작해요.
      </div>
      <ScreenHeader
        title={recipe.title}
        subtitle={recipe.isCombo ? '2구 병렬 조리' : '1구 조리'}
        action={<button onClick={onQuit} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: T.bg, color: T.text3, border: 'none', cursor: 'pointer' }}>✕ 종료</button>}
      />
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <BurnerPlayer T={T} burner={1} steps={b1Steps} idx={b1Idx} setIdx={setB1Idx} isDone={b1Done} />
        {recipe.isCombo && <BurnerPlayer T={T} burner={2} steps={b2Steps} idx={b2Idx} setIdx={setB2Idx} isDone={b2Done} />}
        <GanttTimeline T={T} recipe={recipe} b1Idx={b1Idx} b2Idx={b2Idx} />
        {b1Done && b2Done && !done && (
          <button onClick={() => setDone(true)} style={{ width: '100%', height: 54, borderRadius: 16, fontWeight: 700, fontSize: 15, background: T.green, color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(43,122,79,0.3)' }}>
            요리 완료!
          </button>
        )}
        {done && (
          <div style={{ textAlign: 'center', padding: 24, background: T.greenLight, borderRadius: 16 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: T.green, marginBottom: 12 }}>{recipe.title} 완성!</div>
            <button onClick={onQuit} style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, background: T.green, color: '#fff', border: 'none', cursor: 'pointer' }}>레시피 목록으로</button>
          </div>
        )}
      </main>
    </div>
  )
}

function BurnerPlayer({ T, burner, steps, idx, setIdx, isDone }) {
  const isB1 = burner === 1
  const accent = isB1 ? T.brand : T.blue
  const accentBg = isB1 ? T.brandLight : T.blueLight
  const step = steps[idx]
  const [remaining, setRemaining] = useState(step?.duration_sec || 0)
  const timerRef = useRef(null)

  useEffect(() => {
    setRemaining(steps[idx]?.duration_sec || 0)
  }, [idx, steps])

  useEffect(() => {
    if (isDone || !step) return
    timerRef.current = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(timerRef.current)
  }, [step, isDone])

  if (steps.length === 0) return null

  const progress = step ? Math.min(100, ((step.duration_sec - remaining) / step.duration_sec) * 100) : 100
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const circ = 2 * Math.PI * 34

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: T.surface, border: `1.5px solid ${isB1 ? 'rgba(201,75,42,0.2)' : 'rgba(37,99,235,0.2)'}` }}>
      <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: accentBg }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{BURNER_LABEL[burner]}</span>
        {isDone && <Badge color="#fff" bg={accent}>완료</Badge>}
      </div>
      {isDone ? (
        <div style={{ padding: '24px 16px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: T.text2 }}>조리 완료</p>
        </div>
      ) : step ? (
        <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 900, color: accent }}>{step.action}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: T.text2, lineHeight: 1.6 }}>{step.description}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg width={80} height={80} viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke={T.border} strokeWidth="5" />
                <circle cx="40" cy="40" r="34" fill="none" stroke={accent} strokeWidth="5" strokeDasharray={circ} strokeDashoffset={circ * (1 - progress / 100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: accent }}>{mm}:{ss}</div>
            </div>
            <button onClick={() => setIdx((i) => i + 1)} style={{ flex: 1, height: 56, borderRadius: 16, fontWeight: 700, fontSize: 14, background: accent, color: '#fff', border: 'none', cursor: 'pointer' }}>
              다음 단계 →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function GanttTimeline({ T, recipe, b1Idx, b2Idx }) {
  function timings(burner) {
    let elapsed = 0
    return recipe.steps.filter((s) => s.burner === burner).map((s) => { const start = elapsed; elapsed += s.duration_sec; return { ...s, start, end: elapsed } })
  }
  const b1 = timings(1), b2 = timings(2)
  const total = Math.max(b1.length ? b1[b1.length - 1].end : 0, b2.length ? b2[b2.length - 1].end : 0)
  if (total === 0) return null

  const row = (steps, currentIdx, color, label) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: T.text3, width: 40, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, position: 'relative', height: 24, background: T.bg, borderRadius: 999, overflow: 'hidden' }}>
        {steps.map((s, i) => {
          const left = (s.start / total) * 100, width = ((s.end - s.start) / total) * 100
          const doneOrActive = i <= currentIdx
          return (
            <div key={i} title={s.action} style={{ position: 'absolute', top: 0, bottom: 0, left: `${left}%`, width: `${width}%`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', background: doneOrActive ? color : T.border, opacity: i < currentIdx ? 0.6 : 1 }}>
              {width > 8 && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px' }}>{s.action}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div style={{ background: T.surface, borderRadius: 16, padding: 16, border: `1px solid ${T.border}` }}>
      <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: T.text2 }}>전체 타임라인</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {row(b1, b1Idx, T.brand, '버너1')}
        {b2.length > 0 && row(b2, b2Idx, T.blue, '버너2')}
      </div>
    </div>
  )
}

function BlogTab({ T, posts, query, setQuery, filter, setFilter, onOpen }) {
  const inputStyle = { width: '100%', height: 44, paddingLeft: 38, paddingRight: 14, borderRadius: 16, border: `1px solid ${T.border}`, background: T.surface, fontSize: 13, outline: 'none', boxSizing: 'border-box' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.text3 }}>🔍</span>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="아티클 검색 (재료, 요리팁...)" style={inputStyle} />
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
        <button onClick={() => setFilter(null)} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: filter === null ? T.text1 : T.surface, color: filter === null ? '#fff' : T.text2, border: `1px solid ${filter === null ? T.text1 : T.border}` }}>전체</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setFilter(filter === c ? null : c)} style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: filter === c ? T.brand : T.surface, color: filter === c ? '#fff' : T.text2, border: `1px solid ${filter === c ? T.brand : T.border}` }}>
            {CATEGORY_EMOJI[c]} {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts.map((p) => (
          <button key={p.id} onClick={() => onOpen(p)} style={{ textAlign: 'left', background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, padding: 14, display: 'flex', gap: 12, cursor: 'pointer' }}>
            <div style={{ width: 60, height: 60, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${T.brandLight}, #FFF3E0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{p.thumbnail}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                <Badge color={T.brand} bg={T.brandLight}>{p.category}</Badge>
                {p.related_recipe_id && <Badge color={T.green} bg={T.greenLight}>🍳 레시피 연결</Badge>}
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: T.text1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.title}</p>
              <p style={{ margin: '4px 0 0', fontSize: 11.5, color: T.text3 }}>{p.author} · {p.published_at} · {p.readTime}분 읽기</p>
            </div>
          </button>
        ))}
        {posts.length === 0 && <div style={{ textAlign: 'center', color: T.text3, padding: 30, fontSize: 13 }}>검색 결과가 없어요.</div>}
      </div>
    </div>
  )
}

function BlogDetailSheet({ T, post, onClose, onStartCooking }) {
  const relatedRecipe = post.related_recipe_id ? mockRecipes.find((r) => r.id === post.related_recipe_id) : null
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 59 }} />
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 640, background: T.surface, borderRadius: '24px 24px 0 0', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 40, height: 4, background: T.border, borderRadius: 999, margin: '12px auto 4px' }} />
          <div style={{ padding: '10px 20px 16px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 40 }}>{post.thumbnail}</span>
              <div style={{ flex: 1 }}>
                <Badge color={T.brand} bg={T.brandLight}>{post.category}</Badge>
                <h2 style={{ margin: '6px 0 0', fontWeight: 900, fontSize: 17, color: T.text1, lineHeight: 1.4 }}>{post.title}</h2>
                <p style={{ margin: '4px 0 0', fontSize: 11.5, color: T.text3 }}>{post.author} · {post.published_at} · {post.readTime}분 읽기</p>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: T.text2, background: T.brandLight, borderRadius: 12, padding: 12, fontStyle: 'italic' }}>{post.summary}</p>
            {renderMarkdownLite(post.body)}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {post.tags.map((tag) => <span key={tag} style={{ padding: '4px 10px', borderRadius: 999, background: T.bg, color: T.text3, fontSize: 11 }}>#{tag}</span>)}
            </div>
            {relatedRecipe && (
              <button onClick={() => onStartCooking(relatedRecipe.id)} style={{ width: '100%', marginTop: 20, height: 54, borderRadius: 16, background: T.brand, color: '#fff', fontWeight: 700, fontSize: 14.5, border: 'none', cursor: 'pointer', boxShadow: '0 2px 12px rgba(201,75,42,0.3)' }}>
                🍳 {relatedRecipe.title} 바로 조리하기 →
              </button>
            )}
          </div>
          <div style={{ padding: '10px 20px 20px', borderTop: `1px solid ${T.border}` }}>
            <button onClick={onClose} style={{ width: '100%', height: 48, borderRadius: 16, border: `2px solid ${T.border}`, color: T.text2, fontWeight: 600, fontSize: 14, background: 'none', cursor: 'pointer' }}>닫기</button>
          </div>
        </div>
      </div>
    </>
  )
}

function OcrModal({ T, loading, result, onClose, onConfirm }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 69 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: T.surface, borderRadius: 20, width: '100%', maxWidth: 360, padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 10, color: T.text1 }}>영수증 스캔 결과 (샘플)</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: T.text3, fontSize: 13 }}>영수증을 분석하고 있어요…</div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: T.text3, marginBottom: 10 }}>실제 OCR·AI 분석 없이 준비된 샘플 결과예요.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {result.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', fontSize: 13, background: T.bg, borderRadius: 10, padding: '8px 12px' }}>
                    <span>{r.icon} {r.name}</span>
                    <span style={{ color: T.text3 }}>{r.amount}{r.unit}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={{ fontSize: 13, color: T.text3, background: T.bg, border: 'none', borderRadius: 10, padding: '9px 16px', cursor: 'pointer' }}>취소</button>
                <button onClick={onConfirm} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.brand, border: 'none', borderRadius: 10, padding: '9px 16px', cursor: 'pointer' }}>냉장고에 추가</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
