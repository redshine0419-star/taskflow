'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
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
    <div style={{ background: EDM.bg, minHeight: '100vh', fontFamily: EDM.font, color: EDM.text1 }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      <nav style={{ borderBottom: `1px solid ${EDM.borderLight}` }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto', padding: '18px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em', color: EDM.text1 }}>
            바이브 코딩 포트폴리오
          </span>
          <Link
            href="/blog"
            style={{
              fontSize: 14, fontWeight: 600, color: EDM.text2, textDecoration: 'none',
              padding: '8px 16px', borderRadius: EDM.radius.control, border: `1px solid ${EDM.border}`,
            }}
          >
            블로그
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 24px 100px' }}>
        <header style={{ marginBottom: EDM.space[10] }}>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            바이브 코딩 포트폴리오
          </h1>
          <p style={{ marginTop: EDM.space[4], fontSize: 18, color: EDM.text3, lineHeight: 1.7, maxWidth: 680 }}>
            AI와 함께 아이디어를 빠르게 실제 서비스로 만들어보는 &ldquo;바이브 코딩&rdquo; 프로젝트들을 모아둔 페이지예요.
            칸반 보드, AI 마케팅 툴, NGO 홈페이지 등 실제 서비스를 참고해 만든 앱들을 로그인 없이 바로 체험할 수 있고,
            각 앱마다 어떻게 만들었는지 설명하는 개발 가이드도 함께 볼 수 있어요.
          </p>
          <p style={{ marginTop: EDM.space[3], fontSize: 15, color: EDM.text3, lineHeight: 1.7 }}>
            아래 태그로 원하는 카테고리의 앱을 필터링해보세요. 프로젝트를 만들며 정리한 글은{' '}
            <Link href="/blog" style={{ color: EDM.blue[600], fontWeight: 600, textDecoration: 'underline' }}>
              블로그
            </Link>
            에서 볼 수 있어요.
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
