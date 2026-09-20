'use client'
import { useState } from 'react'
import Link from 'next/link'
import { EDM } from '../../components/gallery/edmTheme'

const KO_CATEGORIES = ['전체', '툴비교', '구글활용', 'AI활용', '협업팁']
const EN_CATEGORIES = ['All', 'alternatives', 'google-workspace', 'ai-tools', 'productivity']

const CATEGORY_STYLES = {
  'alternatives':      { background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' },
  '툴비교':            { background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' },
  'google-workspace':  { background: EDM.green[50], color: EDM.green[700], border: `1px solid ${EDM.green[200]}` },
  '구글활용':          { background: EDM.green[50], color: EDM.green[700], border: `1px solid ${EDM.green[200]}` },
  'ai-tools':          { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' },
  'AI활용':            { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' },
  'productivity':      { background: '#EFF6FF', color: EDM.blue[600], border: '1px solid #BFDBFE' },
  '협업팁':            { background: '#EFF6FF', color: EDM.blue[600], border: '1px solid #BFDBFE' },
}
const DEFAULT_STYLE = { background: EDM.neutral[50], color: EDM.text3, border: `1px solid ${EDM.border}` }
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
    <div>
      <style>{`
        .cat-tab { transition: background .15s, color .15s; cursor: pointer; }
        .cat-tab:hover { background: ${EDM.neutral[100]} !important; }
        .post-card-blog { transition: border-color .15s, transform .15s; }
        .post-card-blog:hover { border-color: ${EDM.green[500]} !important; transform: translateY(-1px); }
      `}</style>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['en', 'ko'].map(lang => (
          <button
            key={lang}
            className="cat-tab"
            onClick={() => handleLangChange(lang)}
            style={{
              padding: '6px 14px', borderRadius: EDM.radius.control, border: 'none',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: activeLang === lang ? EDM.blue[500] : EDM.neutral[50],
              color: activeLang === lang ? '#fff' : EDM.text3,
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
              padding: '7px 16px', borderRadius: EDM.radius.full, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeCategory === cat ? EDM.green[500] : EDM.neutral[50],
              color: activeCategory === cat ? '#fff' : EDM.text3,
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
              background: EDM.bg, border: `1px solid ${EDM.borderLight}`,
              borderRadius: EDM.radius.card, overflow: 'hidden',
              boxShadow: EDM.shadowBlue01,
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
                  padding: '2px 8px', borderRadius: EDM.radius.full,
                }}>
                  {post.category}
                </span>
                {post.readTime && <span style={{ fontSize: 11, color: EDM.text4 }}>{activeLang === 'en' ? `${post.readTime} min` : `${post.readTime}분 읽기`}</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: EDM.text1, marginBottom: 8, lineHeight: 1.4 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 13, color: EDM.text3, lineHeight: 1.6, marginBottom: 16 }}>
                {post.desc || post.excerpt}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: EDM.text4 }}>{post.date || post.publishedAt}</span>
                <span style={{ fontSize: 13, color: EDM.green[600], fontWeight: 700 }}>
                  {activeLang === 'en' ? 'Read more →' : '바로가기 →'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: EDM.text4, fontSize: 14, padding: '40px 0' }}>
          {activeLang === 'en' ? 'No posts found.' : '포스트가 없습니다.'}
        </div>
      )}
    </div>
  )
}
