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

  const { searchParams } = new URL(request.url)
  const spreadsheetId = searchParams.get('spreadsheetId')
  const auth = request.headers.get('authorization').replace('Bearer ', '')

  const { loadBlogKeywords, ensureBlogKeywordsSheet } = await import('../../../lib/gapi.js')
  await ensureBlogKeywordsSheet(auth, spreadsheetId)
  const keywords = await loadBlogKeywords(auth, spreadsheetId)
  return Response.json(keywords)
}

export async function POST(request) {
  const admin = await verifyAdmin(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { spreadsheetId, keyword, category, lang } = await request.json()
  const auth = request.headers.get('authorization').replace('Bearer ', '')

  const { appendBlogKeyword } = await import('../../../lib/gapi.js')
  await appendBlogKeyword(auth, spreadsheetId, { keyword, category, lang })
  return Response.json({ ok: true })
}

export async function DELETE(request) {
  const admin = await verifyAdmin(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { spreadsheetId, sheetId, rowIndex } = await request.json()
  const auth = request.headers.get('authorization').replace('Bearer ', '')

  const { deleteBlogKeywordRow } = await import('../../../lib/gapi.js')
  await deleteBlogKeywordRow(auth, spreadsheetId, sheetId, rowIndex)
  return Response.json({ ok: true })
}
