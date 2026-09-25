'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

const T = {
  bg: '#FBF6EF', surface: '#FFFFFF', text: '#3B2A1E', muted: '#8A7263',
  accent: '#8C5A3C', gold: '#C9A66B', border: '#E7DCC9',
}

const MENU = [
  { emoji: '☕', name: '핸드드립 오늘의 커피', price: '6,500원', rank: 1, grad: 'linear-gradient(135deg, #C9A66B, #8C5A3C)' },
  { emoji: '🥐', name: '버터 크루아상', price: '4,800원', rank: 2, grad: 'linear-gradient(135deg, #E8C79A, #C9963F)' },
  { emoji: '🍰', name: '바스크 치즈케이크', price: '7,000원', rank: 3, grad: 'linear-gradient(135deg, #D9B98C, #A9764A)' },
  { emoji: '🍵', name: '얼그레이 라떼', price: '6,000원', rank: null, grad: 'linear-gradient(135deg, #B7C9A8, #7C9468)' },
]

const STATS = [
  { value: '4.9★', label: '평균 리뷰 평점' },
  { value: '312+', label: '누적 리뷰 수' },
  { value: '2019', label: '오픈 연도' },
]

const REVIEWS = [
  { name: '김O진', rating: 5, text: '창가 자리가 정말 좋아요. 커피도 향이 진해서 자주 찾게 돼요.' },
  { name: '이O수', rating: 5, text: '치즈케이크가 인생 디저트였어요. 다음에는 크루아상도 먹어볼게요.' },
  { name: '박O영', rating: 4, text: '조용하게 작업하기 좋은 분위기예요. 콘센트 자리도 넉넉해요.' },
]

const GALLERY = ['☕', '🥐', '📚', '🌿', '🍰', '🪟']

function Stars({ n }) {
  return (
    <span style={{ color: T.gold, fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.accent, fontWeight: 700 }}>
        문의해주셔서 감사합니다! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <textarea placeholder="예약/문의 내용" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
      <button type="submit" style={{ padding: '13px 0', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        문의 보내기
      </button>
    </form>
  )
}

export default function CafeLandingDemo() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      <style>{`
        .cafe-nav-links { display: flex; gap: 24px; align-items: center; }
        .cafe-nav-toggle { display: none; }
        .cafe-card { transition: transform .18s ease, box-shadow .18s ease; }
        .cafe-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(59,42,30,0.1); }
        .cafe-gallery-item { transition: transform .25s ease; }
        .cafe-gallery-item:hover { transform: scale(1.06); }
        @media (max-width: 680px) {
          .cafe-nav-links { display: none; }
          .cafe-nav-links.open { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; position: absolute; top: 100%; left: 0; right: 0; background: ${T.bg}; padding: 20px 24px; border-bottom: 1px solid ${T.border}; }
          .cafe-nav-toggle { display: block; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(251,246,239,0.95)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>카페 소슬</span>
          </div>
          <div className={`cafe-nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#menu" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>메뉴</a>
            <a href="#about" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>소개</a>
            <a href="#reviews" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>후기</a>
            <a href="#visit" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>오시는 길</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.accent, padding: '8px 16px', borderRadius: 999, textDecoration: 'none' }}>예약 문의</a>
          </div>
          <button
            className="cafe-nav-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: T.text }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '120px 24px 60px', textAlign: 'center',
        background: `linear-gradient(rgba(59,42,30,0.45), rgba(59,42,30,0.55)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80') center/cover`,
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.35, color: '#fff' }}>
            하루의 쉼표,<br />카페 소슬입니다
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: '#F3E9DC', lineHeight: 1.7 }}>
            직접 로스팅한 원두와 매일 아침 굽는 페이스트리로 조용한 오후를 채워드려요.
          </p>
          <a href="#visit" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: '#fff', background: T.accent, padding: '13px 28px', borderRadius: 999,
          }}>
            오시는 길 보기
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: `1px solid ${T.border}` }}>
        <div style={{
          maxWidth: 720, margin: '0 auto', padding: '28px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center',
        }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.accent }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>오늘의 메뉴</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {MENU.map((m) => (
            <div key={m.name} className="cafe-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden', textAlign: 'center' }}>
              <div style={{ background: m.grad, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, position: 'relative' }}>
                {m.emoji}
                {m.rank && (
                  <span style={{
                    position: 'absolute', top: 8, left: 8, fontSize: 11, fontWeight: 800, color: T.accent,
                    background: '#fff', borderRadius: 999, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {m.rank}
                  </span>
                )}
              </div>
              <div style={{ padding: '16px 14px' }}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{m.name}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: T.gold, fontWeight: 700 }}>{m.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>소슬 이야기</h2>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8 }}>
            2019년, 작은 골목 안에서 시작한 카페 소슬은 &ldquo;천천히 마시는 커피 한 잔&rdquo;을 지향해요.
            원두는 2주에 한 번 직접 로스팅하고, 디저트는 매일 새벽 직접 구워요.
            창가 자리에 앉아 책 한 권과 함께 조용한 시간을 보내보세요.
          </p>
        </div>
      </section>

      {/* Instagram-style gallery */}
      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: T.gold, fontWeight: 700 }}>@cafe_soseul</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>일상 속 소슬</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 6 }}>
          {GALLERY.map((e, i) => (
            <div key={i} className="cafe-gallery-item" style={{
              aspectRatio: '1', borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, cursor: 'pointer',
            }}>
              {e}
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>고객 후기</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {REVIEWS.map((r) => (
              <div key={r.name} className="cafe-card" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', background: T.gold, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                  }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
                    <Stars n={r.rating} />
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: T.muted, lineHeight: 1.7 }}>&ldquo;{r.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>오시는 길</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: T.gold, fontWeight: 700, marginBottom: 6 }}>주소</div>
            <div style={{ fontSize: 14 }}>서울 마포구 어울림길 12 (예시 주소)</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: T.gold, fontWeight: 700, marginBottom: 6 }}>영업시간</div>
            <div style={{ fontSize: 14 }}>매일 10:00 – 21:00 (라스트오더 20:30)</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: T.gold, fontWeight: 700, marginBottom: 6 }}>휴무</div>
            <div style={{ fontSize: 14 }}>매주 월요일</div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>단체석 · 대관 문의</h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '40px 24px' }}>
        <div style={{
          maxWidth: 1040, margin: '0 auto', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24,
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>카페 소슬</div>
            <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.8 }}>
              사업자등록번호 123-45-67890 (예시)<br />
              서울 마포구 어울림길 12<br />
              02-1234-5678
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>영업시간</div>
            <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.8 }}>
              매일 10:00 – 21:00<br />
              라스트오더 20:30<br />
              매주 월요일 휴무
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>SNS</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 20 }}>
              <span>📷</span><span>📘</span><span>🎵</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1040, margin: '32px auto 0', paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.muted, textAlign: 'center' }}>
          카페 소슬 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
        </div>
      </footer>
    </div>
  )
}
