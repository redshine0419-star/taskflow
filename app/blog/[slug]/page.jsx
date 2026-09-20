import Link from 'next/link'
import { BLOG_POSTS } from '../../../lib/blog-posts'
import { MARKETEROPS_BLOG_POSTS } from '../../../data/marketerOpsBlogPosts'
import { EDM, PRETENDARD_CSS_URL } from '../../../components/gallery/edmTheme'

export const revalidate = 3600
export const dynamicParams = true

async function getAllPosts() {
  if (process.env.DATABASE_URL) {
    try {
      const { getAllBlogPosts } = await import('../../../lib/db.js')
      const rows = await getAllBlogPosts()
      const dbPosts = rows.map(r => ({
        slug: r.slug, title: r.title, date: r.date,
        category: r.category, desc: r.description,
        keywords: r.keywords ? r.keywords.split(', ') : [],
        content: r.content, lang: r.lang, imageUrl: r.image_url,
        source: 'taskgrid',
      })).filter(p => p.slug && p.title)
      if (dbPosts.length > 0) return [...BLOG_POSTS, ...MARKETEROPS_BLOG_POSTS, ...dbPosts]
    } catch {
      // fall through to static only
    }
  }
  return [...BLOG_POSTS, ...MARKETEROPS_BLOG_POSTS]
}

export async function generateStaticParams() {
  return [...BLOG_POSTS, ...MARKETEROPS_BLOG_POSTS].map(p => ({ slug: p.slug }))
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
        fontFamily: EDM.font,
        background: EDM.bg, color: EDM.text1,
        minHeight: '100vh', padding: '80px 16px',
        textAlign: 'center',
      }}>
        <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Post not found</h1>
        <Link href="/blog" style={{ color: EDM.green[600], textDecoration: 'none', marginTop: 16, display: 'inline-block' }}>← Back to Blog</Link>
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

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${EDM.borderLight}`,
      }}>
        <div style={{
          maxWidth: 760, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
        }}>
          <Link href="/" style={{
            fontWeight: 800, fontSize: 17, textDecoration: 'none',
            color: EDM.text1, letterSpacing: -0.5,
          }}>
            Task<span style={{ color: EDM.green[600] }}>Grid</span>
          </Link>
          <Link href="/blog" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>
            {isEn ? '← Blog' : '← 블로그'}
          </Link>
        </div>
      </nav>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '40px 16px 80px' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ fontSize: 12, color: EDM.text4, marginBottom: 24, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: EDM.text4, textDecoration: 'none' }}>{isEn ? 'Home' : '홈'}</Link>
          <span>›</span>
          <Link href="/blog" style={{ color: EDM.text4, textDecoration: 'none' }}>{isEn ? 'Blog' : '블로그'}</Link>
          <span>›</span>
          <span style={{ color: EDM.text3 }}>{post.title}</span>
        </nav>

        {/* Meta bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
            background: EDM.green[50], color: EDM.green[700],
            border: `1px solid ${EDM.green[200]}`,
            padding: '2px 10px', borderRadius: EDM.radius.full,
          }}>
            {post.category}
          </span>
          <span style={{ fontSize: 12, color: EDM.text4 }}>{postDate}</span>
          {post.readTime && (
            <span style={{ fontSize: 12, color: EDM.text4 }}>
              {isEn ? `${post.readTime} min read` : `읽기 ${post.readTime}분`}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3,
          margin: '0 0 24px', wordBreak: 'break-word', color: EDM.text1,
        }}>
          {post.title}
        </h1>

        {/* Hero Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            style={{ width: '100%', borderRadius: EDM.radius.card, marginBottom: 32, objectFit: 'cover', maxHeight: 360, display: 'block' }}
          />
        )}

        {/* CTA box — only show for posts with explicit downloadLabel */}
        {post.downloadLabel && (
          <div style={{
            border: `2px solid ${EDM.green[500]}`,
            borderRadius: EDM.radius.card, padding: '20px 24px',
            background: EDM.green[50],
            marginBottom: 40,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: EDM.green[700], letterSpacing: 0.5 }}>
              {isEn ? 'FREE DOWNLOAD' : '무료 다운로드'}
            </div>
            <div style={{ fontSize: 15, color: EDM.text1, fontWeight: 600 }}>
              {post.downloadLabel}
            </div>
            <Link href="/" style={{
              display: 'inline-block', width: 'fit-content',
              background: EDM.green[500], color: '#fff',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              padding: '11px 24px', borderRadius: EDM.radius.control,
            }}>
              {isEn ? 'Get it Free →' : `${post.downloadLabel} →`}
            </Link>
            {post.downloadNote && <div style={{ fontSize: 12, color: EDM.text3 }}>{post.downloadNote}</div>}
          </div>
        )}

        {/* Tags */}
        {postTags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {postTags.map(tag => (
              <span key={tag} style={{
                fontSize: 11, color: EDM.text3,
                background: EDM.neutral[50], border: `1px solid ${EDM.border}`,
                padding: '3px 10px', borderRadius: EDM.radius.full,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="blog-content"
          style={{ fontSize: 15, lineHeight: 1.8, color: EDM.text2 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom CTA */}
        <div style={{
          marginTop: 48, padding: '24px',
          background: EDM.neutral[50], border: `1px solid ${EDM.borderLight}`,
          borderRadius: EDM.radius.card, textAlign: 'center',
        }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: EDM.text1 }}>
            {isEn ? 'Manage your team projects smarter' : '팀 프로젝트를 더 체계적으로 관리하세요'}
          </div>
          <div style={{ fontSize: 13, color: EDM.text3, marginBottom: 16 }}>
            {isEn
              ? '100% free kanban board powered by your own Google Drive'
              : '구글 드라이브 기반 100% 무료 프로젝트 관리 툴'}
          </div>
          <Link href="/" style={{
            display: 'inline-block',
            background: EDM.green[500], color: '#fff',
            fontWeight: 700, fontSize: 14, textDecoration: 'none',
            padding: '11px 28px', borderRadius: EDM.radius.control,
          }}>
            {isEn ? 'Start with TaskGrid — Free →' : 'TaskGrid로 팀 프로젝트 관리하기 →'}
          </Link>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: EDM.text4, letterSpacing: 1, marginBottom: 16 }}>
              {isEn ? 'RELATED POSTS' : '관련 게시글'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {related.map(rp => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  style={{
                    display: 'block', textDecoration: 'none',
                    background: EDM.bg, border: `1px solid ${EDM.borderLight}`,
                    borderRadius: EDM.radius.control, padding: '14px 18px',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14, color: EDM.text1, marginBottom: 4 }}>{rp.title}</div>
                  <div style={{ fontSize: 12, color: EDM.text3 }}>{(rp.desc || rp.excerpt || '').slice(0, 100)}…</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
