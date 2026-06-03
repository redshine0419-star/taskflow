import { getDb, insertBlogPost, initBlogTable } from '../../../lib/db.js'
import { getBlogImage } from '../../../lib/blog-images.js'

// 37 unique dates: Apr 1 ~ May 29, 2026 (no duplicates, natural spacing)
const DATES = [
  '2026-04-01','2026-04-02','2026-04-04','2026-04-05','2026-04-07',
  '2026-04-08','2026-04-10','2026-04-11','2026-04-13','2026-04-15',
  '2026-04-16','2026-04-18','2026-04-19','2026-04-21','2026-04-22',
  '2026-04-24','2026-04-26','2026-04-27','2026-04-29','2026-04-30',
  '2026-05-02','2026-05-03','2026-05-05','2026-05-07','2026-05-08',
  '2026-05-10','2026-05-12','2026-05-13','2026-05-15','2026-05-17',
  '2026-05-18','2026-05-20','2026-05-22','2026-05-23','2026-05-25',
  '2026-05-27','2026-05-29',
]

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function buildPrompt(keyword, category, lang) {
  if (lang === 'en') {
    return `You are an expert SEO blog writer specializing in project management and productivity tools.

Write a comprehensive blog post for the keyword: "${keyword}"
Category: ${category}

Requirements:
- Target audience: small teams and startups looking for free tools
- Tone: practical, helpful, direct — no fluff
- All claims must be factual and verifiable — no invented statistics or fake studies
- Do NOT mention any author, writer, or "we tested" personal claims
- Do NOT mention downloadable files or templates
- SEO-optimized: include the main keyword naturally in h1 context, first paragraph, and subheadings
- Minimum 1000 characters of HTML content

Respond ONLY with this JSON (no markdown fences):
{
  "slug": "url-friendly-slug-max-60-chars",
  "title": "SEO title under 60 characters",
  "category": "${category}",
  "desc": "Meta description 120-155 characters with main keyword",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "content": "<h2>...</h2><p>...</p>... (full HTML using h2, h3, p, ul, li, strong, blockquote)"
}`
  }

  return `당신은 프로젝트 관리와 생산성 툴 전문 SEO 블로그 작가입니다.

키워드: "${keyword}"
카테고리: ${category}

작성 조건:
- 대상 독자: 무료 협업툴을 찾는 스타트업 및 소규모 팀
- 톤: 실용적이고 직접적 — 불필요한 미사여구 없음
- 모든 내용은 사실에 근거해야 함 — 출처 없는 통계나 허위 사례 금지
- 작성자, 필자, "저희가 테스트" 등 작성자 언급 금지
- 다운로드 파일이나 첨부 양식 언급 금지
- SEO 최적화: 메인 키워드를 제목, 첫 문단, 소제목에 자연스럽게 포함
- HTML 콘텐츠 최소 1000자

다음 JSON 형식으로만 응답 (마크다운 코드블록 없이):
{
  "slug": "url-friendly-slug-최대-60자",
  "title": "SEO 제목 50자 이내",
  "category": "${category}",
  "desc": "메타 설명 120-155자, 메인 키워드 포함",
  "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "content": "<h2>...</h2><p>...</p>... (h2, h3, p, ul, li, strong, blockquote 사용한 완전한 HTML)"
}`
}

async function generatePost(keyword, category, lang, date) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  const prompt = buildPrompt(keyword, category, lang)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 55000)

  try {
    const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 4096 },
      }),
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(`Gemini ${res.status}: ${err.error?.message || 'unknown'}`)
    }

    const data = await res.json()
    const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim()
    const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()
    const start = stripped.indexOf('{')
    const end = stripped.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON in response')
    const post = JSON.parse(stripped.slice(start, end + 1))

    await insertBlogPost({
      slug: post.slug,
      title: post.title,
      date,
      category: post.category || category,
      desc: post.desc || '',
      keywords: Array.isArray(post.keywords) ? post.keywords.join(', ') : '',
      content: post.content || '',
      usedKeyword: keyword,
      lang,
      imageUrl: getBlogImage(post.category || category),
    })

    return { ok: true, slug: post.slug, keyword }
  } catch (e) {
    clearTimeout(timer)
    return { ok: false, keyword, error: e.message }
  }
}

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'Missing GEMINI API key' }, { status: 500 })
  if (!process.env.DATABASE_URL) return Response.json({ error: 'Missing DATABASE_URL' }, { status: 500 })

  await initBlogTable()
  const sql = getDb()

  // Count already-generated posts to determine date offset
  const countRows = await sql`SELECT COUNT(*) as cnt FROM blog_posts`
  const alreadyGenerated = parseInt(countRows[0].cnt, 10)

  if (alreadyGenerated >= DATES.length) {
    return Response.json({ ok: true, message: 'All posts already generated', total: alreadyGenerated })
  }

  // Get unused keywords ordered by id (stable order)
  const keywords = await sql`
    SELECT bk.* FROM blog_keywords bk
    WHERE NOT EXISTS (
      SELECT 1 FROM blog_posts bp WHERE bp.used_keyword = bk.keyword
    )
    ORDER BY bk.id
    LIMIT 2
  `

  if (keywords.length === 0) {
    return Response.json({ ok: true, message: 'No more keywords to process', total: alreadyGenerated })
  }

  const results = await Promise.all(
    keywords.map((kw, i) => {
      const dateIndex = alreadyGenerated + i
      const date = DATES[dateIndex] || DATES[DATES.length - 1]
      return generatePost(kw.keyword, kw.category, kw.lang, date)
    })
  )

  const countAfter = await sql`SELECT COUNT(*) as cnt FROM blog_posts`
  const total = parseInt(countAfter[0].cnt, 10)

  return Response.json({
    ok: true,
    processed: results,
    totalPosts: total,
    remaining: DATES.length - total,
  })
}
