'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { mockRecipes } from '../../data/flavorsyncRecipes'
import { mockBlogPosts } from '../../data/flavorsyncBlog'

const T = { bg: '#09090b', surface: '#18181b', border: '#27272a', text: '#f4f4f5', muted: '#71717a', emerald: '#10b981', indigo: '#6366f1', red: '#ef4444', amber: '#f59e0b' }
const STORAGE_KEY = 'tf_flavorsync_demo_v1'
const CATEGORIES = ['요리팁', '식재료이야기', '건강식', '시즌레시피', '미각탐구']

const BURNER_LABEL = { 1: '버너 1', 2: '버너 2', null: '공통' }
const BURNER_COLOR = { 1: T.indigo, 2: T.amber, null: T.muted }

const SEED_FRIDGE = [
  { id: 'fr1', name: '돼지고기', amount: 300, unit: 'g', expireDate: addDays(2) },
  { id: 'fr2', name: '두부', amount: 1, unit: '개', expireDate: addDays(4) },
  { id: 'fr3', name: '대파', amount: 1, unit: '대', expireDate: addDays(7) },
]

const OCR_SAMPLE_RESULT = [
  { name: '양파', amount: 3, unit: '개' },
  { name: '달걀', amount: 10, unit: '개' },
  { name: '김치', amount: 500, unit: 'g' },
]

function addDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function daysLeft(dateStr) {
  const diff = (new Date(dateStr) - new Date(new Date().toDateString())) / 86400000
  return Math.round(diff)
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { fridge: SEED_FRIDGE, submittedRecipes: [], ...JSON.parse(raw) }
  } catch { /* corrupt or unavailable storage */ }
  return { fridge: SEED_FRIDGE, submittedRecipes: [] }
}

function Badge({ children, color }) {
  return (
    <span style={{ display: 'inline-block', padding: '1px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, border: `1px solid ${color}55`, color, background: `${color}18` }}>
      {children}
    </span>
  )
}

function renderMarkdownLite(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <div key={i} style={{ fontWeight: 800, fontSize: 16, color: T.emerald, marginTop: 18, marginBottom: 6 }}>{line.slice(3)}</div>
    if (line.startsWith('- ')) return <div key={i} style={{ fontSize: 13.5, color: T.text, lineHeight: 1.7, paddingLeft: 14, position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>{line.slice(2).replace(/\*\*/g, '')}</div>
    if (line.trim() === '') return <div key={i} style={{ height: 6 }} />
    return <div key={i} style={{ fontSize: 13.5, color: T.text, lineHeight: 1.7 }}>{line.replace(/\*\*/g, '')}</div>
  })
}

export default function FlavorSyncDemo() {
  const [state, setState] = useState(null)
  const [tab, setTab] = useState('recipes')
  const [recipeView, setRecipeView] = useState({ mode: 'list', id: null, servings: null })
  const [blogFilter, setBlogFilter] = useState('전체')
  const [selectedPost, setSelectedPost] = useState(null)
  const [submitForm, setSubmitForm] = useState({ title: '', story: '', servings: 2 })
  const [showSubmitForm, setShowSubmitForm] = useState(false)
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
  const recipe = recipeView.id ? allRecipes.find((r) => r.id === recipeView.id) : null

  const openRecipe = (id) => {
    const r = allRecipes.find((x) => x.id === id)
    setRecipeView({ mode: 'detail', id, servings: r?.servings || 2 })
  }

  const startCook = () => setRecipeView((v) => ({ ...v, mode: 'cook' }))
  const backToList = () => setRecipeView({ mode: 'list', id: null, servings: null })

  const submitRecipe = () => {
    if (!submitForm.title.trim()) return
    const id = `local_${Date.now()}`
    update((s) => ({
      ...s,
      submittedRecipes: [...s.submittedRecipes, {
        id, title: submitForm.title.trim(), story: submitForm.story.trim() || '아직 이야기가 없어요.',
        thumbnail: '📝', isCombo: false, servings: Number(submitForm.servings) || 2,
        ingredients: [], steps: [], isLocalSubmission: true,
      }],
    }))
    setSubmitForm({ title: '', story: '', servings: 2 })
    setShowSubmitForm(false)
  }

  const addFridgeItem = () => {
    if (!addForm.name.trim() || !addForm.amount) return
    update((s) => ({ ...s, fridge: [...s.fridge, { id: `fr_${Date.now()}`, name: addForm.name.trim(), amount: Number(addForm.amount), unit: addForm.unit, expireDate: addForm.expireDate }] }))
    setAddForm({ name: '', amount: '', unit: 'g', expireDate: addDays(5) })
  }
  const deleteFridgeItem = (id) => update((s) => ({ ...s, fridge: s.fridge.filter((i) => i.id !== id) }))

  const runOcr = () => {
    setOcrOpen(true)
    setOcrLoading(true)
    setOcrResult(null)
    setTimeout(() => { setOcrResult(OCR_SAMPLE_RESULT); setOcrLoading(false) }, 900)
  }
  const confirmOcr = () => {
    update((s) => ({ ...s, fridge: [...s.fridge, ...ocrResult.map((r, i) => ({ id: `fr_ocr_${Date.now()}_${i}`, name: r.name, amount: r.amount, unit: r.unit, expireDate: addDays(7) }))] }))
    setOcrOpen(false)
  }

  const filteredPosts = blogFilter === '전체' ? mockBlogPosts : mockBlogPosts.filter((p) => p.category === blogFilter)

  const inputStyle = { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, padding: '7px 10px', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text }}>
      <div style={{ background: `${T.amber}18`, borderBottom: `1px solid ${T.amber}44`, padding: '8px 24px', textAlign: 'center', fontSize: 12, color: T.amber }}>
        🧪 데모 모드 — 로그인·냉장고 서버 동기화·영수증 OCR AI 분석 없이 샘플 데이터로 동작해요.
      </div>
      <header style={{ borderBottom: `1px solid ${T.border}`, padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/portfolio" style={{ fontWeight: 800, fontSize: 15, textDecoration: 'none', color: T.text }}>
          Flavor<span style={{ color: T.emerald }}>Sync</span>
        </Link>
        <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
          {[{ id: 'recipes', label: '레시피' }, { id: 'fridge', label: '냉장고' }, { id: 'blog', label: '블로그' }].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); if (t.id === 'recipes') backToList() }}
              style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: tab === t.id ? T.border : 'transparent', color: tab === t.id ? T.text : T.muted, fontSize: 12, fontWeight: tab === t.id ? 600 : 400 }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Link href="/portfolio" style={{ marginLeft: 'auto', fontSize: 12, color: T.muted, textDecoration: 'none' }}>갤러리로</Link>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        {tab === 'recipes' && recipeView.mode === 'list' && (
          <RecipeListView
            T={T}
            recipes={allRecipes}
            onOpen={openRecipe}
            showSubmitForm={showSubmitForm}
            setShowSubmitForm={setShowSubmitForm}
            submitForm={submitForm}
            setSubmitForm={setSubmitForm}
            onSubmit={submitRecipe}
            inputStyle={inputStyle}
          />
        )}
        {tab === 'recipes' && recipeView.mode === 'detail' && recipe && (
          <RecipeDetailView T={T} recipe={recipe} servings={recipeView.servings} setServings={(n) => setRecipeView((v) => ({ ...v, servings: n }))} onBack={backToList} onCook={startCook} />
        )}
        {tab === 'recipes' && recipeView.mode === 'cook' && recipe && (
          <CookModeView T={T} recipe={recipe} onExit={() => setRecipeView((v) => ({ ...v, mode: 'detail' }))} onDone={backToList} />
        )}

        {tab === 'fridge' && (
          <FridgeView
            T={T}
            items={[...state.fridge].sort((a, b) => daysLeft(a.expireDate) - daysLeft(b.expireDate))}
            onDelete={deleteFridgeItem}
            addForm={addForm}
            setAddForm={setAddForm}
            onAdd={addFridgeItem}
            onOcr={runOcr}
            inputStyle={inputStyle}
          />
        )}

        {tab === 'blog' && !selectedPost && (
          <BlogListView T={T} posts={filteredPosts} filter={blogFilter} setFilter={setBlogFilter} onOpen={setSelectedPost} />
        )}
        {tab === 'blog' && selectedPost && (
          <BlogDetailView T={T} post={selectedPost} onBack={() => setSelectedPost(null)} onOpenRecipe={(id) => { setSelectedPost(null); setTab('recipes'); openRecipe(id) }} />
        )}
      </main>

      {ocrOpen && (
        <OcrModal T={T} loading={ocrLoading} result={ocrResult} onClose={() => setOcrOpen(false)} onConfirm={confirmOcr} />
      )}
    </div>
  )
}

function RecipeListView({ T, recipes, onOpen, showSubmitForm, setShowSubmitForm, submitForm, setSubmitForm, onSubmit, inputStyle }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>레시피 위키</div>
        <button onClick={() => setShowSubmitForm((v) => !v)} style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: T.indigo, border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}>
          {showSubmitForm ? '취소' : '+ 레시피 등록'}
        </button>
      </div>

      {showSubmitForm && (
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input value={submitForm.title} onChange={(e) => setSubmitForm((f) => ({ ...f, title: e.target.value }))} placeholder="레시피 제목" style={inputStyle} />
          <textarea value={submitForm.story} onChange={(e) => setSubmitForm((f) => ({ ...f, story: e.target.value }))} placeholder="이 레시피에 담긴 이야기 (선택)" style={{ ...inputStyle, height: 60, resize: 'none' }} />
          <div style={{ fontSize: 11, color: T.muted }}>샘플 등록이라 이 브라우저에만 저장되고, 실제 위키에는 올라가지 않아요.</div>
          <button onClick={onSubmit} disabled={!submitForm.title.trim()} style={{ fontSize: 12, fontWeight: 600, color: T.bg, background: T.emerald, border: 'none', borderRadius: 6, padding: '8px', cursor: 'pointer', alignSelf: 'flex-start' }}>등록하기</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {recipes.map((r) => (
          <div key={r.id} onClick={() => onOpen(r.id)} style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, cursor: 'pointer', background: T.surface }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{r.thumbnail}</div>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>{r.title}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {r.isCombo && <Badge color={T.amber}>콤보</Badge>}
              {r.isLocalSubmission && <Badge color={T.indigo}>내 등록 (샘플)</Badge>}
              <Badge color={T.muted}>{r.servings}인분</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecipeDetailView({ T, recipe, servings, setServings, onBack, onCook }) {
  const scale = servings / recipe.servings
  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 13, marginBottom: 12, padding: 0 }}>← 레시피 목록</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 36 }}>{recipe.thumbnail}</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{recipe.title}</div>
          {recipe.isCombo && <Badge color={T.amber}>콤보 요리</Badge>}
        </div>
      </div>
      <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 20 }}>{recipe.story}</p>

      {recipe.ingredients.length > 0 && (
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>재료</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setServings(Math.max(1, servings - 1))} style={scaleBtn(T)}>−</button>
              <span style={{ fontSize: 13, fontWeight: 600, minWidth: 50, textAlign: 'center' }}>{servings}인분</span>
              <button onClick={() => setServings(servings + 1)} style={scaleBtn(T)}>+</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recipe.ingredients.map((ing) => (
              <div key={ing.ingredient_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: T.text }}>{ing.name}</span>
                <span style={{ color: T.muted }}>{Math.round(ing.base_amount * scale * 10) / 10}{ing.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recipe.steps.length > 0 && (
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>조리 순서 ({recipe.steps.length}단계)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recipe.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: T.muted }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{step.action}</span>
                    <Badge color={BURNER_COLOR[step.burner]}>{BURNER_LABEL[step.burner]}</Badge>
                    <span style={{ fontSize: 11, color: T.muted }}>{Math.round(step.duration_sec / 60) || 1}분</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.muted }}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onCook} style={{ marginTop: 14, width: '100%', fontSize: 13.5, fontWeight: 600, color: T.bg, background: T.emerald, border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer' }}>▶ 요리 시작</button>
        </div>
      )}
      {recipe.steps.length === 0 && (
        <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: 20 }}>이 레시피는 아직 상세 조리 단계가 없어요.</div>
      )}
    </div>
  )
}

function scaleBtn(T) {
  return { width: 26, height: 26, borderRadius: 6, border: `1px solid ${T.border}`, background: T.surface, color: T.text, cursor: 'pointer', fontSize: 14 }
}

function CookModeView({ T, recipe, onExit, onDone }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [remaining, setRemaining] = useState(recipe.steps[0]?.duration_sec || 0)
  const [running, setRunning] = useState(true)
  const intervalRef = useRef(null)

  const step = recipe.steps[stepIdx]

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, stepIdx])

  const next = () => {
    if (stepIdx >= recipe.steps.length - 1) { onDone(); return }
    const ni = stepIdx + 1
    setStepIdx(ni)
    setRemaining(recipe.steps[ni].duration_sec)
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const pct = step.duration_sec ? Math.round((1 - remaining / step.duration_sec) * 100) : 100

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
      <button onClick={onExit} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0, alignSelf: 'flex-start' }}>← 조리법으로 돌아가기</button>
      <div style={{ fontSize: 12, color: T.muted, marginBottom: 4 }}>{recipe.title} · {stepIdx + 1}/{recipe.steps.length}단계</div>
      <Badge color={BURNER_COLOR[step.burner]}>{BURNER_LABEL[step.burner]}</Badge>
      <div style={{ fontSize: 20, fontWeight: 800, margin: '14px 0 6px' }}>{step.action}</div>
      <div style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>{step.description}</div>
      <div style={{ fontSize: 44, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginBottom: 14 }}>{mm}:{ss}</div>
      <div style={{ height: 6, borderRadius: 999, background: T.surface, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: T.emerald, transition: 'width 1s linear' }} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={() => setRunning((r) => !r)} style={{ fontSize: 13, fontWeight: 600, color: T.text, background: T.border, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>
          {running ? '일시정지' : '재개'}
        </button>
        <button onClick={next} style={{ fontSize: 13, fontWeight: 600, color: T.bg, background: T.emerald, border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>
          {stepIdx >= recipe.steps.length - 1 ? '완성!' : '다음 단계 →'}
        </button>
      </div>
    </div>
  )
}

function FridgeView({ T, items, onDelete, addForm, setAddForm, onAdd, onOcr, inputStyle }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>냉장고</div>
        <button onClick={onOcr} style={{ fontSize: 12, fontWeight: 600, color: T.bg, background: T.amber, border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}>📷 영수증으로 스캔 (샘플)</button>
      </div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="재료명" style={{ ...inputStyle, flex: '1 1 120px' }} />
        <input type="number" value={addForm.amount} onChange={(e) => setAddForm((f) => ({ ...f, amount: e.target.value }))} placeholder="수량" style={{ ...inputStyle, width: 80 }} />
        <select value={addForm.unit} onChange={(e) => setAddForm((f) => ({ ...f, unit: e.target.value }))} style={inputStyle}>
          {['g', 'ml', '개', '대', '봉'].map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <input type="date" value={addForm.expireDate} onChange={(e) => setAddForm((f) => ({ ...f, expireDate: e.target.value }))} style={inputStyle} />
        <button onClick={onAdd} style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: T.indigo, border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}>추가</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => {
          const d = daysLeft(item.expireDate)
          const color = d <= 1 ? T.red : d <= 4 ? T.amber : T.emerald
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{item.amount}{item.unit}</div>
              </div>
              <Badge color={color}>{d < 0 ? '기한 지남' : d === 0 ? '오늘까지' : `D-${d}`}</Badge>
              <button onClick={() => onDelete(item.id)} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 12 }}>✕</button>
            </div>
          )
        })}
        {items.length === 0 && <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: 20 }}>냉장고가 비어있어요.</div>}
      </div>
    </div>
  )
}

function OcrModal({ T, loading, result, onClose, onConfirm }) {
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 59 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, width: '100%', maxWidth: 360, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>영수증 스캔 결과 (샘플)</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 20, color: T.muted, fontSize: 13 }}>영수증을 분석하고 있어요…</div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>실제 OCR·AI 분석 없이 준비된 샘플 결과예요.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {result.map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, background: T.bg, borderRadius: 6, padding: '6px 10px' }}>
                    <span>{r.name}</span>
                    <span style={{ color: T.muted }}>{r.amount}{r.unit}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={{ fontSize: 12, color: T.muted, background: T.border, border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}>취소</button>
                <button onClick={onConfirm} style={{ fontSize: 12, fontWeight: 600, color: T.bg, background: T.emerald, border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}>냉장고에 추가</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function BlogListView({ T, posts, filter, setFilter, onOpen }) {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>매거진</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {['전체', ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilter(c)} style={{ fontSize: 12, fontWeight: 600, color: filter === c ? T.bg : T.text, background: filter === c ? T.emerald : 'transparent', border: `1px solid ${filter === c ? T.emerald : T.border}`, borderRadius: 999, padding: '5px 12px', cursor: 'pointer' }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {posts.map((p) => (
          <div key={p.id} onClick={() => onOpen(p)} style={{ display: 'flex', gap: 12, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14, cursor: 'pointer' }}>
            <div style={{ fontSize: 28 }}>{p.thumbnail}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                <Badge color={T.indigo}>{p.category}</Badge>
                <span style={{ fontSize: 11, color: T.muted }}>{p.published_at} · {p.readTime}분</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 12.5, color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.summary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlogDetailView({ T, post, onBack, onOpenRecipe }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0 }}>← 매거진 목록</button>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
        <Badge color={T.indigo}>{post.category}</Badge>
        <span style={{ fontSize: 12, color: T.muted }}>{post.author} · {post.published_at} · {post.readTime}분</span>
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{post.thumbnail} {post.title}</h1>
      <div>{renderMarkdownLite(post.body)}</div>
      {post.related_recipe_id && (
        <button onClick={() => onOpenRecipe(post.related_recipe_id)} style={{ marginTop: 20, fontSize: 13, fontWeight: 600, color: T.bg, background: T.emerald, border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }}>
          🍳 관련 레시피 보기
        </button>
      )}
    </div>
  )
}
