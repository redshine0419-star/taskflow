'use client'
import { useState } from 'react'
import Link from 'next/link'

const KO_CATEGORIES = ['전체', '무료서식', '무료템플릿', '툴소개']
const EN_CATEGORIES = ['All', 'tools', 'templates', 'productivity']

export default function BlogFilter({ posts }) {
  const [activeLang, setActiveLang] = useState('en')
  const [activeCategory, setActiveCategory] = useState(activeLang === 'en' ? 'All' : '전체')

  const handleLangChange = (lang) => {
    setActiveLang(lang)
    setActiveCategory(lang === 'en' ? 'All' : '전체')
  }

  const categories = activeLang === 'en' ? EN_CATEGORIES : KO_CATEGORIES
  const allLabel = activeLang === 'en' ? 'All' : '전체'
  const langPosts = posts.filter(p => (p.lang || 'ko') === activeLang)
  const filtered = activeCategory === allLabel ? langPosts : langPosts.filter(p => p.category === activeCategory)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <style>{`
        .cat-tab { transition: background .15s, color .15s; cursor: pointer; }
        .cat-tab:hover { background: #27272a !important; }
        .post-card-blog { transition: border-color .15s, transform .15s; }
        .post-card-blog:hover { border-color: #34d399 !important; transform: translateY(-1px); }
      `}</style>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['en', 'ko'].map(lang => (
          <button
            key={lang}
            className="cat-tab"
            onClick={() => handleLangChange(lang)}
            style={{
              padding: '6px 14px', borderRadius: 8, border: 'none',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: activeLang === lang ? '#3b82f6' : '#18181b',
              color: activeLang === lang ? '#fff' : '#a1a1aa',
              letterSpacing: 0.5,
            }}
          >
            {lang === 'en' ? 'EN' : '한국어'}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            className="cat-tab"
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '7px 16px', borderRadius: 20, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeCategory === cat ? '#10b981' : '#18181b',
              color: activeCategory === cat ? '#fff' : '#a1a1aa',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Post grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
        gap: 16,
      }}>
        {filtered.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="post-card-blog"
            style={{
              display: 'block', textDecoration: 'none',
              background: '#18181b', border: '1px solid #27272a',
              borderRadius: 12, overflow: 'hidden',
            }}
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
              />
            )}
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                  background: (post.category === '툴소개' || post.category === 'tools') ? '#6366f122' : '#10b98122',
                  color: (post.category === '툴소개' || post.category === 'tools') ? '#818cf8' : '#34d399',
                  border: `1px solid ${(post.category === '툴소개' || post.category === 'tools') ? '#6366f144' : '#34d39944'}`,
                  padding: '2px 8px', borderRadius: 20,
                }}>
                  {post.category}
                </span>
                {post.readTime && <span style={{ fontSize: 11, color: '#52525b' }}>{activeLang === 'en' ? `${post.readTime} min` : `${post.readTime}분 읽기`}</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#f4f4f5', marginBottom: 8, lineHeight: 1.4 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6, marginBottom: 16 }}>
                {post.desc || post.excerpt}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#52525b' }}>{post.date || post.publishedAt}</span>
                <span style={{ fontSize: 13, color: '#34d399', fontWeight: 700 }}>
                  {activeLang === 'en' ? 'Read more →' : '바로가기 →'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#52525b', fontSize: 14, padding: '40px 0' }}>
          {activeLang === 'en' ? 'No posts found.' : '포스트가 없습니다.'}
        </div>
      )}
    </div>
  )
}
