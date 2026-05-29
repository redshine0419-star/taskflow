// Static blog pages for Autopress SEO engine.
// In production, generateStaticParams fetches published tasks from
// the user's Google Sheets via service account. Here we use demo data
// so the build succeeds and Googlebot can crawl real structure.

const DEMO_POSTS = [
  {
    slug: 'search-feature-implementation',
    title: 'Search Feature Implementation — Dev Retrospective',
    assignee: 'Alex',
    completed: '2026-07-10',
    priority: 'Medium',
    summary: 'End-to-end implementation of the full-text search module in the TaskFlow workspace.',
    keywords: 'asana alternative jira alternative free kanban board google drive project management',
  },
]

export async function generateStaticParams() {
  return DEMO_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = DEMO_POSTS.find(p => p.slug === slug) ?? {
    title: slug.replace(/-/g, ' '),
    summary: 'TaskFlow dev retrospective.',
  }
  return {
    title: `${post.title} | TaskFlow Blog`,
    description: post.summary,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      url: `https://taskflow.vercel.app/blog/${slug}`,
    },
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = DEMO_POSTS.find(p => p.slug === slug) ?? {
    slug,
    title: slug.replace(/-/g, ' '),
    assignee: '—',
    completed: '—',
    priority: '—',
    summary: 'TaskFlow dev retrospective.',
    keywords: '',
  }

  return (
    <main style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#09090b', color: '#f4f4f5',
      minHeight: '100vh', padding: '0 16px 80px',
    }}>
      {/* Nav */}
      <nav style={{
        maxWidth: 720, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 0', borderBottom: '1px solid #27272a', marginBottom: 48,
      }}>
        <a href="/" style={{
          fontWeight: 800, fontSize: 17, textDecoration: 'none',
          color: '#f4f4f5', letterSpacing: -0.5,
        }}>
          Task<span style={{ color: '#34d399' }}>Flow</span>
        </a>
        <a href="/blog" style={{ fontSize: 13, color: '#a1a1aa', textDecoration: 'none' }}>
          ← Blog
        </a>
      </nav>

      <article style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Meta badge */}
        <div style={{
          display: 'inline-block',
          background: '#34d39922', border: '1px solid #34d39944',
          borderRadius: 20, padding: '3px 12px',
          fontSize: 11, color: '#34d399', fontWeight: 700,
          marginBottom: 20, letterSpacing: 1,
        }}>
          DEV RETROSPECTIVE · taskflow.io/blog
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 40px)',
          fontWeight: 900, letterSpacing: -1, lineHeight: 1.2,
          margin: '0 0 24px',
        }}>
          {post.title}
        </h1>

        {/* Meta row */}
        <div style={{
          display: 'flex', gap: 20, flexWrap: 'wrap',
          fontSize: 13, color: '#a1a1aa',
          padding: '16px 0', borderTop: '1px solid #27272a', borderBottom: '1px solid #27272a',
          marginBottom: 40,
        }}>
          <span>👤 <strong style={{ color: '#f4f4f5' }}>{post.assignee}</strong></span>
          <span>📅 <strong style={{ color: '#f4f4f5' }}>{post.completed}</strong></span>
          <span>⚡ <strong style={{ color: '#f4f4f5' }}>{post.priority}</strong></span>
        </div>

        {/* Body */}
        <div style={{ fontSize: 15, lineHeight: 1.8, color: '#d4d4d8' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f5', margin: '0 0 12px' }}>Summary</h2>
          <p style={{ margin: '0 0 32px' }}>{post.summary}</p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f5', margin: '0 0 12px' }}>Key Deliverables</h2>
          <ul style={{ paddingLeft: 20, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Requirements analysis & technical spec</li>
            <li>UI/UX design & publishing complete</li>
            <li>Code review & QA passed</li>
            <li>Production deployment done</li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f4f4f5', margin: '0 0 12px' }}>Outcomes & Insights</h2>
          <p style={{ margin: '0 0 32px' }}>
            Led by <strong style={{ color: '#f4f4f5' }}>{post.assignee}</strong>, delivered on schedule by{' '}
            <strong style={{ color: '#f4f4f5' }}>{post.completed}</strong>.
            Managed end-to-end in TaskFlow — the serverless Asana &amp; Jira alternative that stores
            all data in your own Google Drive.
          </p>

          {/* SEO keyword paragraph — crawlable, contextually relevant */}
          <p style={{ fontSize: 13, color: '#71717a', borderTop: '1px solid #27272a', paddingTop: 24, marginTop: 8 }}>
            TaskFlow is a free kanban board and project management tool that works entirely within
            Google Drive — a modern alternative to Asana, Jira, Trello, and Notion for teams who
            want full data ownership with zero monthly SaaS fees.
          </p>
        </div>
      </article>
    </main>
  )
}
