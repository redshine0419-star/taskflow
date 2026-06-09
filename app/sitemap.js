export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.taskgrid.my'

export default async function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  let blogEntries = []
  try {
    const { getDb } = await import('../lib/db.js')
    const sql = getDb()
    const posts = await sql`SELECT slug, created_at FROM blog_posts ORDER BY created_at DESC`
    blogEntries = posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
  } catch {
    // DB unavailable
  }

  return [...staticPages, ...blogEntries]
}
