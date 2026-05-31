export async function POST(request) {
  const { post, githubToken } = await request.json()

  if (!post || !githubToken) {
    return Response.json({ error: 'Missing post or githubToken' }, { status: 400 })
  }

  const REPO = 'redshine0419-star/taskflow'
  const BRANCH = 'claude/sharp-wozniak-mPQwe'
  const FILE_PATH = 'lib/blog-posts.js'

  // 1. Get current file content + sha
  const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
    headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' }
  })
  if (!getRes.ok) return Response.json({ error: 'Failed to get file' }, { status: 500 })
  const fileData = await getRes.json()
  const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8')

  // 2. Generate new post entry JS string
  const postEntry = `  {
    slug: '${post.slug}',
    title: '${post.title.replace(/'/g, "\\'")}',
    category: '${post.category || '무료서식'}',
    tags: ${JSON.stringify(post.tags || [])},
    excerpt: '${(post.excerpt || '').replace(/'/g, "\\'")}',
    publishedAt: '${new Date().toISOString().split('T')[0]}',
    readTime: ${post.readTime || 3},
    downloadLabel: '${(post.downloadLabel || '무료 다운로드').replace(/'/g, "\\'")}',
    downloadNote: '${(post.downloadNote || '').replace(/'/g, "\\'")}',
    content: \`${post.content || ''}\`,
  },`

  // 3. Append new post before closing ]
  const updatedContent = currentContent.replace(/\]\s*$/, `\n${postEntry}\n]`)

  // 4. Commit via GitHub API
  const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `blog: add post — ${post.title}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: fileData.sha,
      branch: BRANCH,
    })
  })

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}))
    return Response.json({ error: err.message || 'GitHub update failed' }, { status: 500 })
  }

  return Response.json({ ok: true, slug: post.slug })
}
