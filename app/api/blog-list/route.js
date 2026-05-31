import { BLOG_POSTS } from '@/lib/blog-posts'

export const revalidate = 3600

export async function GET() {
  const token = process.env.GOOGLE_SHEETS_SERVICE_TOKEN
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID

  if (token && spreadsheetId) {
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/BlogPosts!A2:H1000`,
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
      })).filter(p => p.slug && p.title)
      if (posts.length > 0) {
        return Response.json(posts)
      }
    } catch (e) {
      console.error('Sheets blog fetch failed:', e)
    }
  }

  // Fallback to static posts
  return Response.json(BLOG_POSTS)
}
