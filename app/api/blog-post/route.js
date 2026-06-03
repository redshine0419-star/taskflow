import { updateBlogPost, deleteBlogPost } from '../../../lib/db.js'

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

  const { slug, updates } = await request.json()
  await updateBlogPost(slug, updates)
  return Response.json({ ok: true })
}

export async function DELETE(request) {
  const admin = await verifyAdmin(request)
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await request.json()
  await deleteBlogPost(slug)
  return Response.json({ ok: true })
}
