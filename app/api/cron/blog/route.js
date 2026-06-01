import { BLOG_KEYWORDS } from '../../../../lib/blog-keywords'
import { getBlogImage } from '../../../../lib/blog-images'

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
    const { loadUsedBlogKeywords, ensureBlogPostsSheet } = await import('../../../../lib/gapi.js')
    await ensureBlogPostsSheet(sheetsToken, spreadsheetId)
    usedKeywords = await loadUsedBlogKeywords(sheetsToken, spreadsheetId)
  } catch (e) {
    console.error('Failed to load used keywords:', e)
  }

  // Pick one unused KO keyword and one unused EN keyword
  const unusedKo = BLOG_KEYWORDS.filter(k => k.lang === 'ko' && !usedKeywords.includes(k.keyword))
  const unusedEn = BLOG_KEYWORDS.filter(k => k.lang === 'en' && !usedKeywords.includes(k.keyword))

  const poolKo = unusedKo.length > 0 ? unusedKo : BLOG_KEYWORDS.filter(k => k.lang === 'ko')
  const poolEn = unusedEn.length > 0 ? unusedEn : BLOG_KEYWORDS.filter(k => k.lang === 'en')

  const pickedKo = poolKo[Math.floor(Math.random() * poolKo.length)]
  const pickedEn = poolEn[Math.floor(Math.random() * poolEn.length)]

  const results = []

  // Generate both posts in parallel
  const generatePost = async (picked) => {
    const prompt = buildBlogPrompt(picked)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 120000)
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
        throw new Error(`Gemini error: ${err.error?.message || res.status}`)
      }
      const data = await res.json()
      const parts = data.candidates?.[0]?.content?.parts || []
      const text = parts.map(p => p.text || '').join('\n').trim()
      const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()
      const start = stripped.indexOf('{')
      const end = stripped.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('No JSON object in response')
      const postData = JSON.parse(stripped.slice(start, end + 1))

      // Save to Google Sheets
      const { appendBlogPost } = await import('../../../../lib/gapi.js')
      const today = new Date().toISOString().split('T')[0]
      const category = postData.category || picked.category
      await appendBlogPost(sheetsToken, spreadsheetId, {
        slug: postData.slug || picked.keyword.replace(/\s+/g, '-'),
        title: postData.title || picked.keyword,
        date: today,
        category,
        desc: postData.desc || '',
        keywords: (postData.keywords || []).join(', '),
        content: postData.content || '',
        usedKeyword: picked.keyword,
        lang: picked.lang || 'ko',
        imageUrl: getBlogImage(category),
      })
      return { ok: true, keyword: picked.keyword, lang: picked.lang }
    } catch (e) {
      clearTimeout(timer)
      console.error(`Failed to generate post for "${picked.keyword}":`, e)
      return { ok: false, keyword: picked.keyword, lang: picked.lang, error: e.message }
    }
  }

  const [koResult, enResult] = await Promise.all([
    generatePost(pickedKo),
    generatePost(pickedEn),
  ])

  results.push(koResult, enResult)

  return new Response(JSON.stringify({ ok: true, results }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

function buildBlogPrompt(picked) {
  if (picked.lang === 'en') {
    return `You are an SEO blog writer for productivity and office tools.
Write a blog post for the keyword: "${picked.keyword}"
Category: ${picked.category}

Respond ONLY with the following JSON format (no markdown):
{
  "slug": "url-friendly-slug",
  "title": "SEO-optimized title (under 60 characters)",
  "category": "${picked.category}",
  "desc": "Meta description (under 160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "content": "<h2>Subheading</h2><p>Content...</p> (complete HTML, minimum 800 characters)"
}

Rules:
- content must be complete HTML (use h2, p, ul, li, blockquote)
- Include practical information about free tools, templates, and productivity tips
- Write in natural English
- Respond with JSON only, no other text`
  }

  return `당신은 한국 직장인을 위한 SEO 블로그 작가입니다.
다음 키워드로 블로그 포스트를 작성하세요: "${picked.keyword}"
카테고리: ${picked.category}

반드시 다음 JSON 형식으로만 응답하세요 (마크다운 없이):
{
  "slug": "url-friendly-slug",
  "title": "SEO 최적화된 제목 (50자 이내)",
  "category": "${picked.category}",
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
