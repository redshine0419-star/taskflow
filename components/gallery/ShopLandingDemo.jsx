'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#FFFFFF', surface: '#FAFAF8', text: '#1A1A1A', muted: '#767676',
  accent: '#1A1A1A', border: '#EAEAEA',
}

const PRODUCTS = [
  { name: '오버사이즈 울 코트', price: '189,000원', tag: 'BEST' },
  { name: '와이드 데님 팬츠', price: '69,000원', tag: 'NEW' },
  { name: '캐시미어 니트', price: '129,000원', tag: 'BEST' },
  { name: '미니멀 레더백', price: '159,000원', tag: '' },
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
  const addToCart = () => {
    setToast(true)
    setTimeout(() => setToast(false), 1800)
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '0.08em' }}>MOODROAD</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#new" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>NEW</a>
            <a href="#best" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>BEST</a>
            <span style={{ fontSize: 13, color: T.muted }}>🛒 장바구니</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '110px 24px 90px', textAlign: 'center',
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
        <h2 id="best" style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>이번 주 추천 상품</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {PRODUCTS.map((p) => (
            <div key={p.name}>
              <div style={{
                aspectRatio: '3/4', background: T.surface, border: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: T.muted, position: 'relative',
              }}>
                상품 이미지
                {p.tag && (
                  <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, fontWeight: 700, background: T.text, color: '#fff', padding: '3px 8px' }}>
                    {p.tag}
                  </span>
                )}
              </div>
              <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>{p.name}</div>
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

      <footer style={{ textAlign: 'center', padding: '32px 24px', fontSize: 12, color: T.muted }}>
        MOODROAD · 이 페이지는 포트폴리오용으로 제작된 예시 쇼핑몰 데모예요.
      </footer>

      <CartToast show={toast} />
    </div>
  )
}
