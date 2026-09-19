'use client'
import { useEffect, useState } from 'react'
import { GLink as Link } from '../nav.jsx'
import PageHeader from '../PageHeader.jsx'
import { api } from '../api.js'

const CATEGORIES = ['전체', '아동결연', '국내사업', '해외사업', '긴급구호', '캠페인']

export default function Programs() {
  const [category, setCategory] = useState('전체')
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.programs
      .list(category)
      .then(setPrograms)
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div>
      <PageHeader title="사업소개" breadcrumb="홈 > 사업소개" />
      <section className="section">
        <div className="container">
          <div className="tab-row">
            {CATEGORIES.map((c) => (
              <button key={c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state">불러오는 중...</div>
          ) : programs.length === 0 ? (
            <div className="empty-state">해당 카테고리의 사업이 없습니다.</div>
          ) : (
            <div className="grid grid-3">
              {programs.map((p) => (
                <Link key={p.id} to={`/programs/${p.id}`} className="card">
                  <img src={p.image_url} alt={p.title} />
                  <div className="card-body">
                    <span className="tag">{p.category}</span>
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
