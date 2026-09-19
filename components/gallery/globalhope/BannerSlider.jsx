'use client'
import { useEffect, useState } from 'react'
import { GLink as Link } from './nav.jsx'

export default function BannerSlider({ banners }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (banners.length < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [banners.length])

  if (!banners.length) {
    return (
      <div className="hero">
        <div className="hero-content">
          <div className="container">
            <h1>아이들의 희망을 잇습니다</h1>
            <p>글로벌호프와 함께 더 나은 세상을 만들어주세요.</p>
            <div className="hero-cta">
              <Link to="/donate" className="btn btn-primary">후원하기</Link>
              <Link to="/programs" className="btn btn-ghost">사업 둘러보기</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hero">
      {banners.map((banner, i) => (
        <div key={banner.id} className={`hero-slide ${i === index ? 'active' : ''}`}>
          <img src={banner.image_url} alt={banner.title} />
          <div className="hero-content">
            <div className="container">
              <h1>{banner.title}</h1>
              {banner.subtitle && <p>{banner.subtitle}</p>}
              <div className="hero-cta">
                <Link to={banner.link_url || '/donate'} className="btn btn-primary">
                  자세히 보기
                </Link>
                <Link to="/donate" className="btn btn-ghost">후원하기</Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      {banners.length > 1 && (
        <div className="hero-dots">
          {banners.map((b, i) => (
            <button
              key={b.id}
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`배너 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
