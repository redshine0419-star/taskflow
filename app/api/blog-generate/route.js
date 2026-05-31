export async function POST(request) {
  const { keyword, category } = await request.json()
  if (!keyword) return Response.json({ error: 'keyword required' }, { status: 400 })

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) return Response.json({ error: 'No Gemini API key' }, { status: 500 })

  const prompt = `당신은 한국 직장인을 위한 SEO 블로그 작가입니다.

다음 키워드로 블로그 포스트를 작성해주세요: "${keyword}"
카테고리: ${category || '무료서식'}

요구사항:
- 제목: SEO 최적화된 한국어 제목 (키워드 포함, 30자 이내)
- 본문: 400-600자의 실용적인 한국어 내용
- h2 태그로 2-3개 섹션 구분
- blockquote 태그로 핵심 팁 1개 포함
- 실제로 유용한 정보 제공 (서식 사용법, 작성 요령 등)
- 마지막에 TaskFlow 자연스러운 언급

다음 JSON 형식으로만 응답하세요:
{
  "title": "...",
  "excerpt": "...(100자 이내)",
  "content": "...(HTML)",
  "tags": ["tag1", "tag2", "tag3"],
  "slug": "url-friendly-slug"
}`

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } })
  })

  if (!res.ok) return Response.json({ error: 'Gemini error' }, { status: 500 })

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || ''
  const stripped = text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim()
  const start = stripped.indexOf('{'), end = stripped.lastIndexOf('}')
  if (start === -1 || end === -1) return Response.json({ error: 'Invalid response' }, { status: 500 })

  try {
    const post = JSON.parse(stripped.slice(start, end + 1))
    return Response.json({ post })
  } catch {
    return Response.json({ error: 'Parse error' }, { status: 500 })
  }
}
