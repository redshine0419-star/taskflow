'use client'
import { useEffect, useState } from 'react'
import { GLink as Link } from '../nav.jsx'
import { api } from '../api.js'

export default function NewsDetail({ id }) {
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setItem(null)
    setError('')
    api.news.get(id).then(setItem).catch((e) => setError(e.message))
  }, [id])

  if (error) {
    return (
      <div className="container section">
        <div className="empty-state">{error}</div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/news" className="btn btn-outline">목록으로</Link>
        </div>
      </div>
    )
  }

  if (!item) return <div className="container section">불러오는 중...</div>

  return (
    <div className="container section">
      <Link to="/news" className="back-link">← 소식 목록</Link>
      <div className="detail-hero">
        <img src={item.image_url} alt={item.title} />
      </div>
      <div className="detail-meta">
        <span className="tag">{item.category}</span>
        <span className="card-date">{new Date(item.published_at).toLocaleDateString('ko-KR')}</span>
      </div>
      <h1>{item.title}</h1>
      <p className="detail-body">{item.content}</p>
    </div>
  )
}
