'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['전체', '사이트진단', '콘텐츠·키워드', '채널분석', '블로그·SEO']

const CATEGORY_STYLES = {
  '사이트진단':    { background: '#6366f122', color: '#818cf8', border: '1px solid #6366f144' },
  '콘텐츠·키워드': { background: '#10b98122', color: '#34d399', border: '1px solid #34d39944' },
  '채널분석':      { background: '#f59e0b22', color: '#fbbf24', border: '1px solid #f59e0b44' },
  '블로그·SEO':    { background: '#3b82f622', color: '#60a5fa', border: '1px solid #3b82f644' },
}
const DEFAULT_STYLE = { background: '#27272a', color: '#a1a1aa', border: '1px solid #3f3f46' }
function getCategoryStyle(cat) { return CATEGORY_STYLES[cat] || DEFAULT_STYLE }

export default function MarketerOpsBlogFilter({ posts }) {
  const [activeCategory, setActiveCategory] = useState('전체')

  const sorted = [...posts].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  const filtered = activeCategory === '전체' ? sorted : sorted.filter(p => p.category === activeCategory)

  return (
    <div>
      <style>{`
        .mo-cat-tab { transition: background .15s, color .15s; cursor: pointer; }
        .mo-cat-tab:hover { background: #27272a !important; }
        .mo-post-card { transition: border-color .15s, transform .15s; }
        .mo-post-card:hover { border-color: #818cf8 !important; transform: translateY(-1px); }
      `}</style>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className="mo-cat-tab"
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '7px 16px', borderRadius: 20, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeCategory === cat ? '#6366f1' : '#18181b',
              color: activeCategory === cat ? '#fff' : '#a1a1aa',
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
                  ...getCategoryStyle(post.category),
                  padding: '2px 8px', borderRadius: 20,
                }}>
                  {post.category}
                </span>
                {post.readTime && <span style={{ fontSize: 11, color: '#52525b' }}>{`${post.readTime}분 읽기`}</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#f4f4f5', marginBottom: 8, lineHeight: 1.4 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6, marginBottom: 16 }}>
                {post.desc}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#52525b' }}>{post.date}</span>
                <span style={{ fontSize: 13, color: '#818cf8', fontWeight: 700 }}>바로가기 →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#52525b', fontSize: 14, padding: '40px 0' }}>
          포스트가 없습니다.
        </div>
      )}
    </div>
  )
}
