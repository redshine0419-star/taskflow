'use client'
import { useState } from 'react'
import PageHeader from '../PageHeader.jsx'
import { api } from '../api.js'

const METHODS = [
  { icon: '💳', title: '정기후원', desc: '매월 약정한 금액을 자동으로 후원하며, 지속적인 변화를 만듭니다.' },
  { icon: '🎁', title: '일시후원', desc: '원하는 시점에 원하는 금액만큼 자유롭게 후원할 수 있습니다.' },
  { icon: '🧾', title: '유산기부', desc: '뜻깊은 나눔을 다음 세대에도 이어갈 수 있는 후원 방법입니다.' },
]

const initialForm = {
  name: '',
  phone: '',
  email: '',
  donation_type: '정기후원',
  amount: '',
  message: '',
}

export default function Donate() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    try {
      await api.inquiries.submit({ type: 'donation', ...form })
      setStatus({ type: 'success', message: '후원 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.' })
      setForm(initialForm)
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="후원안내" breadcrumb="홈 > 후원안내" />
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">HOW TO DONATE</span>
            <h2>후원 방법을 선택해 주세요</h2>
          </div>
          <div className="donate-methods">
            {METHODS.map((m) => (
              <div key={m.title} className="card category-card">
                <div className="icon-badge">{m.icon}</div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="section-head">
            <span className="eyebrow">APPLY</span>
            <h2>후원 신청하기</h2>
            <p>아래 정보를 남겨주시면 담당자가 확인 후 연락드립니다.</p>
          </div>

          <form className="form-card" onSubmit={handleSubmit}>
            {status && (
              <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {status.message}
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-row">
                <label htmlFor="name">이름 *</label>
                <input id="name" required value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div className="form-row">
                <label htmlFor="phone">연락처</label>
                <input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-0000-0000" />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="email">이메일</label>
              <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>

            <div className="form-row">
              <label>후원 종류</label>
              <div className="radio-group">
                {['정기후원', '일시후원', '유산기부'].map((t) => (
                  <label key={t}>
                    <input
                      type="radio"
                      name="donation_type"
                      checked={form.donation_type === t}
                      onChange={() => update('donation_type', t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="amount">희망 후원 금액(월/1회)</label>
              <input id="amount" value={form.amount} onChange={(e) => update('amount', e.target.value)} placeholder="예: 30,000원" />
            </div>

            <div className="form-row">
              <label htmlFor="message">전달하실 말씀</label>
              <textarea id="message" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} />
            </div>

            <button className="btn btn-primary btn-block" disabled={submitting} type="submit">
              {submitting ? '접수 중...' : '후원 신청하기'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
