export const dynamic = 'force-dynamic'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@taskgrid.my'

async function sendWelcomeEmail(email) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: '[TaskGrid] 구글 시트 프로젝트 템플릿을 받아보세요 📊',
      html: `
        <h2>TaskGrid에 오신 것을 환영합니다!</h2>
        <p>구글 시트 기반의 뉔리운 칸반 도구를 무료로 사용해도두세요.</p>
        <p><a href="https://www.taskgrid.my" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">→ TaskGrid 무료로 시작하기</a></p>
        <hr/>
        <p style="color:#6b7280;font-size:12px;">생산성 팁 블로그: <a href="https://www.taskgrid.my/blog">https://www.taskgrid.my/blog</a></p>
      `,
    }),
  }).catch(() => {})
}

export async function POST(req) {
  try {
    const { email, source } = await req.json()
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return Response.json({ error: '유효하지 않은 이메일' }, { status: 400 })
    }

    const { getDb } = await import('../../../lib/db.js')
    const sql = getDb()
    await sql`CREATE TABLE IF NOT EXISTS email_subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      service TEXT NOT NULL DEFAULT 'taskgrid',
      source TEXT NOT NULL DEFAULT 'landing',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (email, service)
    )`
    await sql`
      INSERT INTO email_subscribers (email, service, source)
      VALUES (${email}, 'taskgrid', ${source || 'landing'})
      ON CONFLICT (email, service) DO NOTHING
    `

    await sendWelcomeEmail(email)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
