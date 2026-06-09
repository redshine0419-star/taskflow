import { revalidatePath } from 'next/cache'
import { BLOG_KEYWORDS } from '../../../../lib/blog-keywords'
import { getBlogImage } from '../../../../lib/blog-images'
import {
  initBlogTable, insertBlogPost, getUsedKeywords,
  pickClusterBalancedKeyword, markKeywordUsed, getRecentPostsForLinking,
} from '../../../../lib/db.js'
import { postTweet, buildTweetText } from '../../../../lib/twitter.js'

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const CTA_KO = '<hr><div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:12px;padding:24px;margin:32px 0;text-align:center;"><p style="font-size:18px;font-weight:700;color:#1e40af;margin:0 0 8px">📋 TaskGrid — 무료 칸반 보드</p><p style="color:#374151;margin:0 0 16px">Google Sheets 기반으로 별도 설치 없이 바로 사용하는 프로젝트 관리</p><a href="https://www.taskgrid.my" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">무료로 시작하기 →</a></div>'
const CTA_EN = '<hr><div style="background:#eff6ff;border:2px solid #3b82f6;border-radius:12px;padding:24px;margin:32px 0;text-align:center;"><p style="font-size:18px;font-weight:700;color:#1e40af;margin:0 0 8px">📋 TaskGrid — Free Kanban Board</p><p style="color:#374151;margin:0 0 16px">Google Sheets-based project management — no installation needed</p><a href="https://www.taskgrid.my" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Start for Free →</a></div>'

async function notifySlack(message) {
  if (!process.env.SLACK_WEBHOOK_URL) return
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  }).catch(() => {})
}

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

  try { await initBlogTable() } catch (e) {
    return new Response(JSON.stringify({ error: 'DB init failed', detail: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  // Cluster-balanced keyword selection from DB, fall back to static file
  let pickedKo = null
  let pickedEn = null

  try {
    pickedKo = await pickClusterBalancedKeyword('ko')
    pickedEn = await pickClusterBalancedKeyword('en')
  } catch (e) {
    console.error('[cron/blog] DB keyword selection failed, falling back to static:', e.message)
  }

  if (!pickedKo) {
    const used = await getUsedKeywords().catch(() => [])
    const pool = BLOG_KEYWORDS.filter(k => k.lang === 'ko' && !used.includes(k.keyword))
    const fallback = pool.length > 0 ? pool : BLOG_KEYWORDS.filter(k => k.lang === 'ko')
    pickedKo = fallback[Math.floor(Math.random() * fallback.length)]
  }
  if (!pickedEn) {
    const used = await getUsedKeywords().catch(() => [])
    const pool = BLOG_KEYWORDS.filter(k => k.lang === 'en' && !used.includes(k.keyword))
    const fallback = pool.length > 0 ? pool : BLOG_KEYWORDS.filter(k => k.lang === 'en')
    pickedEn = fallback[Math.floor(Math.random() * fallback.length)]
  }

  console.log('[cron/blog] KO:', pickedKo?.keyword, `(${pickedKo?.cluster})`, '| EN:', pickedEn?.keyword, `(${pickedEn?.cluster})`)

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
      const slug = postData.slug || picked.keyword.replace(/\s+/g, '-')

      // Build related posts section
      let relatedHtml = ''
      try {
        const related = await getRecentPostsForLinking(picked.lang, slug, 3)
        if (related.length > 0) {
          const links = related.map(p => `<li><a href="/blog/${p.slug}">${p.title}</a></li>`).join('')
          const heading = picked.lang === 'en' ? 'Related Articles' : '관련 글'
          relatedHtml = `<hr><div class="related-posts"><h3>${heading}</h3><ul>${links}</ul></div>`
        }
      } catch { /* ignore */ }

      const cta = picked.lang === 'en' ? CTA_EN : CTA_KO
      const finalContent = postData.content + cta + relatedHtml

      await insertBlogPost({
        slug,
        title: postData.title || picked.keyword,
        date: today,
        category,
        desc: postData.desc || '',
        keywords: (postData.keywords || []).join(', '),
        content: finalContent,
        usedKeyword: picked.keyword,
        lang: picked.lang || 'ko',
        imageUrl: getBlogImage(category),
      })

      if (picked.id) await markKeywordUsed(picked.id).catch(() => {})

      await notifySlack(`📝 [TaskGrid] 새 블로그 발행\n제목: ${postData.title}\n언어: ${picked.lang} | 클러스터: ${picked.cluster || '-'}\nURL: https://www.taskgrid.my/blog/${slug}`)

      if (picked.lang === 'ko') {
        const tweetText = buildTweetText(postData.title, postData.desc || '', `https://www.taskgrid.my/blog/${slug}`, '#생산성 #프로젝트관리 #구글시트')
        await postTweet(tweetText)
      }

      return { ok: true, keyword: picked.keyword, lang: picked.lang, slug, cluster: picked.cluster }
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

  revalidatePath('/blog')

  return new Response(JSON.stringify({ ok: true, results: [koResult, enResult] }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

function buildBlogPrompt(picked) {
  if (picked.lang === 'en') {
    return `You are an SEO blog writer for productivity and project management tools.
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
- Write practical tips, comparisons, and how-to guides
- Do NOT mention downloadable files, template downloads, or "download for free"
- Do NOT include any download links or file attachment references
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
- 실용적인 팁, 방법론, 도구 비교 위주로 작성
- 파일 다운로드, 양식 다운로드, "무료 다운로드" 언급 절대 금지
- 다운로드 링크나 첨부파일 관련 내용 포함 금지
- 자연스러운 한국어로 작성
- JSON만 응답, 다른 텍스트 없음`
}
