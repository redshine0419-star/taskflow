'use client'
import { useState } from 'react'
import BlogFilter from './BlogFilter'
import MarketerOpsBlogFilter from './MarketerOpsBlogFilter'
import { EDM } from '../../components/gallery/edmTheme'

const SOURCES = [
  { key: 'taskgrid', label: 'TaskGrid 블로그', desc: '구글 시트 기반 무료 칸반 툴 TaskGrid의 템플릿 & 생산성 아티클' },
  { key: 'marketerops', label: 'MarketerOps 블로그', desc: 'AI 마케팅 운영 툴 MarketerOps의 SEO · GEO · 콘텐츠 아티클' },
]

export default function BlogSourceTabs({ taskgridPosts, marketeropsPosts }) {
  const [source, setSource] = useState('taskgrid')
  const active = SOURCES.find((s) => s.key === source)

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: EDM.space[2], marginBottom: EDM.space[3], flexWrap: 'wrap' }}>
        {SOURCES.map((s) => (
          <button
            key={s.key}
            onClick={() => setSource(s.key)}
            style={{
              padding: '10px 20px', borderRadius: EDM.radius.control, border: 'none',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: source === s.key ? EDM.text1 : EDM.neutral[50],
              color: source === s.key ? '#fff' : EDM.text3,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: 13, color: EDM.text3, margin: `0 0 ${EDM.space[8]}px` }}>{active.desc}</p>

      {source === 'taskgrid' ? (
        <BlogFilter posts={taskgridPosts} />
      ) : (
        <MarketerOpsBlogFilter posts={marketeropsPosts} />
      )}
    </div>
  )
}
