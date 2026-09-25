'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'
import './edenWedding.css'

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80',
]

const PACKAGES = [
  { name: 'Basic', price: '350', items: ['스튜디오 촬영', '드레스 1벌', '앨범 제작'] },
  { name: 'Premium', price: '650', items: ['야외 + 스튜디오', '본식 스냅', '메이크업 리허설', '앨범 2권'], best: true },
  { name: 'Signature', price: '980', items: ['프리웨딩', '본식 영상', '전담 플래너', 'VIP 앨범'] },
]

const STATS = [
  { value: '500+', label: '함께한 커플' },
  { value: '4.9★', label: '평균 만족도' },
  { value: '10년', label: '웨딩 촬영 경력' },
]

const REVIEWS = [
  { name: '신부 이O은', rating: 5, text: '플래너님이 하나하나 세심하게 챙겨주셔서 준비 과정이 편했어요.' },
  { name: '신랑 정O우', rating: 5, text: '본식 스냅이 정말 자연스럽게 나와서 다들 놀랐어요.' },
]

function BookingForm() {
  const [form, setForm] = useState({ name: '', phone: '', date: '' })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div className="booking-success">
        상담 예약이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit}>
      <input required placeholder="성함" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      <button type="submit">무료 상담 신청</button>
    </form>
  )
}

export default function WeddingLandingDemo() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="eden-scope">
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&display=swap" />

      <nav>
        <div className="nav-left">
          <Link href="/portfolio" className="back-link">← 갤러리로</Link>
          <div className="logo">Eden</div>
        </div>
        <ul className={menuOpen ? 'open' : ''}>
          <li><a href="#gallery-section" onClick={() => setMenuOpen(false)}>Story</a></li>
          <li><a href="#gallery-section" onClick={() => setMenuOpen(false)}>Gallery</a></li>
          <li><a href="#package-section" onClick={() => setMenuOpen(false)}>Package</a></li>
          <li><a href="#booking-section" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
        <button className="nav-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="메뉴">
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      <section className="hero">
        <div>
          <h1>Your Forever<br />Begins Here</h1>
          <p>한 번뿐인 결혼식을 가장 우아한 순간으로. 스튜디오부터 본식까지 전담 플래너가 함께합니다.</p>
          <a className="btn" href="#package-section">패키지 보기</a>
        </div>
      </section>

      <div className="stats-row">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <section id="gallery-section">
        <div className="title">
          <span>OUR MOMENTS</span>
          <h2>Wedding Gallery</h2>
        </div>
        <div className="gallery">
          {GALLERY_IMAGES.map((src) => (
            <img key={src} src={src} alt="웨딩 갤러리" />
          ))}
        </div>
      </section>

      <section id="package-section">
        <div className="title">
          <span>PACKAGE</span>
          <h2>Choose Your Day</h2>
        </div>
        <div className="packages">
          {PACKAGES.map((p) => (
            <div key={p.name} className={`card${p.best ? ' best' : ''}`}>
              <h3>{p.name}</h3>
              <div className="price">{p.price}</div>
              <ul>
                {p.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="title">
          <span>REVIEWS</span>
          <h2>신랑신부 후기</h2>
        </div>
        <div className="review-grid">
          {REVIEWS.map((r) => (
            <div key={r.name} className="review-card">
              <div className="stars">{'★'.repeat(r.rating)}</div>
              <p>&ldquo;{r.text}&rdquo;</p>
              <div className="review-name">{r.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="booking-section">
        <div className="booking">
          <div className="left">
            <div className="title" style={{ textAlign: 'left', marginBottom: 28 }}>
              <span>RESERVATION</span>
              <h2>상담 예약</h2>
            </div>
            <BookingForm />
          </div>
          <div className="right" />
        </div>
      </section>

      <footer>
        © 2026 Eden Wedding · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}
