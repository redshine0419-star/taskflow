'use client'
import { useMemo, useState } from 'react'
import AppCard from './AppCard'
import { DARK as T } from './theme'

const ALL = '전체'

export default function PortfolioGallery({ apps }) {
  const tags = useMemo(() => {
    const set = new Set()
    apps.forEach((app) => app.tags.forEach((tag) => set.add(tag)))
    return [ALL, ...Array.from(set)]
  }, [apps])

  const [activeTag, setActiveTag] = useState(ALL)

  const visibleApps = useMemo(
    () => (activeTag === ALL ? apps : apps.filter((app) => app.tags.includes(activeTag))),
    [apps, activeTag]
  )

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 80px' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: T.text }}>
          바이브 코딩 포트폴리오
        </h1>
        <p style={{ marginTop: 8, fontSize: 14.5, color: T.muted }}>
          바이브 코딩으로 만든 앱들을 한자리에 모았습니다.
        </p>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {tags.map((tag) => {
          const active = tag === activeTag
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: active ? T.bg : T.text,
                background: active ? T.emerald : 'transparent',
                border: `1px solid ${active ? T.emerald : T.border}`,
                borderRadius: 999,
                padding: '7px 14px',
                cursor: 'pointer',
              }}
            >
              {tag}
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {visibleApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      {visibleApps.length === 0 && (
        <p style={{ color: T.muted, fontSize: 14, marginTop: 24 }}>
          해당 태그의 앱이 아직 없어요.
        </p>
      )}
    </div>
  )
}
