import { initBlogTable, insertBlogPost, getDb } from '../../../lib/db.js'
import { SEED_POSTS, getPostWithImage } from './data.js'
import { SEED_POSTS_2, getPostWithImage2 } from './data2.js'
import { SEED_POSTS_3, getPostWithImage3 } from './data3.js'

const ALL_POSTS = [
  ...SEED_POSTS.map(getPostWithImage),
  ...SEED_POSTS_2.map(getPostWithImage2),
  ...SEED_POSTS_3.map(getPostWithImage3),
]

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'Missing DATABASE_URL' }, { status: 500 })
  }

  await initBlogTable()

  try {
    const sql = getDb()
    await sql`UPDATE blog_posts SET keywords = '' WHERE keywords IS NULL`
    await sql`ALTER TABLE blog_posts ALTER COLUMN keywords SET DEFAULT ''`
  } catch { /* ignore if already correct */ }

  const results = []
  for (const post of ALL_POSTS) {
    try {
      await insertBlogPost(post)
      results.push({ ok: true, slug: post.slug })
    } catch (e) {
      results.push({ ok: false, slug: post.slug, error: e.message })
    }
  }

  const succeeded = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok)

  return Response.json({ ok: true, inserted: succeeded, failed, total: ALL_POSTS.length })
}
