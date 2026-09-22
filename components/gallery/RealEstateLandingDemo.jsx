'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#F6F8F6', surface: '#FFFFFF', text: '#1C2B22', muted: '#5F6F66',
  green: '#1B4332', gold: '#B8934A', border: '#DCE5DE',
}

const LISTINGS = [
  { type: '매매', name: '한강뷰 아파트 34평', area: '전용 84㎡', price: '9억 5,000만원' },
  { type: '전세', name: '역세권 신축 오피스텔', area: '전용 24㎡', price: '2억 3,000만원' },
  { type: '월세', name: '근린상가 1층', area: '전용 45㎡', price: '보증금 3,000/월 200만원' },
]

const SERVICES = [
  { icon: '🏠', title: '매매 중개', desc: '시세 분석부터 계약까지 전 과정을 안내해요.' },
  { icon: '📄', title: '전세·월세', desc: '안전한 계약을 위한 등기부등본 확인을 도와드려요.' },
  { icon: '📐', title: '시세 상담', desc: '보유 부동산의 적정 시세를 무료로 분석해드려요.' },
]

function InquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', interest: LISTINGS[0].name })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.green, fontWeight: 700 }}>
        문의가 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, background: '#fff' }}>
        {LISTINGS.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 8, border: 'none', background: T.green, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        매물 문의하기
      </button>
    </form>
  )
}

export default function RealEstateLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(246,248,246,0.92)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.green }}>한강 공인중개사</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#listings" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>주요매물</a>
            <a href="#services" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>서비스</a>
            <a href="#inquiry" style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.green, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>매물 문의</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '90px 24px 60px', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.gold, border: `1px solid ${T.gold}`, padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
          20년 경력의 지역 전문가
        </span>
        <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
          우리 동네 부동산은<br />한강 공인중개사가 잘 압니다
        </h1>
        <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
          매매·전세·월세부터 상가 계약까지, 등기부등본 확인과 시세 분석을 꼼꼼히 챙겨드려요.
        </p>
        <a href="#listings" style={{
          display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          color: '#fff', background: T.green, padding: '13px 28px', borderRadius: 8,
        }}>
          매물 보러가기
        </a>
      </section>

      {/* Listings */}
      <section id="listings" style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>주요 매물</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {LISTINGS.map((l) => (
            <div key={l.name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.green, background: '#E7F0EA', padding: '3px 10px', borderRadius: 999 }}>{l.type}</span>
              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 12 }}>{l.name}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: T.muted }}>{l.area}</div>
              <div style={{ marginTop: 10, fontSize: 16, fontWeight: 800, color: T.gold }}>{l.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>서비스 안내</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {SERVICES.map((s) => (
              <div key={s.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section id="inquiry" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>매물 문의</h2>
        <InquiryForm />
      </section>

      <footer style={{ textAlign: 'center', padding: '32px 24px', fontSize: 12, color: T.muted }}>
        한강 공인중개사 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}
