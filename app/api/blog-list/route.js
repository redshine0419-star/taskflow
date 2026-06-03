import { BLOG_POSTS } from '../../../lib/blog-posts'

export const revalidate = 3600

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || null

  if (process.env.DATABASE_URL) {
    try {
      const { getAllBlogPosts } = await import('../../../lib/db.js')
      const rows = await getAllBlogPosts(lang ? { lang } : undefined)
      const posts = rows.map(r => ({
        slug: r.slug, title: r.title, date: r.date,
        category: r.category, desc: r.description,
        keywords: r.keywords ? r.keywords.split(', ') : [],
        content: r.content, lang: r.lang || 'ko', imageUrl: r.image_url,
      })).filter(p => p.slug && p.title)
      if (posts.length > 0) return Response.json(posts)
    } catch (e) {
      console.error('DB blog fetch failed:', e)
    }
  }

  const staticPosts = BLOG_POSTS.map(p => ({ ...p, lang: p.lang || 'ko' }))
  const filtered = lang ? staticPosts.filter(p => p.lang === lang) : staticPosts
  return Response.json(filtered)
}
