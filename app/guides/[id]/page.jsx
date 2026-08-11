import Link from 'next/link'
import { notFound } from 'next/navigation'
import { apps } from '../../../data/apps'

export function generateStaticParams() {
  return apps.map((app) => ({ id: app.id }))
}

export function generateMetadata({ params }) {
  const app = apps.find((a) => a.id === params.id)
  if (!app) return {}
  return {
    title: `${app.name} 가이드 — 포트폴리오 갤러리`,
    description: app.description,
  }
}

const T = {
  bg: '#09090b',
  surface: '#18181b',
  border: '#27272a',
  text: '#f4f4f5',
  muted: '#71717a',
  emerald: '#10b981',
}

export default function GuidePage({ params }) {
  const app = apps.find((a) => a.id === params.id)
  if (!app) notFound()

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
      <Link href="/portfolio" style={{ fontSize: 13, color: T.muted, textDecoration: 'none' }}>
        ← 갤러리로 돌아가기
      </Link>

      <header style={{ margin: '16px 0 24px' }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: T.text }}>{app.name} 가이드</h1>
        <p style={{ marginTop: 8, fontSize: 14.5, color: T.muted }}>{app.description}</p>
      </header>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginBottom: 24,
        }}
      >
        {app.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 12,
              color: T.muted,
              border: `1px solid ${T.border}`,
              borderRadius: 999,
              padding: '3px 10px',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <section
        style={{
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: 20,
          background: T.surface,
        }}
      >
        {app.status === 'live' ? (
          <>
            <p style={{ margin: 0, fontSize: 14, color: T.text, lineHeight: 1.7 }}>
              이 앱은 데모 페이지에서 로그인 없이 바로 체험할 수 있어요. 아래 버튼으로 이동해서
              더미 데이터로 주요 기능을 눌러보세요.
            </p>
            <Link
              href={app.demoPath}
              style={{
                display: 'inline-block',
                marginTop: 16,
                fontSize: 13.5,
                fontWeight: 600,
                color: T.bg,
                background: T.emerald,
                border: `1px solid ${T.emerald}`,
                borderRadius: 8,
                padding: '10px 18px',
                textDecoration: 'none',
              }}
            >
              데모 보러 가기
            </Link>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: T.muted, lineHeight: 1.7 }}>
            아직 데모가 준비되지 않았어요. 곧 공개될 예정이니 조금만 기다려 주세요.
          </p>
        )}
      </section>
    </div>
  )
}
