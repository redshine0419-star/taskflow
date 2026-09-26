'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'
import DeviceToggle from './DeviceToggle'

const T = {
  bg: '#FFFFFF', surface: '#F3F6FC', text: '#1D2433', muted: '#5C6478',
  blue: '#2C5CE8', orange: '#FF7A45', border: '#E1E7F5',
}

const COURSES = [
  { name: '왕초보 회화반', desc: '기초 문법과 실생활 표현 중심', level: 'BEGINNER' },
  { name: '비즈니스 영어반', desc: '이메일·미팅·프레젠테이션 표현', level: 'INTERMEDIATE' },
  { name: '토익 스피킹 집중반', desc: '단기간 목표 점수 달성 커리큘럼', level: 'ADVANCED' },
]

const STATS = [
  { value: '92%', label: '목표 달성률' },
  { value: '1,400+', label: '누적 수강생' },
  { value: '12년', label: '어학원 운영 경력' },
]

const REVIEWS = [
  { name: '수강생 김O진', text: '3개월 만에 회화가 늘어서 놀랐어요. 진도가 딱 맞았어요.' },
  { name: '수강생 박O현', text: '비즈니스 표현을 실전처럼 연습할 수 있어서 좋았어요.' },
]

function ConsultForm() {
  const [form, setForm] = useState({ name: '', phone: '', course: COURSES[0].name })
  const [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setSent(true)
  }
  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: T.blue, fontWeight: 700 }}>
        상담 신청이 접수되었어요! (데모 — 실제로 전송되지는 않아요)
      </div>
    )
  }
  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto' }}>
      <input required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <input required placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14 }} />
      <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
        style={{ padding: '12px 14px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, background: '#fff' }}>
        {COURSES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
      </select>
      <button type="submit" style={{ padding: '13px 0', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        무료 상담 신청
      </button>
    </form>
  )
}

export default function AcademyLandingDemo() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Pretendard', -apple-system, sans-serif", color: T.text }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <DeviceToggle />

      <style>{`
        .aca-nav-links { display: flex; gap: 24px; align-items: center; }
        .aca-nav-toggle { display: none; }
        .aca-card { transition: transform .18s ease, box-shadow .18s ease; }
        .aca-card:hover { transform: translateY(-4px); box-shadow: 0 14px 26px rgba(44,92,232,0.12); }
        @media (max-width: 680px) {
          .aca-nav-links { display: none; }
          .aca-nav-links.open { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; position: absolute; top: 100%; left: 0; right: 0; background: ${T.bg}; padding: 20px 24px; border-bottom: 1px solid ${T.border}; }
          .aca-nav-toggle { display: block; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link href="/portfolio" style={{ fontSize: 12, color: T.muted, textDecoration: 'none' }}>← 갤러리로</Link>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: T.blue }}>브릿지 어학원</span>
          </div>
          <div className={`aca-nav-links${menuOpen ? ' open' : ''}`}>
            <a href="#courses" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>커리큘럼</a>
            <a href="#reviews" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, color: T.text, textDecoration: 'none' }}>수강 후기</a>
            <a href="#consult" onClick={() => setMenuOpen(false)} style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: T.orange, padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}>무료 상담</a>
          </div>
          <button className="aca-nav-toggle" onClick={() => setMenuOpen((v) => !v)} style={{ border: 'none', background: 'none', fontSize: 20, cursor: 'pointer', color: T.text }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '110px 24px 60px', textAlign: 'center',
        background: `linear-gradient(rgba(243,246,252,0.88), rgba(243,246,252,0.94)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80') center/cover`,
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, color: T.blue, background: '#E4EBFC', padding: '6px 14px', borderRadius: 999, marginBottom: 20 }}>
            수강생 92%가 목표를 달성했어요
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.4 }}>
            말이 트이는 영어,<br />브릿지 어학원
          </h1>
          <p style={{ marginTop: 18, fontSize: 16, color: T.muted, lineHeight: 1.7 }}>
            레벨 테스트로 딱 맞는 반을 찾아드리고, 소수정예 수업으로 집중도를 높여요.
          </p>
          <a href="#consult" style={{
            display: 'inline-block', marginTop: 28, fontSize: 14, fontWeight: 700, textDecoration: 'none',
            color: '#fff', background: T.blue, padding: '13px 28px', borderRadius: 8,
          }}>
            무료 레벨 테스트 신청
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.blue }}>{s.value}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 32 }}>커리큘럼</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {COURSES.map((c) => (
            <div key={c.name} className="aca-card" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.orange }}>{c.level}</span>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8 }}>{c.name}</div>
              <div style={{ marginTop: 8, fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" style={{ background: T.surface, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '56px 24px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 28 }}>수강 후기</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {REVIEWS.map((r) => (
              <div key={r.name} className="aca-card" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.7 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ marginTop: 12, fontSize: 12, color: T.muted, fontWeight: 600 }}>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consult */}
      <section id="consult" style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, marginBottom: 24 }}>무료 레벨 테스트 · 상담 신청</h2>
        <ConsultForm />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '40px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: T.blue, marginBottom: 8 }}>브릿지 어학원</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              사업자등록번호 789-01-23456 (예시)<br />
              서울 종로구 학원로 9<br />
              02-6789-0123
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>상담 시간</div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.8 }}>
              평일 10:00 – 21:00<br />
              토요일 10:00 – 15:00
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>SNS</div>
            <div style={{ display: 'flex', gap: 10, fontSize: 20 }}>
              <span>📘</span><span>📷</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1040, margin: '32px auto 0', paddingTop: 20, borderTop: `1px solid ${T.border}`, fontSize: 12, color: T.muted, textAlign: 'center' }}>
          브릿지 어학원 · 이 페이지는 포트폴리오용으로 제작된 예시 홈페이지 데모예요.
        </div>
      </footer>
    </div>
  )
}
