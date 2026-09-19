import Link from 'next/link'
import { notFound } from 'next/navigation'
import { apps } from '../../../data/apps'
import { EDM, PRETENDARD_CSS_URL } from '../../../components/gallery/edmTheme'

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

function Section({ title, children, style }) {
  return (
    <section style={{ marginBottom: EDM.space[10], ...style }}>
      <h2 style={{ margin: `0 0 ${EDM.space[4]}px`, fontSize: 22, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.01em' }}>{title}</h2>
      {children}
    </section>
  )
}

export default function GuidePage({ params }) {
  const app = apps.find((a) => a.id === params.id)
  if (!app) notFound()
  const guide = app.guide

  return (
    <div style={{ background: EDM.bg, minHeight: '100vh', fontFamily: EDM.font }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px' }}>
        <Link href="/portfolio" style={{ fontSize: 14, color: EDM.text3, textDecoration: 'none' }}>
          ← 갤러리로 돌아가기
        </Link>

        <header style={{ margin: `${EDM.space[4]}px 0 ${EDM.space[6]}px` }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
            {app.name}
          </h1>
          <p style={{ marginTop: EDM.space[3], fontSize: 18, color: EDM.text3, lineHeight: 1.6 }}>{app.description}</p>
        </header>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: EDM.space[2], marginBottom: EDM.space[8] }}>
          {app.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: EDM.blue[600],
                border: `1px solid ${EDM.blue[600]}`,
                borderRadius: EDM.radius.badge,
                padding: '2px 8px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          style={{
            border: `1px solid ${EDM.borderLight}`,
            borderRadius: EDM.radius.card,
            boxShadow: EDM.shadowBlue01,
            padding: EDM.space[6],
            marginBottom: EDM.space[10],
            background: EDM.bg,
          }}
        >
          {app.status === 'live' ? (
            <>
              <p style={{ margin: 0, fontSize: 15, color: EDM.text2, lineHeight: 1.7 }}>
                이 앱은 데모 페이지에서 로그인 없이 바로 체험할 수 있어요. 아래 버튼으로 이동해서
                더미 데이터로 주요 기능을 눌러보세요.
              </p>
              <Link
                href={app.demoPath}
                style={{
                  display: 'inline-block',
                  marginTop: EDM.space[4],
                  fontSize: 15,
                  fontWeight: 500,
                  color: '#fff',
                  background: EDM.green[500],
                  borderRadius: EDM.radius.control,
                  padding: '12px 24px',
                  textDecoration: 'none',
                }}
              >
                데모 보러 가기
              </Link>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: 15, color: EDM.text3, lineHeight: 1.7 }}>
              아직 데모가 준비되지 않았어요. 곧 공개될 예정이니 조금만 기다려 주세요.
            </p>
          )}
        </div>

        {guide && (
          <>
            <Section title="🛠️ 개발 가이드">
              <p style={{ margin: 0, fontSize: 15, color: EDM.text2, lineHeight: 1.7 }}>{guide.summary}</p>
            </Section>

            <Section title="기술 스택">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: EDM.space[2] }}>
                {guide.stack.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: EDM.text2,
                      background: EDM.neutral[50],
                      borderRadius: EDM.radius.full,
                      padding: '6px 14px',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>

            <Section title="핵심 구현 포인트">
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: EDM.space[3] }}>
                {guide.keyPoints.map((point, i) => (
                  <li key={i} style={{ fontSize: 15, color: EDM.text2, lineHeight: 1.7 }}>{point}</li>
                ))}
              </ul>
            </Section>

            <Section title="이렇게 만들면 돼요">
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: EDM.space[3] }}>
                {guide.steps.map((step, i) => (
                  <li key={i} style={{ fontSize: 15, color: EDM.text2, lineHeight: 1.7 }}>{step}</li>
                ))}
              </ol>
            </Section>

            <Section title="참고 파일" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: EDM.space[2] }}>
                {guide.files.map((f) => (
                  <code
                    key={f}
                    style={{
                      fontSize: 13.5,
                      color: EDM.text2,
                      background: EDM.neutral[50],
                      borderRadius: EDM.radius.control,
                      padding: '8px 12px',
                      width: 'fit-content',
                      fontFamily: "'SF Mono', Menlo, Consolas, monospace",
                    }}
                  >
                    {f}
                  </code>
                ))}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
