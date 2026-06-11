import { NextResponse } from 'next/server'
import { initFeedbackTable, getFeedback, insertFeedback, countRecentFeedbackByIp, hideFeedback } from '../../../lib/db.js'

export const dynamic = 'force-dynamic'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 3

function hashIp(ip) {
  let h = 0
  for (let i = 0; i < ip.length; i++) h = (Math.imul(31, h) + ip.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}

function getIp(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? '0'
}

function parseCaptcha(q) {
  const m = String(q).match(/(\d+)\s*([+\-])\s*(\d+)/)
  if (!m) return { a: 0, op: '+', b: 0 }
  return { a: Number(m[1]), op: m[2], b: Number(m[3]) }
}

export async function GET(req) {
  try {
    await initFeedbackTable()
    const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? '1'))
    const result = await getFeedback({ page })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ rows: [], total: 0, page: 1, pageSize: 20 })
  }
}

export async function POST(req) {
  try {
    await initFeedbackTable()
    let body
    try { body = await req.json() } catch { return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 }) }

    const { nickname, content, rating, captchaAnswer, captchaQuestion, honeypot } = body

    if (honeypot) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })

    const cleanContent = String(content ?? '').trim()
    if (!cleanContent || cleanContent.length < 5)
      return NextResponse.json({ error: '5자 이상 입력해주세요.' }, { status: 400 })
    if (cleanContent.length > 1000)
      return NextResponse.json({ error: '최대 1000자까지 가능합니다.' }, { status: 400 })

    const { a, op, b } = parseCaptcha(captchaQuestion ?? '')
    const expected = op === '+' ? a + b : a - b
    if (Number(captchaAnswer) !== expected)
      return NextResponse.json({ error: '자동 입력 방지 답이 틀렸습니다.' }, { status: 400 })

    const ip = getIp(req)
    const ipHash = hashIp(ip)
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)
    const recentCount = await countRecentFeedbackByIp(ipHash, since)
    if (recentCount >= RATE_LIMIT_MAX)
      return NextResponse.json({ error: '잠시 후 다시 시도해주세요. (10분에 3개 제한)' }, { status: 429 })

    const row = await insertFeedback({
      nickname: String(nickname ?? '').trim().slice(0, 30) || '익명',
      content: cleanContent,
      rating: rating ? Math.min(5, Math.max(1, Number(rating))) : null,
      ipHash,
    })
    return NextResponse.json({ ok: true, row })
  } catch {
    return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req) {
  const auth = req.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await initFeedbackTable()
  await hideFeedback(Number(id))
  return NextResponse.json({ ok: true })
}
