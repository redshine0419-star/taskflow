import { BLOG_KEYWORDS } from '../../../../lib/blog-keywords'
import { getBlogImage } from '../../../../lib/blog-images'
import { initBlogTable, insertBlogPost, getUsedKeywords } from '../../../../lib/db.js'

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing GEMINI API key' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!process.env.DATABASE_URL) {
    return new Response(JSON.stringify({ error: 'Missing DATABASE_URL' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  // Ensure table exists
  try {
    await initBlogTable()
  } catch (e) {
    console.error('[cron/blog] initBlogTable failed:', e)
    return new Response(JSON.stringify({ error: 'DB init failed', detail: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  // Load already-used keywords
  let usedKeywords = []
  try {
    usedKeywords = await getUsedKeywords()
    console.log('[cron/blog] usedKeywords count:', usedKeywords.length)
  } catch (e) {
    console.error('[cron/blog] getUsedKeywords failed:', e)
  }

  // Pick one unused KO keyword and one unused EN keyword
  const unusedKo = BLOG_KEYWORDS.filter(k => k.lang === 'ko' && !usedKeywords.includes(k.keyword))
  const unusedEn = BLOG_KEYWORDS.filter(k => k.lang === 'en' && !usedKeywords.includes(k.keyword))

  const poolKo = unusedKo.length > 0 ? unusedKo : BLOG_KEYWORDS.filter(k => k.lang === 'ko')
  const poolEn = unusedEn.length > 0 ? unusedEn : BLOG_KEYWORDS.filter(k => k.lang === 'en')

  const pickedKo = poolKo[Math.floor(Math.random() * poolKo.length)]
  const pickedEn = poolEn[Math.floor(Math.random() * poolEn.length)]
  console.log('[cron/blog] picked KO:', pickedKo?.keyword, '| EN:', pickedEn?.keyword)

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

      const today = new Date().toISOString().split('T')[0]
      const category = postData.category || picked.category
      await insertBlogPost({
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
      console.log(`[cron/blog] saved: "${postData.slug}" (${picked.lang})`)
      return { ok: true, keyword: picked.keyword, lang: picked.lang, slug: postData.slug }
    } catch (e) {
      clearTimeout(timer)
      console.error(`[cron/blog] failed for "${picked.keyword}":`, e.message)
      return { ok: false, keyword: picked.keyword, lang: picked.lang, error: e.message }
    }
  }

  const [koResult, enResult] = await Promise.all([
    generatePost(pickedKo),
    generatePost(pickedEn),
  ])

  return new Response(JSON.stringify({ ok: true, results: [koResult, enResult] }), {
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
