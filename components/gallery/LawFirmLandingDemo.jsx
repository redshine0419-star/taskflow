'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const T = {
  bg: '#FFFFFF', dark: '#0B1E3D', surface: '#F5F7FA', text: '#1A2333', muted: '#5B6478',
  gold: '#C9A54A', border: '#E3E7EE',
}

const PRACTICE = [
  { name: '기업 자문', desc: '계약·M&A·규제 대응 전반' },
  { name: '민사 소송', desc: '손해배상·채권채무 분쟁' },
  { name: '형사 변호', desc: '수사 단계부터 전 심급 대응' },
  { name: '부동산·건설', desc: '분양·재건축·시행 분쟁' },
]

const STEPS = [
  { step: '01', title: '상담 신청', desc: '온라인으로 사건 개요를 남겨주세요.' },
  { step: '02', title: '초기 상담', desc: '담당 변호사가 사건을 검토하고 방향을 안내해요.' },
  { step: '03', title: '수임 · 진행', desc: '위임 계약 후 절차를 진행하고 진행상황을 공유해요.' },
]

function ConsultForm() {
  const [form, setForm] = useState({ name: '', phone: '', topic: PRACTICE[0].name })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.gold, fontWeight: 700 }}>
        상담 신청이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 14, background: '#fff' }}>
        {PRACTICE.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 6, border: 'none', background: T.dark, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        상담 신청하기
      </button>
    </form>
  )
}

export default function LawFirmLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(11,30,61,0.95)', backdropFilter: 'blur(6px)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: '#8592AA', textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: '#fff' }}>이현 법률사무소</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#practice" style={{ fontSize: 13, color: '#D7DEEA', textDecoration: 'none' }}>전문분야</a>
            <a href="#process" style={{ fontSize: 13, color: '#D7DEEA', textDecoration: 'none' }}>상담절차</a>
            <a href="#consult" style={{ fontSize: 13, fontWeight: 700, color: T.dark, background: T.gold, padding: '8px 16px', borderRadius: 6, textDecoration: 'none' }}>상담 신청</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: T.dark, padding: '90px 24px 70px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.gold, border: `1px solid ${T.gold}`, padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
            의뢰인의 편에서 끝까지
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4, color: '#fff' }}>
            정확한 판단, 신뢰할 수 있는 결과<br />이현 법률사무소
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: '#B9C2D6', lineHeight: 1.7 }}>
            기업 자문부터 민형사 소송까지, 15년 경력의 변호사가 사건 초기부터 직접 검토해요.
          </p>
          <a href="#consult" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: T.dark, background: T.gold, padding: '13px 28px', borderRadius: 6,
          }}>
            무료 상담 신청
          </a>
        </div>
      </section>

      {/* Practice areas */}
      <section id="practice" style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>전문분야</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {PRACTICE.map((p) => (
            <div key={p.name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.gold, marginBottom: 14 }} />
              <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: T.muted }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>상담 절차</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {STEPS.map((s) => (
              <div key={s.step} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.gold, marginBottom: 8 }}>{s.step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consult */}
      <section id="consult" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>상담 신청</h2>
        <ConsultForm />
      </section>

      <footer style={{ background: T.dark, textAlign: 'center', padding: '28px 24px', fontSize: 12, color: '#8592AA' }}>
        이현 법률사무소 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}
