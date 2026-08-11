import Link from 'next/link'
import { DARK as T } from './theme'

export default function AppCard({ app }) {
  const isLive = app.status === 'live'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        background: T.bg,
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: T.surface,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <span style={{ fontSize: 32, fontWeight: 700, color: T.muted }}>
          {app.name.slice(0, 1).toUpperCase()}
        </span>
        {!isLive && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontSize: 11,
              fontWeight: 600,
              color: T.amber,
              border: `1px solid ${T.amber}`,
              borderRadius: 999,
              padding: '3px 9px',
            }}
          >
            곧 공개
          </span>
        )}
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>{app.name}</h3>

        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            color: T.muted,
            lineHeight: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {app.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {app.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11.5,
                color: T.muted,
                border: `1px solid ${T.border}`,
                borderRadius: 999,
                padding: '2px 9px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 6 }}>
          {isLive ? (
            <Link
              href={app.demoPath}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: T.bg,
                background: T.emerald,
                border: `1px solid ${T.emerald}`,
                borderRadius: 8,
                padding: '8px 0',
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
                fontSize: 13,
                fontWeight: 600,
                color: T.muted,
                background: 'transparent',
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: '8px 0',
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
              fontSize: 13,
              fontWeight: 600,
              color: T.text,
              background: 'transparent',
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              padding: '8px 0',
              textDecoration: 'none',
            }}
          >
            가이드 보기
          </Link>
        </div>
      </div>
    </div>
  )
}
