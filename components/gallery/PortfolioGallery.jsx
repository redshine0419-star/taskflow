'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import AppCard from './AppCard'
import SiteNav from './SiteNav'
import { EDM, PRETENDARD_CSS_URL } from './edmTheme'

const ALL = '전체'

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'app', label: '앱' },
  { key: 'homepage', label: '홈페이지' },
]

export default function PortfolioGallery({ apps }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTag, setActiveTag] = useState(ALL)

  const categoryApps = useMemo(
    () => (activeCategory === 'all' ? apps : apps.filter((app) => app.category === activeCategory)),
    [apps, activeCategory]
  )

  const tags = useMemo(() => {
    const set = new Set()
    categoryApps.forEach((app) => app.tags.forEach((tag) => set.add(tag)))
    return [ALL, ...Array.from(set)]
  }, [categoryApps])

  const handleCategoryChange = (key) => {
    setActiveCategory(key)
    setActiveTag(ALL)
  }

  const visibleApps = useMemo(
    () => (activeTag === ALL ? categoryApps : categoryApps.filter((app) => app.tags.includes(activeTag))),
    [categoryApps, activeTag]
  )

  return (
    <div style={{ background: EDM.bg, minHeight: '100vh', fontFamily: EDM.font, color: EDM.text1 }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />

      <SiteNav />

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '60px 24px 100px' }}>
        <header style={{ marginBottom: EDM.space[10] }}>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            포트폴리오
          </h1>
          <p style={{ marginTop: EDM.space[4], fontSize: 18, color: EDM.text3, lineHeight: 1.7, maxWidth: 680 }}>
            AI와 함께 아이디어를 빠르게 실제 서비스로 만들어보는 &ldquo;바이브 코딩&rdquo;으로 만든 프로젝트들이에요.
            칸반 보드, AI 마케팅 툴, NGO 홈페이지 등 실제 서비스를 참고해 만든 앱들을 로그인 없이 바로 체험할 수 있고,
            각 앱마다 어떻게 만들었는지 설명하는 개발 가이드도 함께 볼 수 있어요.
          </p>
          <p style={{ marginTop: EDM.space[3], fontSize: 15, color: EDM.text3, lineHeight: 1.7 }}>
            아래에서 앱과 홈페이지를 구분해서 보거나, 태그로 원하는 카테고리를 필터링해보세요. 프로젝트를 만들며 정리한 글은{' '}
            <Link href="/blog" style={{ color: EDM.blue[600], fontWeight: 600, textDecoration: 'underline' }}>
              블로그
            </Link>
            에서 볼 수 있어요.
          </p>
        </header>

        {/* Category tabs: 앱 vs 홈페이지 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: EDM.space[2], marginBottom: EDM.space[4] }}>
          {CATEGORIES.map((cat) => {
            const active = cat.key === activeCategory
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategoryChange(cat.key)}
                style={{
                  fontSize: 15,
                  fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : EDM.text2,
                  background: active ? EDM.text1 : EDM.neutral[50],
                  border: 'none',
                  borderRadius: EDM.radius.control,
                  padding: '10px 22px',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Tag filter, scoped to the active category */}
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
            해당 조건의 프로젝트가 아직 없어요.
          </p>
        )}
      </div>
    </div>
  )
}
