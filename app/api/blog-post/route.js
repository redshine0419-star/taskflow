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

export async function PUT(request) {
  const admin = await verifyAdmin(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { spreadsheetId, slug, updates } = await request.json()
  const auth = request.headers.get('authorization').replace('Bearer ', '')

  const { updateBlogPost } = await import('../../../lib/gapi.js')
  await updateBlogPost(auth, spreadsheetId, slug, updates)
  return Response.json({ ok: true })
}

export async function DELETE(request) {
  const admin = await verifyAdmin(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { spreadsheetId, sheetId, slug } = await request.json()
  const auth = request.headers.get('authorization').replace('Bearer ', '')

  const { deleteBlogPostRow } = await import('../../../lib/gapi.js')
  await deleteBlogPostRow(auth, spreadsheetId, sheetId, slug)
  return Response.json({ ok: true })
}
