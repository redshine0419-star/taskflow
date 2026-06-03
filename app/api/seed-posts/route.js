import { initBlogTable, insertBlogPost } from '../../../lib/db.js'
import { SEED_POSTS, getPostWithImage } from './data.js'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'Missing DATABASE_URL' }, { status: 500 })
  }

  await initBlogTable()

  const results = []
  for (const post of SEED_POSTS) {
    try {
      await insertBlogPost(getPostWithImage(post))
      results.push({ ok: true, slug: post.slug })
    } catch (e) {
      results.push({ ok: false, slug: post.slug, error: e.message })
    }
  }

  const succeeded = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok)

  return Response.json({ ok: true, inserted: succeeded, failed, total: SEED_POSTS.length })
}
