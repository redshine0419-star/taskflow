import { getAllBlogPosts } from '../lib/db.js'

const BASE_URL = 'https://www.taskgrid.my'

export default async function sitemap() {
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  try {
    const posts = await getAllBlogPosts()
    const blogRoutes = posts.map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.created_at || post.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
    return [...staticRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
}
