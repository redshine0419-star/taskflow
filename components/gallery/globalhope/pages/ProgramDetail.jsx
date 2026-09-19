'use client'
import { useEffect, useState } from 'react'
import { GLink as Link } from '../nav.jsx'
import { api } from '../api.js'

export default function ProgramDetail({ id }) {
  const [program, setProgram] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setProgram(null)
    setError('')
    api.programs.get(id).then(setProgram).catch((e) => setError(e.message))
  }, [id])

  if (error) {
    return (
      <div className="container section">
        <div className="empty-state">{error}</div>
        <div style={{ textAlign: 'center' }}>
          <Link to="/programs" className="btn btn-outline">목록으로</Link>
        </div>
      </div>
    )
  }

  if (!program) return <div className="container section">불러오는 중...</div>

  return (
    <div className="container section">
      <Link to="/programs" className="back-link">← 사업소개 목록</Link>
      <div className="detail-hero">
        <img src={program.image_url} alt={program.title} />
      </div>
      <div className="detail-meta">
        <span className="tag">{program.category}</span>
      </div>
      <h1>{program.title}</h1>
      <p className="detail-body">{program.content || program.summary}</p>
      <div style={{ marginTop: 32 }}>
        <Link to="/donate" className="btn btn-primary">이 사업 후원하기</Link>
      </div>
    </div>
  )
}
