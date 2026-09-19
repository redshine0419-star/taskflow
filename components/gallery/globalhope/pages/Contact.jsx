'use client'
import { useState } from 'react'
import PageHeader from '../PageHeader.jsx'
import { api } from '../api.js'

const initialForm = { name: '', phone: '', email: '', subject: '', message: '' }

export default function Contact() {
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
      await api.inquiries.submit({ type: 'contact', ...form })
      setStatus({ type: 'success', message: '문의가 정상적으로 접수되었습니다.' })
      setForm(initialForm)
    } catch (err) {
      setStatus({ type: 'error', message: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageHeader title="문의하기" breadcrumb="홈 > 문의하기" />
      <section className="section">
        <div className="container">
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
                <input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="email">이메일</label>
              <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
            </div>
            <div className="form-row">
              <label htmlFor="subject">제목 *</label>
              <input id="subject" required value={form.subject} onChange={(e) => update('subject', e.target.value)} />
            </div>
            <div className="form-row">
              <label htmlFor="message">문의 내용 *</label>
              <textarea id="message" required rows={6} value={form.message} onChange={(e) => update('message', e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" disabled={submitting} type="submit">
              {submitting ? '전송 중...' : '문의 보내기'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
