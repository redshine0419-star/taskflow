'use client'
import { useEffect, useState } from 'react'
import { GLink as Link } from '../nav.jsx'
import { api } from '../api.js'
import BannerSlider from '../BannerSlider.jsx'

const QUICK_LINKS = [
  { icon: '💙', label: '정기후원 시작하기', to: '/donate' },
  { icon: '🧒', label: '아동결연 후원', to: '/programs' },
  { icon: '🙌', label: '자원봉사 신청', to: '/contact' },
  { icon: '📢', label: '캠페인 참여', to: '/news' },
]

const CATEGORY_CARDS = [
  { icon: '🎒', title: '아동결연', desc: '1:1 결연으로 한 아이의 성장을 지속적으로 지원합니다.' },
  { icon: '🏠', title: '국내사업', desc: '국내 취약계층 아동·청소년의 자립을 돕습니다.' },
  { icon: '🌍', title: '해외사업', desc: '식수·위생·교육 등 개발도상국 아동을 지원합니다.' },
  { icon: '🚑', title: '긴급구호', desc: '재난과 분쟁 지역에 신속한 구호를 제공합니다.' },
]

const STATS = [
  { value: '128,400+', label: '후원 아동 수' },
  { value: '312,000+', label: '정기 후원자 수' },
  { value: '38개국', label: '사업 진행 국가' },
  { value: '27년', label: '활동 역사' },
]

const TESTIMONIALS = [
  { name: '정기후원자 김O영', stars: 5, text: '매달 보내주시는 아동 성장 소식지를 보면서 후원이 실제로 닿고 있다는 걸 느껴요.' },
  { name: '정기후원자 박O수', stars: 5, text: '투명한 후원금 사용 보고서 덕분에 믿고 오래 후원하고 있습니다.' },
  { name: '자원봉사자 이O진', stars: 5, text: '현장 봉사에 참여하면서 직원분들의 진심을 느낄 수 있었어요.' },
]

function Stars({ n }) {
  return <span className="stars">{'★'.repeat(n) + '☆'.repeat(5 - n)}</span>
}

export default function Home() {
  const [banners, setBanners] = useState([])
  const [programs, setPrograms] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.banners.list(), api.programs.list(), api.news.list()])
      .then(([b, p, n]) => {
        setBanners(b)
        setPrograms(p.slice(0, 4))
        setNews(n.slice(0, 3))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <BannerSlider banners={banners} />

      <div className="quick-menu">
        {QUICK_LINKS.map((q) => (
          <Link key={q.label} to={q.to}>
            <span className="icon">{q.icon}</span>
            {q.label}
          </Link>
        ))}
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">WHAT WE DO</span>
            <h2>글로벌호프는 이런 일을 합니다</h2>
            <p>아동의 생존, 보호, 발달, 참여를 위해 다양한 분야에서 활동하고 있습니다.</p>
          </div>
          <div className="grid grid-4">
            {CATEGORY_CARDS.map((c) => (
              <div key={c.title} className="card category-card">
                <div className="icon-badge">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">ONGOING PROGRAMS</span>
            <h2>진행중인 사업 &amp; 캠페인</h2>
            <p>지금 이 순간에도 아이들의 더 나은 내일을 위한 사업이 진행되고 있습니다.</p>
          </div>
          {!loading && programs.length === 0 ? (
            <div className="empty-state">등록된 사업이 없습니다.</div>
          ) : (
            <div className="grid grid-4">
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
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/programs" className="btn btn-outline">사업 전체보기</Link>
          </div>
        </div>
      </section>

      <div className="stats-band">
        <div className="container stats-grid">
          {STATS.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">VOICE</span>
            <h2>후원자·자원봉사자의 목소리</h2>
            <p>글로벌호프와 함께하는 분들의 이야기를 들어보세요.</p>
          </div>
          <div className="grid grid-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <Stars n={t.stars} />
                <p>&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">NEWS</span>
            <h2>최신 소식</h2>
            <p>글로벌호프의 활동 소식과 공지사항을 확인하세요.</p>
          </div>
          {!loading && news.length === 0 ? (
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

      <div className="cta-band">
        <div className="container">
          <h2>지금, 한 아이의 인생을 바꿀 수 있습니다</h2>
          <p>당신의 후원 하나가 아이에게는 새로운 기회가 됩니다.</p>
          <Link to="/donate" className="btn btn-outline">후원 시작하기</Link>
        </div>
      </div>
    </div>
  )
}
