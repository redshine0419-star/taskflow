import Link from 'next/link'
import { BLOG_POSTS } from '../../lib/blog-posts'
import { MARKETEROPS_BLOG_POSTS } from '../../data/marketerOpsBlogPosts'
import { EDM, PRETENDARD_CSS_URL } from '../../components/gallery/edmTheme'
import SiteNav from '../../components/gallery/SiteNav'
import BlogSourceTabs from './BlogSourceTabs'

export const revalidate = 0

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

async function getPostsFromDb() {
  if (!process.env.DATABASE_URL) return null
  try {
    const { getAllBlogPosts } = await import('../../lib/db.js')
    const rows = await getAllBlogPosts()
    return rows.map(r => ({
      slug: r.slug, title: r.title, date: r.date,
      category: r.category, desc: r.description,
      keywords: r.keywords ? r.keywords.split(', ') : [],
      content: r.content, lang: r.lang, imageUrl: r.image_url,
    })).filter(p => p.slug && p.title)
  } catch (e) {
    console.error('getPostsFromDb failed:', e)
    return null
  }
}


const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free Templates & Productivity Tools — TaskGrid Blog',
  url: 'https://taskgrid.my/blog',
  itemListElement: [...BLOG_POSTS, ...MARKETEROPS_BLOG_POSTS].map((post, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: post.title,
    url: `https://taskgrid.my/blog/${post.slug}`,
    description: post.desc || post.excerpt || '',
  })),
}

export default async function BlogIndex() {
  const dbPosts = await getPostsFromDb()
  const taskgridPosts = dbPosts ?? []

  return (
    <main style={{
      fontFamily: EDM.font,
      background: EDM.bg, color: EDM.text1,
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteNav />

      {/* Hero */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 16px 32px' }}>
        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 42px)',
          fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25,
          margin: '0 0 16px', color: EDM.text1,
        }}>
          Free Templates &amp; Tools<br />
          <span style={{ color: EDM.green[600] }}>for Productive Teams</span>
        </h1>
        <p style={{ fontSize: 15, color: EDM.text3, margin: 0, lineHeight: 1.7, maxWidth: 520 }}>
          Download free project management templates, kanban boards, and productivity tools.
          No ads, no signup required — just practical resources for modern teams.
        </p>
      </div>

      {/* Client-side source tabs + filter + grid */}
      <div style={{ padding: '0 16px 80px' }}>
        <BlogSourceTabs taskgridPosts={taskgridPosts} marketeropsPosts={MARKETEROPS_BLOG_POSTS} />
      </div>

      {/* Footer */}
      <footer style={{
        maxWidth: 860, margin: '0 auto',
        borderTop: `1px solid ${EDM.borderLight}`, padding: '32px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontWeight: 800, fontSize: 15, color: EDM.text1 }}>
          바이브<span style={{ color: EDM.green[600] }}>코딩</span>
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>메인</Link>
          <Link href="/portfolio" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>포트폴리오</Link>
          <Link href="/blog" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>블로그</Link>
        </div>
      </footer>
    </main>
  )
}
