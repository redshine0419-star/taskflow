'use client'
import { useEffect, useState } from 'react'
import { GLink as Link } from '../../nav.jsx'
import { api } from '../../api.js'

export default function Dashboard() {
  const [counts, setCounts] = useState({ banners: 0, programs: 0, news: 0, inquiries: 0 })
  const [recent, setRecent] = useState([])

  useEffect(() => {
    Promise.all([api.banners.listAdmin(), api.programs.listAdmin(), api.news.listAdmin(), api.inquiries.list()]).then(
      ([banners, programs, news, inquiries]) => {
        setCounts({ banners: banners.length, programs: programs.length, news: news.length, inquiries: inquiries.length })
        setRecent(inquiries.slice(0, 6))
      }
    )
  }, [])

  return (
    <div>
      <div className="admin-topbar">
        <h1>대시보드</h1>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <strong>{counts.banners}</strong>
          <span>등록된 배너</span>
        </div>
        <div className="stat-card">
          <strong>{counts.programs}</strong>
          <span>등록된 사업</span>
        </div>
        <div className="stat-card">
          <strong>{counts.news}</strong>
          <span>등록된 소식</span>
        </div>
        <div className="stat-card">
          <strong>{counts.inquiries}</strong>
          <span>총 문의/후원신청</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-topbar">
          <h1 style={{ fontSize: 17 }}>최근 문의 / 후원신청</h1>
          <Link to="/admin/inquiries" className="btn btn-outline btn-sm">전체보기</Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>구분</th>
              <th>이름</th>
              <th>연락처</th>
              <th>접수일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 && (
              <tr>
                <td colSpan={5}>문의 내역이 없습니다.</td>
              </tr>
            )}
            {recent.map((r) => (
              <tr key={r.id}>
                <td>{r.type === 'donation' ? '후원신청' : '문의'}</td>
                <td>{r.name}</td>
                <td>{r.phone || r.email}</td>
                <td>{new Date(r.created_at).toLocaleString('ko-KR')}</td>
                <td>
                  <span className={`status-pill status-${r.status}`}>{statusLabel(r.status)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function statusLabel(status) {
  if (status === 'in_progress') return '처리중'
  if (status === 'done') return '완료'
  return '신규'
}
