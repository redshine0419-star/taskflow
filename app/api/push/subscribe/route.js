export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { subscription, userId } = await req.json()
    if (!subscription?.endpoint) {
      return Response.json({ error: 'Invalid subscription' }, { status: 400 })
    }
    const { getDb } = await import('../../../../lib/db.js')
    const sql = getDb()
    await sql`CREATE TABLE IF NOT EXISTS push_subscriptions (
      id SERIAL PRIMARY KEY, user_id TEXT, endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL, auth TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`.catch(() => {})
    await sql`
      INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
      VALUES (${userId || null}, ${subscription.endpoint}, ${subscription.keys?.p256dh || ''}, ${subscription.keys?.auth || ''})
      ON CONFLICT (endpoint) DO UPDATE SET user_id = EXCLUDED.user_id
    `
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
