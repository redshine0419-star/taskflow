import { neon } from '@neondatabase/serverless'

let _sql = null

export function getDb() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql
}

export async function initBlogTable() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id           SERIAL PRIMARY KEY,
      slug         TEXT UNIQUE NOT NULL,
      title        TEXT NOT NULL,
      date         TEXT NOT NULL,
      category     TEXT NOT NULL DEFAULT '',
      description  TEXT NOT NULL DEFAULT '',
      keywords     TEXT NOT NULL DEFAULT '',
      content      TEXT NOT NULL DEFAULT '',
      used_keyword TEXT NOT NULL DEFAULT '',
      lang         TEXT NOT NULL DEFAULT 'ko',
      image_url    TEXT NOT NULL DEFAULT '',
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function insertBlogPost(post) {
  const sql = getDb()
  await sql`
    INSERT INTO blog_posts (slug, title, date, category, description, keywords, content, used_keyword, lang, image_url)
    VALUES (${post.slug}, ${post.title}, ${post.date}, ${post.category}, ${post.desc || ''},
            ${post.keywords}, ${post.content}, ${post.usedKeyword || ''}, ${post.lang || 'ko'}, ${post.imageUrl || ''})
    ON CONFLICT (slug) DO NOTHING
  `
}

export async function getAllBlogPosts({ lang } = {}) {
  const sql = getDb()
  if (lang) {
    return sql`SELECT * FROM blog_posts WHERE lang = ${lang} ORDER BY date DESC, created_at DESC`
  }
  return sql`SELECT * FROM blog_posts ORDER BY date DESC, created_at DESC`
}

export async function getBlogPostBySlug(slug) {
  const sql = getDb()
  const rows = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1`
  return rows[0] || null
}

export async function getUsedKeywords() {
  const sql = getDb()
  const rows = await sql`SELECT used_keyword FROM blog_posts WHERE used_keyword != ''`
  return rows.map(r => r.used_keyword)
}

export async function updateBlogPost(slug, fields) {
  const sql = getDb()
  const { title, category, description, keywords, content, image_url } = fields
  await sql`
    UPDATE blog_posts
    SET title = ${title}, category = ${category}, description = ${description},
        keywords = ${keywords}, content = ${content}, image_url = ${image_url}
    WHERE slug = ${slug}
  `
}

export async function deleteBlogPost(slug) {
  const sql = getDb()
  await sql`DELETE FROM blog_posts WHERE slug = ${slug}`
}

// ── Blog Keywords ─────────────────────────────────────────────────────────────

export async function initKeywordsTable() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS blog_keywords (
      id         SERIAL PRIMARY KEY,
      keyword    TEXT NOT NULL,
      category   TEXT NOT NULL DEFAULT '',
      lang       TEXT NOT NULL DEFAULT 'ko',
      used       BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}

export async function getAllKeywords() {
  const sql = getDb()
  return sql`SELECT * FROM blog_keywords ORDER BY lang, category, keyword`
}

export async function insertKeyword(keyword, category, lang) {
  const sql = getDb()
  await sql`
    INSERT INTO blog_keywords (keyword, category, lang)
    VALUES (${keyword}, ${category}, ${lang})
  `
}

export async function deleteKeyword(id) {
  const sql = getDb()
  await sql`DELETE FROM blog_keywords WHERE id = ${id}`
}

export async function getUnusedKeywords() {
  const sql = getDb()
  return sql`SELECT * FROM blog_keywords WHERE used = false ORDER BY lang, category`
}

export async function markKeywordUsed(id) {
  const sql = getDb()
  await sql`UPDATE blog_keywords SET used = true WHERE id = ${id}`
}
