import Link from 'next/link'

export const metadata = {
  title: 'TaskFlow Blog — Dev Retrospectives & Team Updates',
  description:
    'Auto-generated dev retrospectives from TaskFlow — the free serverless kanban board powered by Google Drive.',
}

const DEMO_POSTS = [
  {
    slug: 'search-feature-implementation',
    title: 'Search Feature Implementation — Dev Retrospective',
    assignee: 'Alex',
    completed: '2026-07-10',
    excerpt: 'End-to-end implementation of the full-text search module.',
  },
]

export default function BlogIndex() {
  return (
    <main style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#09090b', color: '#f4f4f5',
      minHeight: '100vh', padding: '0 16px 80px',
    }}>
      <style>{`
        .post-card { transition: border-color .15s; }
        .post-card:hover { border-color: #34d399 !important; }
      `}</style>

      <nav style={{
        maxWidth: 720, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 0', borderBottom: '1px solid #27272a', marginBottom: 48,
      }}>
        <Link href="/" style={{
          fontWeight: 800, fontSize: 17, textDecoration: 'none',
          color: '#f4f4f5', letterSpacing: -0.5,
        }}>
          Task<span style={{ color: '#34d399' }}>Flow</span>
        </Link>
        <span style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 700, letterSpacing: 1 }}>BLOG</span>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 900, letterSpacing: -1, margin: '0 0 8px',
        }}>
          Dev Retrospectives
        </h1>
        <p style={{ fontSize: 14, color: '#a1a1aa', margin: '0 0 40px' }}>
          Auto-published by the Autopress SEO engine · powered by TaskFlow
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DEMO_POSTS.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="post-card"
              style={{
                display: 'block', textDecoration: 'none',
                background: '#18181b', border: '1px solid #27272a',
                borderRadius: 10, padding: '18px 20px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 15, color: '#f4f4f5', marginBottom: 6 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 12, color: '#a1a1aa' }}>
                {post.assignee} · {post.completed}
              </div>
              <div style={{ fontSize: 13, color: '#71717a', marginTop: 8 }}>{post.excerpt}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
