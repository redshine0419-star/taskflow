export async function POST(request) {
  const { webhookUrl, text } = await request.json()
  if (!webhookUrl || !text) return Response.json({ error: 'Missing params' }, { status: 400 })
  if (!webhookUrl.startsWith('https://hooks.slack.com/')) {
    return Response.json({ error: 'Invalid webhook URL' }, { status: 400 })
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) return Response.json({ error: 'Slack error' }, { status: res.status })
  return Response.json({ ok: true })
}
