import Link from 'next/link'
import { BLOG_POSTS } from '../../lib/blog-posts'
import BlogFilter from './BlogFilter'

export const revalidate = 3600

export const metadata = {
  title: 'Free Templates & Productivity Tools | TaskGrid Blog',
  description: 'Free project management templates, kanban boards, task planners, and productivity tools. Download instantly, no signup required.',
  keywords: ['free project management template', 'kanban board free', 'task planner template', 'free productivity tools', 'team collaboration'],
  alternates: { canonical: 'https://taskgrid.my/blog' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Free Templates & Productivity Tools | TaskGrid Blog',
    description: 'Free project management templates, kanban boards, task planners, and productivity tools.',
    type: 'website',
    url: 'https://taskgrid.my/blog',
    locale: 'en_US',
  },
}

async function getPostsFromSheets() {
  const token = process.env.GOOGLE_SHEETS_SERVICE_TOKEN
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  if (!token || !spreadsheetId) return null
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/BlogPosts!A2:J1000`,
      { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
    )
    const data = await res.json()
    const rows = data.values || []
    return rows.map(r => ({
      slug: r[0] || '', title: r[1] || '', date: r[2] || '',
      category: r[3] || '', desc: r[4] || '',
      keywords: r[5] ? r[5].split(', ') : [],
      content: r[6] || '', usedKeyword: r[7] || '',
      lang: r[8] || 'ko', imageUrl: r[9] || '',
    })).filter(p => p.slug && p.title)
  } catch (e) {
    console.error('getPostsFromSheets failed:', e)
    return null
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free Templates & Productivity Tools — TaskGrid Blog',
  url: 'https://taskgrid.my/blog',
  itemListElement: BLOG_POSTS.map((post, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: post.title,
    url: `https://taskgrid.my/blog/${post.slug}`,
    description: post.desc || post.excerpt || '',
  })),
}

export default async function BlogIndex() {
  const sheetsPosts = await getPostsFromSheets()
  const posts = sheetsPosts && sheetsPosts.length > 0
    ? [...BLOG_POSTS, ...sheetsPosts]
    : BLOG_POSTS

  return (
    <main style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#09090b', color: '#f4f4f5',
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #27272a',
      }}>
        <div style={{
          maxWidth: 860, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
        }}>
          <Link href="/" style={{
            fontWeight: 800, fontSize: 17, textDecoration: 'none',
            color: '#f4f4f5', letterSpacing: -0.5,
          }}>
            Task<span style={{ color: '#34d399' }}>Grid</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/blog" style={{ fontSize: 13, color: '#a1a1aa', textDecoration: 'none', fontWeight: 600 }}>Blog</Link>
            <Link href="/" style={{
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              background: '#10b981', color: '#fff',
              padding: '7px 14px', borderRadius: 8, whiteSpace: 'nowrap',
            }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 16px 32px' }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 42px)',
          fontWeight: 900, letterSpacing: -1, lineHeight: 1.2,
          margin: '0 0 16px',
        }}>
          Free Templates &amp; Tools<br />
          <span style={{ color: '#34d399' }}>for Productive Teams</span>
        </h1>
        <p style={{ fontSize: 15, color: '#a1a1aa', margin: 0, lineHeight: 1.7, maxWidth: 520 }}>
          Download free project management templates, kanban boards, and productivity tools.
          No ads, no signup required — just practical resources for modern teams.
        </p>
      </div>

      {/* Client-side filter + grid */}
      <div style={{ padding: '0 16px 80px' }}>
        <BlogFilter posts={posts} />
      </div>

      {/* Footer */}
      <footer style={{
        maxWidth: 860, margin: '0 auto',
        borderTop: '1px solid #27272a', padding: '32px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 15, textDecoration: 'none', color: '#f4f4f5' }}>
          Task<span style={{ color: '#34d399' }}>Grid</span>
        </Link>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none' }}>Home</Link>
          <Link href="/" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none' }}>Sign Up Free</Link>
          <Link href="/blog" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none' }}>Blog</Link>
        </div>
      </footer>
    </main>
  )
}
