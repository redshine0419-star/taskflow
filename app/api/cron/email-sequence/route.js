export const dynamic = 'force-dynamic'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@taskgrid.my'

const SEQUENCE = [
  {
    dayOffset: 3,
    subject: '[TaskGrid] 핵심 기능 안내 피에스',
    html: `<h2>TaskGrid 사용해보세요!</h2>
<ul>
  <li>구글 쫬음으로 로그인 시 내 Google Drive에 스프레드시트 자동 생성</li>
  <li>칸반 보드에서 태스크 드래그 & 드롭으로 상태 변경</li>
  <li>여러 프로젝트를 탭으로 관리</li>
</ul>
<p><a href="https://www.taskgrid.my" style="background:#6366f1;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">→ TaskGrid 시작하기</a></p>`,
  },
  {
    dayOffset: 7,
    subject: '[TaskGrid] 1인 기업이 가장 많이 쓰는 기능',
    html: `<h2>1인 기업 아이템홈 활용법</h2>
<p>주주수 독자님들이 가장 많이 스크맰샷하는 TaskGrid 활용법 안내해드릴게요.</p>
<p><a href="https://www.taskgrid.my/blog">생산성 팁 블로그 보기 →</a></p>`,
  },
  {
    dayOffset: 14,
    subject: '[TaskGrid] Notion 대신 TaskGrid? 비교해보세요',
    html: `<h2>Notion vs TaskGrid 바로는 비교</h2>
<p>Notion은 정보 토스, TaskGrid는 실저 실행 중심. 둘의 차이를 확인해보세요.</p>
<p><a href="https://www.taskgrid.my" style="background:#6366f1;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">→ 다시 TaskGrid에서 시작하기</a></p>`,
  },
]

async function sendEmail(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  }).catch(() => {})
}

export async function GET(req) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { getDb } = await import('../../../../lib/db.js')
  const sql = getDb()
  await sql`CREATE TABLE IF NOT EXISTS email_subscribers (
    id SERIAL PRIMARY KEY, email TEXT NOT NULL,
    service TEXT NOT NULL DEFAULT 'taskgrid', source TEXT NOT NULL DEFAULT 'landing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (email, service)
  )`.catch(() => {})

  const now = new Date()
  let sent = 0

  for (const step of SEQUENCE) {
    const windowStart = new Date(now.getTime() - (step.dayOffset + 0.5) * 86400000)
    const windowEnd = new Date(now.getTime() - (step.dayOffset - 0.5) * 86400000)
    const rows = await sql`
      SELECT email FROM email_subscribers
      WHERE service = 'taskgrid' AND created_at BETWEEN ${windowStart.toISOString()} AND ${windowEnd.toISOString()}
    `
    for (const row of rows) {
      await sendEmail(row.email, step.subject, step.html)
      sent++
    }
  }

  return Response.json({ sent })
}
