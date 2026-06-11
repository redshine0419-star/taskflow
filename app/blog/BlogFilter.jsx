'use client'
import { useState } from 'react'
import Link from 'next/link'

const KO_CATEGORIES = ['전체', '툴비교', '구글활용', 'AI활용', '협업팁']
const EN_CATEGORIES = ['All', 'alternatives', 'google-workspace', 'ai-tools', 'productivity']

const CATEGORY_STYLES = {
  'alternatives':      { background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' },
  '툴비교':            { background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' },
  'google-workspace':  { background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' },
  '구글활용':          { background: '#f0fdf4', color: '#059669', border: '1px solid #bbf7d0' },
  'ai-tools':          { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  'AI활용':            { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
  'productivity':      { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' },
  '협업팁':            { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' },
}
const DEFAULT_STYLE = { background: '#f6f8fa', color: '#57606a', border: '1px solid #eaeef2' }
function getCategoryStyle(cat) { return CATEGORY_STYLES[cat] || DEFAULT_STYLE }

export default function BlogFilter({ posts }) {
  const [activeLang, setActiveLang] = useState('en')
  const [activeCategory, setActiveCategory] = useState(activeLang === 'en' ? 'All' : '전체')

  const handleLangChange = (lang) => {
    setActiveLang(lang)
    setActiveCategory(lang === 'en' ? 'All' : '전체')
  }

  const categories = activeLang === 'en' ? EN_CATEGORIES : KO_CATEGORIES
  const allLabel = activeLang === 'en' ? 'All' : '전체'
  const langPosts = posts
    .filter(p => (p.lang || 'ko') === activeLang)
    .sort((a, b) => new Date(b.publishedAt || b.date || 0) - new Date(a.publishedAt || a.date || 0))
  const filtered = activeCategory === allLabel ? langPosts : langPosts.filter(p => p.category === activeCategory)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <style>{`
        .cat-tab { transition: background .15s, color .15s; cursor: pointer; }
        .cat-tab:hover { background: #f6f8fa !important; }
        .post-card-blog { transition: border-color .15s, box-shadow .15s; }
        .post-card-blog:hover { border-color: #4f46e5 !important; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
      `}</style>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['en', 'ko'].map(lang => (
          <button
            key={lang}
            className="cat-tab"
            onClick={() => handleLangChange(lang)}
            style={{
              padding: '6px 14px', borderRadius: 8, border: '1px solid #eaeef2',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: activeLang === lang ? '#4f46e5' : '#ffffff',
              color: activeLang === lang ? '#fff' : '#57606a',
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
              padding: '7px 16px', borderRadius: 20, border: '1px solid #eaeef2',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeCategory === cat ? '#059669' : '#ffffff',
              color: activeCategory === cat ? '#fff' : '#57606a',
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
              background: '#ffffff', border: '1px solid #eaeef2',
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
                  ...getCategoryStyle(post.category),
                  padding: '2px 8px', borderRadius: 20,
                }}>
                  {post.category}
                </span>
                {post.readTime && <span style={{ fontSize: 11, color: '#57606a' }}>{activeLang === 'en' ? `${post.readTime} min` : `${post.readTime}분 읽기`}</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#24292f', marginBottom: 8, lineHeight: 1.4 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 13, color: '#57606a', lineHeight: 1.6, marginBottom: 16 }}>
                {post.desc || post.excerpt}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#8c959f' }}>{post.date || post.publishedAt}</span>
                <span style={{ fontSize: 13, color: '#059669', fontWeight: 700 }}>
                  {activeLang === 'en' ? 'Read more →' : '바로가기 →'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#8c959f', fontSize: 14, padding: '40px 0' }}>
          {activeLang === 'en' ? 'No posts found.' : '포스트가 없습니다.'}
        </div>
      )}
    </div>
  )
}
