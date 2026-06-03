import { getAllKeywords, insertKeyword, deleteKeyword, initKeywordsTable } from '../../../lib/db.js'

const ADMIN_EMAIL = 'redshine0419@gmail.com'

async function verifyAdmin(request) {
  const auth = request.headers.get('authorization')
  if (!auth) return null
  const token = auth.replace('Bearer ', '')
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return null
  const profile = await res.json()
  return profile.email === ADMIN_EMAIL ? profile : null
}

export async function GET(request) {
  const admin = await verifyAdmin(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  await initKeywordsTable()
  const keywords = await getAllKeywords()
  return Response.json(keywords)
}

export async function POST(request) {
  const admin = await verifyAdmin(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { keyword, category, lang } = await request.json()
  await initKeywordsTable()
  await insertKeyword(keyword, category, lang)
  return Response.json({ ok: true })
}

export async function DELETE(request) {
  const admin = await verifyAdmin(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await deleteKeyword(id)
  return Response.json({ ok: true })
}
