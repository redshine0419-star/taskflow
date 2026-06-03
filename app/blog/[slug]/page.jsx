import Link from 'next/link'
import { BLOG_POSTS } from '../../../lib/blog-posts'

export const revalidate = 3600
export const dynamicParams = true

async function getAllPosts() {
  if (process.env.DATABASE_URL) {
    try {
      const { getAllBlogPosts } = await import('../../../lib/db.js')
      const rows = await getAllBlogPosts()
      const dbPosts = rows.map(r => ({
        slug: r.slug, title: r.title, date: r.date,
        category: r.category, desc: r.desc,
        keywords: r.keywords ? r.keywords.split(', ') : [],
        content: r.content, lang: r.lang, imageUrl: r.image_url,
      })).filter(p => p.slug && p.title)
      if (dbPosts.length > 0) return [...BLOG_POSTS, ...dbPosts]
    } catch {
      // fall through to static only
    }
  }
  return BLOG_POSTS
}

export async function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const allPosts = await getAllPosts()
  const post = allPosts.find(p => p.slug === decodedSlug)
  if (!post) return { title: 'Post not found | TaskGrid Blog' }
  const isEn = post.lang !== 'ko'
  const description = post.desc || post.excerpt || ''
  const keywords = post.keywords || post.tags || []
  return {
    title: `${post.title} | TaskGrid Blog`,
    description,
    keywords,
    alternates: { canonical: `https://taskgrid.my/blog/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `https://taskgrid.my/blog/${slug}`,
      locale: isEn ? 'en_US' : 'ko_KR',
      publishedTime: post.date || post.publishedAt,
      tags: Array.isArray(keywords) ? keywords : [],
    },
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const allPosts = await getAllPosts()
  const post = allPosts.find(p => p.slug === decodedSlug)
  const isEn = !post || post.lang !== 'ko'

  if (!post) {
    return (
      <main style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: '#09090b', color: '#f4f4f5',
        minHeight: '100vh', padding: '80px 16px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Post not found</h1>
        <Link href="/blog" style={{ color: '#34d399', textDecoration: 'none', marginTop: 16, display: 'inline-block' }}>← Back to Blog</Link>
      </main>
    )
  }

  const related = allPosts.filter(p => p.slug !== decodedSlug && p.category === post.category && p.lang === post.lang).slice(0, 3)
  const postDesc = post.desc || post.excerpt || ''
  const postDate = post.date || post.publishedAt || ''
  const postTags = Array.isArray(post.keywords) ? post.keywords : (Array.isArray(post.tags) ? post.tags : [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: postDesc,
    datePublished: postDate,
    author: { '@type': 'Organization', name: 'TaskGrid' },
    publisher: { '@type': 'Organization', name: 'TaskGrid', url: 'https://taskgrid.my' },
    url: `https://taskgrid.my/blog/${slug}`,
    keywords: postTags.join(', '),
    image: post.imageUrl || undefined,
  }

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

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #27272a',
      }}>
        <div style={{
          maxWidth: 760, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
        }}>
          <Link href="/" style={{
            fontWeight: 800, fontSize: 17, textDecoration: 'none',
            color: '#f4f4f5', letterSpacing: -0.5,
          }}>
            Task<span style={{ color: '#34d399' }}>Grid</span>
          </Link>
          <Link href="/blog" style={{ fontSize: 13, color: '#a1a1aa', textDecoration: 'none' }}>
            {isEn ? '← Blog' : '← 블로그'}
          </Link>
        </div>
      </nav>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '40px 16px 80px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ fontSize: 12, color: '#52525b', marginBottom: 24, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#52525b', textDecoration: 'none' }}>{isEn ? 'Home' : '홈'}</Link>
          <span>›</span>
          <Link href="/blog" style={{ color: '#52525b', textDecoration: 'none' }}>{isEn ? 'Blog' : '블로그'}</Link>
          <span>›</span>
          <span style={{ color: '#a1a1aa' }}>{post.title}</span>
        </nav>

        {/* Meta bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
            background: '#10b98122', color: '#34d399',
            border: '1px solid #34d39944',
            padding: '2px 10px', borderRadius: 20,
          }}>
            {post.category}
          </span>
          <span style={{ fontSize: 12, color: '#52525b' }}>{postDate}</span>
          {post.readTime && (
            <span style={{ fontSize: 12, color: '#52525b' }}>
              {isEn ? `${post.readTime} min read` : `읽기 ${post.readTime}분`}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.25,
          margin: '0 0 24px', wordBreak: 'break-word',
        }}>
          {post.title}
        </h1>

        {/* Hero Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ width: '100%', borderRadius: 12, marginBottom: 32, objectFit: 'cover', maxHeight: 360, display: 'block' }}
          />
        )}

        {/* CTA box */}
        <div style={{
          border: '2px solid #10b981',
          borderRadius: 12, padding: '20px 24px',
          background: 'rgba(16,185,129,0.06)',
          marginBottom: 40,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399', letterSpacing: 0.5 }}>
            {isEn ? 'FREE DOWNLOAD' : '무료 다운로드'}
          </div>
          <div style={{ fontSize: 15, color: '#f4f4f5', fontWeight: 600 }}>
            {post.downloadLabel || post.title}
          </div>
          <Link href="/" style={{
            display: 'inline-block', width: 'fit-content',
            background: '#10b981', color: '#fff',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
            padding: '11px 24px', borderRadius: 8,
          }}>
            {isEn ? 'Get it Free →' : (post.downloadLabel ? `${post.downloadLabel} →` : '무료 다운로드 →')}
          </Link>
          {post.downloadNote && <div style={{ fontSize: 12, color: '#71717a' }}>{post.downloadNote}</div>}
        </div>

        {/* Tags */}
        {postTags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {postTags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, color: '#71717a',
                background: '#18181b', border: '1px solid #27272a',
                padding: '3px 10px', borderRadius: 20,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="blog-content"
          style={{ fontSize: 15, lineHeight: 1.8, color: '#d4d4d8' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom CTA */}
        <div style={{
          marginTop: 48, padding: '24px',
          background: '#18181b', border: '1px solid #27272a',
          borderRadius: 12, textAlign: 'center',
        }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
            {isEn ? 'Manage your team projects smarter' : '팀 프로젝트를 더 체계적으로 관리하세요'}
          </div>
          <div style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 16 }}>
            {isEn
              ? '100% free kanban board powered by your own Google Drive'
              : '구글 드라이브 기반 100% 무료 프로젝트 관리 툴'}
          </div>
          <Link href="/" style={{
            display: 'inline-block',
            background: '#10b981', color: '#fff',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
            padding: '11px 28px', borderRadius: 8,
          }}>
            {isEn ? 'Start with TaskGrid — Free →' : 'TaskGrid로 팀 프로젝트 관리하기 →'}
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#52525b', letterSpacing: 1, marginBottom: 16 }}>
              {isEn ? 'RELATED POSTS' : '관련 게시글'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {related.map(rp => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  style={{
                    display: 'block', textDecoration: 'none',
                    background: '#18181b', border: '1px solid #27272a',
                    borderRadius: 10, padding: '14px 18px',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#f4f4f5', marginBottom: 4 }}>{rp.title}</div>
                  <div style={{ fontSize: 12, color: '#71717a' }}>{(rp.desc || rp.excerpt || '').slice(0, 100)}…</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
