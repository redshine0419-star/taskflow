import { initBlogTable, initKeywordsTable, getDb } from '../../../lib/db.js'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'init'}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  try {
    await initBlogTable()
    await initKeywordsTable()

    // Ensure all columns have proper defaults (safe to run repeatedly)
    const sql = getDb()
    await sql`ALTER TABLE blog_posts ALTER COLUMN keywords SET DEFAULT ''`
    await sql`ALTER TABLE blog_posts ALTER COLUMN keywords SET NOT NULL`
    await sql`UPDATE blog_posts SET keywords = '' WHERE keywords IS NULL`

    return new Response(JSON.stringify({ ok: true, message: 'tables ready: blog_posts, blog_keywords' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
