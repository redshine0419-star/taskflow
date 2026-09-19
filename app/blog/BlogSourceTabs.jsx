'use client'
import { useState } from 'react'
import BlogFilter from './BlogFilter'
import MarketerOpsBlogFilter from './MarketerOpsBlogFilter'

const SOURCES = [
  { key: 'taskgrid', label: 'TaskGrid 블로그', desc: '구글 시트 기반 무료 칸반 툴 TaskGrid의 템플릿 & 생산성 아티클' },
  { key: 'marketerops', label: 'MarketerOps 블로그', desc: 'AI 마케팅 운영 툴 MarketerOps의 SEO · GEO · 콘텐츠 아티클' },
]

export default function BlogSourceTabs({ taskgridPosts, marketeropsPosts }) {
  const [source, setSource] = useState('taskgrid')
  const active = SOURCES.find((s) => s.key === source)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {SOURCES.map((s) => (
          <button
            key={s.key}
            onClick={() => setSource(s.key)}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: source === s.key ? '#f4f4f5' : '#18181b',
              color: source === s.key ? '#09090b' : '#a1a1aa',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 13, color: '#71717a', margin: '0 0 28px' }}>{active.desc}</p>

      {source === 'taskgrid' ? (
        <BlogFilter posts={taskgridPosts} />
      ) : (
        <MarketerOpsBlogFilter posts={marketeropsPosts} />
      )}
    </div>
  )
}
