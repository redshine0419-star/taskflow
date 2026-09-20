'use client'
import { useState } from 'react'
import Link from 'next/link'
import { EDM } from '../../components/gallery/edmTheme'

const CATEGORIES = ['전체', '사이트진단', '콘텐츠·키워드', '채널분석', '블로그·SEO']

const CATEGORY_STYLES = {
  '사이트진단':    { background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE' },
  '콘텐츠·키워드': { background: EDM.green[50], color: EDM.green[700], border: `1px solid ${EDM.green[200]}` },
  '채널분석':      { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' },
  '블로그·SEO':    { background: '#EFF6FF', color: EDM.blue[600], border: '1px solid #BFDBFE' },
}
const DEFAULT_STYLE = { background: EDM.neutral[50], color: EDM.text3, border: `1px solid ${EDM.border}` }
function getCategoryStyle(cat) { return CATEGORY_STYLES[cat] || DEFAULT_STYLE }

export default function MarketerOpsBlogFilter({ posts }) {
  const [activeCategory, setActiveCategory] = useState('전체')

  const sorted = [...posts].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  const filtered = activeCategory === '전체' ? sorted : sorted.filter(p => p.category === activeCategory)

  return (
    <div>
      <style>{`
        .mo-cat-tab { transition: background .15s, color .15s; cursor: pointer; }
        .mo-cat-tab:hover { background: ${EDM.neutral[100]} !important; }
        .mo-post-card { transition: border-color .15s, transform .15s; }
        .mo-post-card:hover { border-color: ${EDM.blue[500]} !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className="mo-cat-tab"
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '7px 16px', borderRadius: EDM.radius.full, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeCategory === cat ? EDM.blue[500] : EDM.neutral[50],
              color: activeCategory === cat ? '#fff' : EDM.text3,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
        gap: 16,
      }}>
        {filtered.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="mo-post-card"
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
                {post.readTime && <span style={{ fontSize: 11, color: EDM.text4 }}>{`${post.readTime}분 읽기`}</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: EDM.text1, marginBottom: 8, lineHeight: 1.4 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 13, color: EDM.text3, lineHeight: 1.6, marginBottom: 16 }}>
                {post.desc}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: EDM.text4 }}>{post.date}</span>
                <span style={{ fontSize: 13, color: EDM.blue[600], fontWeight: 700 }}>바로가기 →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: EDM.text4, fontSize: 14, padding: '40px 0' }}>
          포스트가 없습니다.
        </div>
      )}
    </div>
  )
}
