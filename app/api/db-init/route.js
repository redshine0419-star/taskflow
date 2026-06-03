import { initBlogTable, initKeywordsTable } from '../../../lib/db.js'

export async function GET() {
  try {
    await initBlogTable()
    await initKeywordsTable()
    return new Response(JSON.stringify({ ok: true, message: 'tables ready: blog_posts, blog_keywords' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
