'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

const T = {
  bg: '#F7FAFD', surface: '#FFFFFF', text: '#1F2937', muted: '#6B7280',
  accent: '#0F62D6', accentLight: '#E8F1FD', border: '#DCE6F2',
}

const DEPARTMENTS = [
  { icon: '🩺', name: '내과', desc: '만성질환·건강검진 상담' },
  { icon: '🦴', name: '정형외과', desc: '근골격계 통증 치료' },
  { icon: '👶', name: '소아청소년과', desc: '성장·예방접종 관리' },
  { icon: '🔬', name: '건강검진센터', desc: '종합 검진 프로그램' },
]

const DOCTORS = [
  { name: '김도윤 원장', role: '내과 전문의', desc: '서울대학교병원 내과 전임의 출신' },
  { name: '박서연 원장', role: '정형외과 전문의', desc: '척추·관절 클리닉 15년 경력' },
]

function ReserveForm() {
  const [form, setForm] = useState({ name: '', phone: '', dept: DEPARTMENTS[0].name })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.accent, fontWeight: 700 }}>
        예약 신청이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, background: '#fff' }}>
        {DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 8, border: 'none', background: T.accent, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        예약 신청하기
      </button>
    </form>
  )
}

export default function ClinicLandingDemo() {
  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,250,253,0.92)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: T.accent }}>정다운의원</span>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <a href="#departments" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>진료과목</a>
            <a href="#doctors" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>의료진</a>
            <a href="#hours" style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>진료시간</a>
            <a href="#reserve" style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.accent, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>예약하기</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '110px 24px 70px', textAlign: 'center',
        background: `linear-gradient(rgba(247,250,253,0.9), rgba(247,250,253,0.94)), url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80') center 30%/cover`,
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.accent, background: T.accentLight, padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
            가족 같은 마음으로 진료합니다
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
            믿을 수 있는 동네 주치의,<br />정다운의원
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
            내과·정형외과·소아청소년과 전문의가 상주하며, 예약制으로 대기 시간 없이 진료받으실 수 있어요.
          </p>
          <a href="#reserve" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: '#fff', background: T.accent, padding: '13px 28px', borderRadius: 8,
          }}>
            진료 예약하기
          </a>
        </div>
      </section>

      {/* Departments */}
      <section id="departments" style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>진료과목</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {DEPARTMENTS.map((d) => (
            <div key={d.name} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{d.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
              <div style={{ marginTop: 6, fontSize: 13, color: T.muted }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>의료진 소개</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {DOCTORS.map((d) => (
              <div key={d.name} style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: T.accentLight, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>👨‍⚕️</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: T.accent, fontWeight: 600 }}>{d.role}</div>
                <div style={{ marginTop: 6, fontSize: 13, color: T.muted }}>{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours */}
      <section id="hours" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>진료시간 · 오시는 길</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: T.accent, fontWeight: 700, marginBottom: 6 }}>평일</div>
            <div style={{ fontSize: 14 }}>09:00 – 18:30 (점심 13:00–14:00)</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: T.accent, fontWeight: 700, marginBottom: 6 }}>토요일</div>
            <div style={{ fontSize: 14 }}>09:00 – 13:00 (일요일·공휴일 휴진)</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: T.accent, fontWeight: 700, marginBottom: 6 }}>위치</div>
            <div style={{ fontSize: 14 }}>서울 강남구 헬스로 34 (예시 주소)</div>
          </div>
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" style={{ background: T.surface, borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>진료 예약 신청</h2>
          <ReserveForm />
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '32px 24px', fontSize: 12, color: T.muted }}>
        정다운의원 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
      </footer>
    </div>
  )
}
