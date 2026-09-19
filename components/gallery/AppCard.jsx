import Link from 'next/link'
import { EDM } from './edmTheme'

export default function AppCard({ app }) {
  const isLive = app.status === 'live'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: EDM.space[3],
        border: `1px solid ${EDM.borderLight}`,
        borderRadius: EDM.radius.card,
        boxShadow: EDM.shadowBlue01,
        background: EDM.bg,
        padding: EDM.space[6],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: EDM.space[2] }}>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: EDM.text1, letterSpacing: '-0.01em' }}>{app.name}</h3>
        {!isLive && (
          <span
            style={{
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 600,
              color: EDM.text3,
              background: EDM.borderLight,
              borderRadius: EDM.radius.badge,
              padding: '3px 8px',
            }}
          >
            곧 공개
          </span>
        )}
      </div>

      <p style={{ margin: 0, fontSize: 15, color: EDM.text2, lineHeight: 1.6, flex: 1 }}>{app.description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: EDM.space[2] }}>
        {app.tags.map((tag) => (
          <span
            key={tag}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
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

      <div style={{ display: 'flex', gap: EDM.space[2], marginTop: EDM.space[2] }}>
        {isLive ? (
          <Link
            href={app.demoPath}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: '-0.16px',
              color: '#fff',
              background: EDM.green[500],
              borderRadius: EDM.radius.control,
              padding: '10px 0',
              textDecoration: 'none',
            }}
          >
            데모 보기
          </Link>
        ) : (
          <button
            type="button"
            disabled
            style={{
              flex: 1,
              fontSize: 15,
              fontWeight: 500,
              color: EDM.text4,
              background: EDM.neutral[50],
              border: 'none',
              borderRadius: EDM.radius.control,
              padding: '10px 0',
              cursor: 'not-allowed',
            }}
          >
            데모 보기
          </button>
        )}

        <Link
          href={app.guidePath}
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: '-0.16px',
            color: EDM.text1,
            background: 'transparent',
            border: `1px solid ${EDM.text1}`,
            borderRadius: EDM.radius.control,
            padding: '10px 0',
            textDecoration: 'none',
          }}
        >
          가이드 보기
        </Link>
      </div>
    </div>
  )
}
