'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['전체', '무료서식', '무료템플릿', '툴소개']

export default function BlogFilter({ posts }) {
  const [active, setActive] = useState('전체')
  const filtered = active === '전체' ? posts : posts.filter(p => p.category === active)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <style>{`
        .cat-tab { transition: background .15s, color .15s; cursor: pointer; }
        .cat-tab:hover { background: #27272a !important; }
        .post-card-blog { transition: border-color .15s, transform .15s; }
        .post-card-blog:hover { border-color: #34d399 !important; transform: translateY(-1px); }
      `}</style>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className="cat-tab"
            onClick={() => setActive(cat)}
            style={{
              padding: '7px 16px', borderRadius: 20, border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: active === cat ? '#10b981' : '#18181b',
              color: active === cat ? '#fff' : '#a1a1aa',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Post grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
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
              borderRadius: 12, padding: '20px 22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                background: post.category === '툴소개' ? '#6366f122' : '#10b98122',
                color: post.category === '툴소개' ? '#818cf8' : '#34d399',
                border: `1px solid ${post.category === '툴소개' ? '#6366f144' : '#34d39944'}`,
                padding: '2px 8px', borderRadius: 20,
              }}>
                {post.category}
              </span>
              <span style={{ fontSize: 11, color: '#52525b' }}>{post.readTime}분 읽기</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#f4f4f5', marginBottom: 8, lineHeight: 1.4 }}>
              {post.title}
            </div>
            <div style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6, marginBottom: 16 }}>
              {post.excerpt}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#52525b' }}>{post.publishedAt}</span>
              <span style={{ fontSize: 13, color: '#34d399', fontWeight: 700 }}>바로가기 →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
