const fs = require('fs')
const path = require('path')

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) { console.error('No GEMINI_API_KEY'); process.exit(1) }

  // Read keywords file
  const keywordsFile = fs.readFileSync(path.join(__dirname, '../lib/blog-keywords.js'), 'utf-8')

  // Parse USED_SLUGS and BLOG_KEYWORDS using simple regex/eval approach
  // Extract USED_SLUGS array
  const usedMatch = keywordsFile.match(/export const USED_SLUGS = (\[.*?\])/s)
  const usedSlugs = usedMatch ? JSON.parse(usedMatch[1]) : []

  // Extract BLOG_KEYWORDS array - parse it
  const kwMatch = keywordsFile.match(/export const BLOG_KEYWORDS = (\[[\s\S]*?\n\])/m)
  if (!kwMatch) { console.error('Cannot parse keywords'); process.exit(1) }

  // Safe eval of the array (it's our own file)
  let keywords
  try {
    keywords = eval('(' + kwMatch[1] + ')')
  } catch (e) {
    console.error('Parse error:', e); process.exit(1)
  }

  // Find next unused keyword
  const available = keywords.filter(k => !usedSlugs.includes(k.slug))
  if (available.length === 0) {
    console.log('All keywords used! Resetting...')
    // Reset - start over
    available.push(...keywords)
  }

  // Pick random unused keyword
  const chosen = available[Math.floor(Math.random() * Math.min(available.length, 5))]
  console.log('Generating post for:', chosen.keyword)

  // Call Gemini
  const prompt = `당신은 한국 직장인을 위한 SEO 전문 블로그 작가입니다.

다음 키워드로 실용적인 블로그 포스트를 작성해주세요.

키워드: "${chosen.keyword}"
카테고리: ${chosen.category}

작성 요구사항:
1. 제목: 키워드가 자연스럽게 포함된 SEO 최적화 제목 (45자 이내)
2. 요약: 핵심 내용 요약 (100자 이내)
3. 본문: 600-800자의 실용적인 내용 (HTML 형식)
   - <h2> 태그로 2-3개 섹션 나누기
   - <blockquote> 태그로 핵심 팁 1-2개 포함
   - <ul><li> 로 실용적인 목록 포함
   - 실제 사용법, 작성 요령, 주의사항 등 구체적 정보
   - 마지막 섹션에서 TaskFlow 자연스럽게 언급
4. 다운로드 버튼 레이블: 10자 이내
5. 다운로드 안내: 20자 이내

반드시 아래 JSON 형식만 출력하세요 (다른 텍스트 없이):
{
  "title": "...",
  "excerpt": "...",
  "content": "...",
  "tags": ["태그1", "태그2", "태그3", "태그4"],
  "downloadLabel": "...",
  "downloadNote": "...",
  "readTime": 3
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
      })
    }
  )

  if (!res.ok) { console.error('Gemini error', res.status); process.exit(1) }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || ''
  const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()
  const start = stripped.indexOf('{'), end = stripped.lastIndexOf('}')
  if (start === -1) { console.error('No JSON in response:', text.slice(0, 200)); process.exit(1) }

  let post
  try {
    post = JSON.parse(stripped.slice(start, end + 1))
  } catch (e) {
    console.error('JSON parse error:', e.message); process.exit(1)
  }

  // Read and update blog-posts.js
  const postsFile = fs.readFileSync(path.join(__dirname, '../lib/blog-posts.js'), 'utf-8')

  const today = new Date().toISOString().split('T')[0]
  const newEntry = `  {
    slug: '${chosen.slug}',
    title: '${post.title.replace(/'/g, "\\'")}',
    category: '${chosen.category}',
    tags: ${JSON.stringify(post.tags || [])},
    excerpt: '${(post.excerpt || '').replace(/'/g, "\\'")}',
    publishedAt: '${today}',
    readTime: ${post.readTime || 3},
    downloadLabel: '${(post.downloadLabel || '무료 다운로드').replace(/'/g, "\\'")}',
    downloadNote: '${(post.downloadNote || '').replace(/'/g, "\\'")}',
    content: \`${(post.content || '').replace(/`/g, '\\`')}\`,
  },`

  const updatedPosts = postsFile.replace(/\]\s*$/, `\n${newEntry}\n]`)
  fs.writeFileSync(path.join(__dirname, '../lib/blog-posts.js'), updatedPosts)

  // Update USED_SLUGS in blog-keywords.js
  const newUsed = [...usedSlugs, chosen.slug]
  const updatedKeywords = keywordsFile.replace(
    /export const USED_SLUGS = \[.*?\]/s,
    `export const USED_SLUGS = ${JSON.stringify(newUsed)}`
  )
  fs.writeFileSync(path.join(__dirname, '../lib/blog-keywords.js'), updatedKeywords)

  console.log('✓ Post generated:', post.title)
  console.log('✓ Slug:', chosen.slug)
}

main().catch(e => { console.error(e); process.exit(1) })
