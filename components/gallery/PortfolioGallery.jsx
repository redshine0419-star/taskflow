'use client'
import { useMemo, useState } from 'react'
import AppCard from './AppCard'
import { EDM, PRETENDARD_CSS_URL } from './edmTheme'

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
    <div style={{ background: EDM.bg, minHeight: '100vh', fontFamily: EDM.font }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 24px 100px' }}>
        <header style={{ marginBottom: EDM.space[8] }}>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            바이브 코딩 포트폴리오
          </h1>
          <p style={{ marginTop: EDM.space[3], fontSize: 18, color: EDM.text3, lineHeight: 1.5 }}>
            바이브 코딩으로 만든 앱들을 한자리에 모았습니다.
          </p>
        </header>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: EDM.space[2], marginBottom: EDM.space[8] }}>
          {tags.map((tag) => {
            const active = tag === activeTag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                style={{
                  fontSize: 14,
                  fontWeight: active ? 700 : 400,
                  letterSpacing: '-0.14px',
                  color: active ? '#fff' : EDM.text3,
                  background: active ? EDM.green[500] : EDM.neutral[50],
                  border: 'none',
                  borderRadius: EDM.radius.full,
                  padding: '9px 20px',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: EDM.space[6],
          }}
        >
          {visibleApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        {visibleApps.length === 0 && (
          <p style={{ color: EDM.text3, fontSize: 15, marginTop: EDM.space[6] }}>
            해당 태그의 앱이 아직 없어요.
          </p>
        )}
      </div>
    </div>
  )
}
