'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

const T = {
  bg: '#FFFFFF', surface: '#FAFAF8', text: '#1A1A1A', muted: '#767676',
  accent: '#1A1A1A', border: '#EAEAEA',
}

const CATEGORIES = ['전체', '아우터', '팬츠', '니트', '액세서리']

const PRODUCTS = [
  { name: '오버사이즈 울 코트', price: '189,000원', tag: 'BEST', category: '아우터', rating: 4.8, reviews: 62, grad: 'linear-gradient(160deg, #E8E4DC, #B9B2A2)' },
  { name: '와이드 데님 팬츠', price: '69,000원', tag: 'NEW', category: '팬츠', rating: 4.6, reviews: 38, grad: 'linear-gradient(160deg, #DCE3EA, #92A6B8)' },
  { name: '캐시미어 니트', price: '129,000원', tag: 'BEST', category: '니트', rating: 4.9, reviews: 95, grad: 'linear-gradient(160deg, #EDE0DC, #C4A199)' },
  { name: '미니멀 레더백', price: '159,000원', tag: '', category: '액세서리', rating: 4.7, reviews: 51, grad: 'linear-gradient(160deg, #E5E0D8, #8C7B63)' },
  { name: '트위드 자켓', price: '215,000원', tag: 'NEW', category: '아우터', rating: 4.5, reviews: 20, grad: 'linear-gradient(160deg, #E3DCE0, #A8909D)' },
  { name: '스트레이트 슬랙스', price: '79,000원', tag: '', category: '팬츠', rating: 4.4, reviews: 27, grad: 'linear-gradient(160deg, #DEE2DC, #9AA69A)' },
]

function CartToast({ show }) {
  if (!show) return null
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
      background: T.text, color: '#fff', padding: '12px 24px', borderRadius: 999, fontSize: 13, fontWeight: 600,
    }}>
      장바구니에 담았어요! (데모 — 실제 결제는 되지 않아요)
    </div>
  )
}

export default function ShopLandingDemo() {
  const [toast, setToast] = useState(false)
  const [category, setCategory] = useState('전체')
  const [menuOpen, setMenuOpen] = useState(false)

  const visible = category === '전체' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)

  const addToCart = () => {
    setToast(true)
    setTimeout(() => setToast(false), 1800)
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      <style>{`
        .shop-nav-links { display: flex; gap: 24px; align-items: center; }
        .shop-nav-toggle { display: none; }
        .shop-card { transition: transform .18s ease, box-shadow .18s ease; }
        .shop-card:hover { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(0,0,0,0.08); }
        .shop-cat-tab { transition: background .15s, color .15s; cursor: pointer; }
        @media (max-width: 680px) {
          .shop-nav-links { display: none; }
          .shop-nav-links.open { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; position: absolute; top: 100%; left: 0; right: 0; background: #fff; padding: 20px 24px; border-bottom: 1px solid ${T.border}; }
          .shop-nav-toggle { display: block; }
        }
      `}</style>

      {/* Promo banner */}
      <div style={{ background: T.text, color: '#fff', textAlign: 'center', padding: '9px 16px', fontSize: 12.5, fontWeight: 600 }}>
        🎉 신규 가입 시 10% 할인 쿠폰 지급 · 5만원 이상 무료배송
      </div>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '0.08em' }}>MOODROAD</span>
          </div>
          <div className={`shop-nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#new" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>NEW</a>
            <a href="#best" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>BEST</a>
            <span style={{ fontSize: 13, color: T.muted }}>🛒 장바구니</span>
          </div>
          <button className="shop-nav-toggle" onClick={() => setMenuOpen((v) => !v)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '90px 24px 70px', textAlign: 'center',
        background: `linear-gradient(rgba(255,255,255,0.55), rgba(255,255,255,0.85)), url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80') center/cover`,
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 12, letterSpacing: '0.2em', color: T.muted, marginBottom: 16 }}>2026 F/W COLLECTION</div>
          <h1 style={{ margin: 0, fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            매일이 무드가 되는 옷
          </h1>
          <p style={{ marginTop: 18, fontSize: 15, color: T.muted, lineHeight: 1.7 }}>
            과하지 않게, 그러나 분명하게. 무드로드의 신상 컬렉션을 만나보세요.
          </p>
          <a href="#new" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: '#fff', background: T.accent, padding: '13px 32px',
          }}>
            신상품 보기
          </a>
        </div>
      </section>

      {/* Products */}
      <section id="new" style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px' }}>
        <h2 id="best" style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>이번 주 추천 상품</h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className="shop-cat-tab"
              onClick={() => setCategory(c)}
              style={{
                fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 999, border: 'none',
                background: category === c ? T.accent : T.surface,
                color: category === c ? '#fff' : T.text,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {visible.map((p) => (
            <div key={p.name} className="shop-card">
              <div style={{ aspectRatio: '3/4', borderRadius: 4, background: p.grad, border: `1px solid ${T.border}`, position: 'relative' }}>
                {p.tag && (
                  <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 700, background: T.text, color: '#fff', padding: '3px 8px' }}>
                    {p.tag}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>{p.name}</div>
              <div style={{ marginTop: 3, fontSize: 12, color: T.muted }}>
                ★ {p.rating} ({p.reviews})
              </div>
              <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700 }}>{p.price}</div>
              <button onClick={addToCart} style={{
                marginTop: 10, width: '100%', padding: '10px 0', fontSize: 12.5, fontWeight: 700,
                background: '#fff', border: `1px solid ${T.text}`, color: T.text, cursor: 'pointer',
              }}>
                장바구니 담기
              </button>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <p style={{ color: T.muted, fontSize: 14, marginTop: 24 }}>해당 카테고리의 상품이 아직 없어요.</p>
        )}
      </section>

      {/* Brand story */}
      <section style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '56px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>MOODROAD 이야기</h2>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8 }}>
            무드로드는 계절마다 소량으로 제작하는 편집숍이에요. 유행보다 오래 입을 수 있는 옷을 고민하고,
            좋은 소재와 마감에 더 신경 써요.
          </p>
        </div>
      </section>

      {/* Instagram strip */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.15em', color: T.muted }}>@moodroad_official</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 6 }}>
          {PRODUCTS.slice(0, 6).map((p) => (
            <div key={p.name} style={{ aspectRatio: '1', background: p.grad, borderRadius: 4 }} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '40px 24px' }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24,
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.05em', marginBottom: 8 }}>MOODROAD</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              사업자등록번호 234-56-78901 (예시)<br />
              통신판매업신고 제2026-서울마포-1234호<br />
              대표: 홍길동 · 고객센터 1588-0000
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>고객센터</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              평일 10:00 – 17:00<br />
              (점심 12:00 – 13:00, 주말·공휴일 휴무)
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>결제 수단</div>
            <div style={{ fontSize: 12, color: T.muted }}>신용카드 · 계좌이체 · 간편결제</div>
          </div>
        </div>
        <div style={{ maxWidth: 1080, margin: '32px auto 0', paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.muted, textAlign: 'center' }}>
          MOODROAD · 이 페이지는 포트폴리오용으로 제작된 예시 쇼핑몰 데모예요.
        </div>
      </footer>

      <CartToast show={toast} />
    </div>
  )
}
