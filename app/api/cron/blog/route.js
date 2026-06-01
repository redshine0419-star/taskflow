import { BLOG_KEYWORDS } from '../../../../lib/blog-keywords'

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function GET(request) {
  // Vercel Cron auth header check
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) return new Response('Missing GEMINI API key', { status: 500 })

  const sheetsToken = process.env.GOOGLE_SHEETS_SERVICE_TOKEN
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  if (!sheetsToken || !spreadsheetId) {
    return new Response('Missing Google Sheets config', { status: 500 })
  }

  // Load already-used keywords
  let usedKeywords = []
  try {
    const { loadUsedBlogKeywords } = await import('../../../../lib/gapi.js')
    usedKeywords = await loadUsedBlogKeywords(sheetsToken, spreadsheetId)
  } catch (e) {
    console.error('Failed to load used keywords:', e)
  }

  // Pick next unused keyword
  const unused = BLOG_KEYWORDS.filter(k => !usedKeywords.includes(k.keyword))
  const pool = unused.length > 0 ? unused : BLOG_KEYWORDS
  const picked = pool[Math.floor(Math.random() * pool.length)]

  // Generate post via Gemini
  const prompt = buildBlogPrompt(picked)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 120000)
  let postData
  try {
    const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return new Response(`Gemini error: ${err.error?.message || res.status}`, { status: 500 })
    }
    const data = await res.json()
    const parts = data.candidates?.[0]?.content?.parts || []
    const text = parts.map(p => p.text || '').join('\n').trim()
    const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()
    const start = stripped.indexOf('{')
    const end = stripped.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON object in response')
    postData = JSON.parse(stripped.slice(start, end + 1))
  } catch (e) {
    clearTimeout(timer)
    return new Response(`Generation failed: ${e.message}`, { status: 500 })
  }

  // Save to Google Sheets
  try {
    const { appendBlogPost, ensureBlogPostsSheet } = await import('../../../../lib/gapi.js')
    await ensureBlogPostsSheet(sheetsToken, spreadsheetId)
    const today = new Date().toISOString().split('T')[0]
    await appendBlogPost(sheetsToken, spreadsheetId, {
      slug: postData.slug || picked.keyword.replace(/\s+/g, '-'),
      title: postData.title || picked.keyword,
      date: today,
      category: postData.category || picked.category,
      desc: postData.desc || '',
      keywords: (postData.keywords || []).join(', '),
      content: postData.content || '',
      usedKeyword: picked.keyword,
    })
  } catch (e) {
    return new Response(`Sheets save failed: ${e.message}`, { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true, keyword: picked.keyword }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

function buildBlogPrompt(keyword) {
  return `당신은 한국 직장인을 위한 SEO 블로그 작가입니다.
다음 키워드로 블로그 포스트를 작성하세요: "${keyword.keyword}"
카테고리: ${keyword.category}

반드시 다음 JSON 형식으로만 응답하세요 (마크다운 없이):
{
  "slug": "url-friendly-slug",
  "title": "SEO 최적화된 제목 (50자 이내)",
  "category": "${keyword.category}",
  "desc": "메타 설명 (150자 이내)",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "content": "<h2>소제목</h2><p>내용...</p> (완전한 HTML, 최소 800자)"
}

규칙:
- content는 완전한 HTML (h2, p, ul, li, blockquote 사용)
- 실용적인 정보와 무료 다운로드/템플릿 언급 포함
- 자연스러운 한국어로 작성
- JSON만 응답, 다른 텍스트 없음`
}
