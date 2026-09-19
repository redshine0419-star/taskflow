'use client'
import { useEffect, useState } from 'react'
import { GLink as Link } from '../nav.jsx'
import PageHeader from '../PageHeader.jsx'
import { api } from '../api.js'

const CATEGORIES = ['전체', '공지사항', '보도자료', '캠페인 소식']

export default function News() {
  const [category, setCategory] = useState('전체')
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.news
      .list(category)
      .then(setNews)
      .catch(() => setNews([]))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div>
      <PageHeader title="소식" breadcrumb="홈 > 소식" />
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
          ) : news.length === 0 ? (
            <div className="empty-state">등록된 소식이 없습니다.</div>
          ) : (
            <div className="grid grid-3">
              {news.map((n) => (
                <Link key={n.id} to={`/news/${n.id}`} className="card">
                  <img src={n.image_url} alt={n.title} />
                  <div className="card-body">
                    <span className="tag">{n.category}</span>
                    <h3>{n.title}</h3>
                    <span className="card-date">{new Date(n.published_at).toLocaleDateString('ko-KR')}</span>
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
