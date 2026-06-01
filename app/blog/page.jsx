import Link from 'next/link'
import { BLOG_POSTS } from '../../lib/blog-posts'
import BlogFilter from './BlogFilter'

export const revalidate = 3600

export const metadata = {
  title: 'Free Templates & Productivity Tools | TaskFlow Blog',
  description: 'Free project management templates, kanban boards, task planners, and Korean office forms. Download instantly, no signup required.',
  keywords: ['free project management template', 'kanban board free', 'task planner template', '무료서식', '업무일지 양식', '회의록 양식', '프로젝트 관리 무료 툴'],
  alternates: { canonical: 'https://taskflow.vercel.app/blog' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Free Templates & Productivity Tools | TaskFlow Blog',
    description: 'Free project management templates, kanban boards, task planners, and Korean office forms.',
    type: 'website',
    url: 'https://taskflow.vercel.app/blog',
    locale: 'en_US',
  },
}

async function getPostsFromSheets() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/blog-list`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('blog-list fetch failed')
    return await res.json()
  } catch (e) {
    console.error('getPostsFromSheets failed:', e)
    return null
  }
}



const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '직장인 실무 서식·템플릿 무료 다운로드',
  url: 'https://taskflow.vercel.app/blog',
  itemListElement: BLOG_POSTS.map((post, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: post.title,
    url: `https://taskflow.vercel.app/blog/${post.slug}`,
    description: post.excerpt,
  })),
}

export default async function BlogIndex() {
  const sheetsPosts = await getPostsFromSheets()
  const posts = sheetsPosts && sheetsPosts.length > 0 ? sheetsPosts : BLOG_POSTS

  return (
    <main style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#09090b', color: '#f4f4f5',
      minHeight: '100vh', padding: '0 16px 80px',
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
          padding: '14px 0',
        }}>
          <Link href="/" style={{
            fontWeight: 800, fontSize: 17, textDecoration: 'none',
            color: '#f4f4f5', letterSpacing: -0.5,
          }}>
            Task<span style={{ color: '#34d399' }}>Flow</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/blog" style={{ fontSize: 13, color: '#a1a1aa', textDecoration: 'none', fontWeight: 600 }}>블로그</Link>
            <Link href="/" style={{
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              background: '#10b981', color: '#fff',
              padding: '7px 16px', borderRadius: 8,
            }}>무료 시작하기</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 0 40px' }}>
        <h1 style={{
          fontSize: 'clamp(26px, 4vw, 42px)',
          fontWeight: 900, letterSpacing: -1, lineHeight: 1.2,
          margin: '0 0 16px',
        }}>
          직장인 실무 서식 · 템플릿<br />
          <span style={{ color: '#34d399' }}>무료 다운로드</span>
        </h1>
        <p style={{ fontSize: 15, color: '#a1a1aa', margin: '0 0 8px', lineHeight: 1.7, maxWidth: 520 }}>
          연말정산 시뮬레이터, 지출결의서, 업무일지, 회의록, 노션 템플릿을 광고 없이 바로 다운로드하세요.
          실무에서 바로 쓸 수 있는 기업 표준 서식을 무료로 제공합니다.
        </p>
      </div>

      {/* Client-side filter + grid */}
      <BlogFilter posts={posts} />

      {/* Footer */}
      <footer style={{
        maxWidth: 860, margin: '60px auto 0',
        borderTop: '1px solid #27272a', paddingTop: 32,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 15, textDecoration: 'none', color: '#f4f4f5' }}>
          Task<span style={{ color: '#34d399' }}>Flow</span>
        </Link>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none' }}>홈</Link>
          <Link href="/" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none' }}>무료 가입</Link>
          <Link href="/blog" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none' }}>블로그</Link>
        </div>
      </footer>
    </main>
  )
}
