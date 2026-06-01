import { BLOG_POSTS } from '../../../lib/blog-posts'

export const revalidate = 3600

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') || null // null = all

  const token = process.env.GOOGLE_SHEETS_SERVICE_TOKEN
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID

  if (token && spreadsheetId) {
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/BlogPosts!A2:J1000`,
        { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
      )
      const data = await res.json()
      const rows = data.values || []
      const posts = rows.map(r => ({
        slug: r[0] || '',
        title: r[1] || '',
        date: r[2] || '',
        category: r[3] || '',
        desc: r[4] || '',
        keywords: r[5] ? r[5].split(', ') : [],
        content: r[6] || '',
        usedKeyword: r[7] || '',
        lang: r[8] || 'ko',
        imageUrl: r[9] || '',
      })).filter(p => p.slug && p.title)
      if (posts.length > 0) {
        const filtered = lang ? posts.filter(p => p.lang === lang) : posts
        return Response.json(filtered)
      }
    } catch (e) {
      console.error('Sheets blog fetch failed:', e)
    }
  }

  // Fallback to static posts
  const staticPosts = BLOG_POSTS.map(p => ({ ...p, lang: p.lang || 'ko' }))
  const filtered = lang ? staticPosts.filter(p => p.lang === lang) : staticPosts
  return Response.json(filtered)
}
