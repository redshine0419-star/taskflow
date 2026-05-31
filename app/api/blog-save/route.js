export async function POST(request) {
  const { token, spreadsheetId, post } = await request.json()
  if (!token || !spreadsheetId || !post) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { appendBlogPost, ensureBlogPostsSheet } = await import('@/lib/gapi')

  try {
    await ensureBlogPostsSheet(token, spreadsheetId)
    await appendBlogPost(token, spreadsheetId, post)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
