import { initBlogTable, insertBlogPost, getDb } from '../../../lib/db.js'
import { SEED_POSTS, getPostWithImage } from './data.js'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'Missing DATABASE_URL' }, { status: 500 })
  }

  await initBlogTable()

  // Ensure keywords column accepts empty string (fix for pre-existing tables)
  try {
    const sql = getDb()
    await sql`UPDATE blog_posts SET keywords = '' WHERE keywords IS NULL`
    await sql`ALTER TABLE blog_posts ALTER COLUMN keywords SET DEFAULT ''`
  } catch (_) { /* ignore if already correct */ }

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
