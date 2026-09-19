'use client'
import { useEffect, useState } from 'react'
import { api } from '../../api.js'

const STATUS_OPTIONS = [
  { value: 'new', label: '신규' },
  { value: 'in_progress', label: '처리중' },
  { value: 'done', label: '완료' },
]

export default function InquiryManager() {
  const [items, setItems] = useState([])
  const [filterType, setFilterType] = useState('전체')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  function load() {
    setLoading(true)
    api.inquiries.list().then(setItems).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function updateStatus(id, status) {
    const updated = await api.inquiries.updateStatus(id, status)
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
    if (selected?.id === id) setSelected(updated)
  }

  async function handleDelete(id) {
    if (!confirm('이 문의를 삭제하시겠습니까?')) return
    await api.inquiries.remove(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filtered = items.filter((i) => {
    if (filterType === '전체') return true
    if (filterType === '후원신청') return i.type === 'donation'
    return i.type === 'contact'
  })

  return (
    <div>
      <div className="admin-topbar">
        <h1>문의 / 후원신청 관리</h1>
      </div>

      <div className="tab-row" style={{ justifyContent: 'flex-start' }}>
        {['전체', '후원신청', '일반문의'].map((t) => (
          <button key={t} className={filterType === t ? 'active' : ''} onClick={() => setFilterType(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <p>불러오는 중...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>이름</th>
                <th>연락처</th>
                <th>제목/후원종류</th>
                <th>접수일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td>{i.type === 'donation' ? '후원신청' : '일반문의'}</td>
                  <td>{i.name}</td>
                  <td>{i.phone || i.email}</td>
                  <td>{i.type === 'donation' ? `${i.donation_type} ${i.amount ? `(${i.amount})` : ''}` : i.subject}</td>
                  <td>{new Date(i.created_at).toLocaleString('ko-KR')}</td>
                  <td>
                    <select value={i.status} onChange={(e) => updateStatus(i.id, e.target.value)}>
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => setSelected(i)}>상세</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i.id)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7}>내역이 없습니다.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="admin-card">
          <div className="admin-topbar">
            <h1 style={{ fontSize: 17 }}>상세 내용</h1>
            <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>닫기</button>
          </div>
          <p><strong>이름:</strong> {selected.name}</p>
          <p><strong>연락처:</strong> {selected.phone || '-'} / {selected.email || '-'}</p>
          {selected.type === 'donation' ? (
            <>
              <p><strong>후원 종류:</strong> {selected.donation_type}</p>
              <p><strong>희망 금액:</strong> {selected.amount || '-'}</p>
            </>
          ) : (
            <p><strong>제목:</strong> {selected.subject}</p>
          )}
          <p><strong>내용:</strong></p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{selected.message || '-'}</p>
        </div>
      )}
    </div>
  )
}
