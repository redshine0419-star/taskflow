import { initBlogTable } from '../../../lib/db.js'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'init'}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  try {
    await initBlogTable()
    return new Response(JSON.stringify({ ok: true, message: 'blog_posts table ready' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
