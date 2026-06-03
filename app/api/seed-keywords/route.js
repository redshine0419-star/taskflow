import { initKeywordsTable, getDb } from '../../../lib/db.js'

const KEYWORDS = [
  // EN - alternatives
  { keyword: 'asana alternative free google workspace', category: 'alternatives', lang: 'en' },
  { keyword: 'notion alternative free for teams', category: 'alternatives', lang: 'en' },
  { keyword: 'monday.com alternative free', category: 'alternatives', lang: 'en' },
  { keyword: 'jira alternative free small team', category: 'alternatives', lang: 'en' },
  { keyword: 'clickup alternative free', category: 'alternatives', lang: 'en' },
  { keyword: 'trello power-up limit workaround', category: 'alternatives', lang: 'en' },

  // EN - google-workspace
  { keyword: 'google sheets kanban board', category: 'google-workspace', lang: 'en' },
  { keyword: 'google drive project management tool', category: 'google-workspace', lang: 'en' },
  { keyword: 'google workspace team task management', category: 'google-workspace', lang: 'en' },
  { keyword: 'kanban board inside google sheets', category: 'google-workspace', lang: 'en' },

  // EN - ai-tools
  { keyword: 'AI meeting notes to tasks automatically', category: 'ai-tools', lang: 'en' },
  { keyword: 'free AI project management tool 2026', category: 'ai-tools', lang: 'en' },
  { keyword: 'AI task management google workspace', category: 'ai-tools', lang: 'en' },

  // EN - productivity
  { keyword: 'task management tool no credit card', category: 'productivity', lang: 'en' },
  { keyword: 'remote team task tracking free', category: 'productivity', lang: 'en' },
  { keyword: 'small team project management free', category: 'productivity', lang: 'en' },
  { keyword: 'free agile project management tool', category: 'productivity', lang: 'en' },
  { keyword: 'startup project management tool free', category: 'productivity', lang: 'en' },

  // KO - 툴비교
  { keyword: '아사나 무료 대안', category: '툴비교', lang: 'ko' },
  { keyword: '노션 대신 무료 협업툴', category: '툴비교', lang: 'ko' },
  { keyword: '먼데이닷컴 무료 대체 서비스', category: '툴비교', lang: 'ko' },
  { keyword: '지라 소규모팀 대안', category: '툴비교', lang: 'ko' },
  { keyword: '무료 프로젝트 관리 툴 비교 2026', category: '툴비교', lang: 'ko' },
  { keyword: '트렐로 무료 대안 추천', category: '툴비교', lang: 'ko' },

  // KO - 구글활용
  { keyword: '구글 스프레드시트 칸반보드 만들기', category: '구글활용', lang: 'ko' },
  { keyword: '구글 드라이브 프로젝트 관리', category: '구글활용', lang: 'ko' },
  { keyword: '구글 워크스페이스 팀 업무관리', category: '구글활용', lang: 'ko' },
  { keyword: '구글 시트 업무관리 템플릿', category: '구글활용', lang: 'ko' },

  // KO - AI활용
  { keyword: '회의록 자동 태스크 변환', category: 'AI활용', lang: 'ko' },
  { keyword: 'AI 업무 보고서 자동 생성', category: 'AI활용', lang: 'ko' },
  { keyword: 'AI 프로젝트 관리 툴 무료', category: 'AI활용', lang: 'ko' },
  { keyword: '미팅 노트 자동 정리 AI', category: 'AI활용', lang: 'ko' },

  // KO - 협업팁
  { keyword: '스타트업 무료 협업툴 추천', category: '협업팁', lang: 'ko' },
  { keyword: '재택근무 팀 업무관리 툴', category: '협업팁', lang: 'ko' },
  { keyword: '무료 칸반보드 가입 없이', category: '협업팁', lang: 'ko' },
  { keyword: '팀 업무 현황 공유 무료', category: '협업팁', lang: 'ko' },
  { keyword: '소규모팀 프로젝트 관리 방법', category: '협업팁', lang: 'ko' },
]

export async function GET() {
  try {
    await initKeywordsTable()
    const sql = getDb()

    // Clear existing and re-seed
    await sql`DELETE FROM blog_keywords`

    for (const kw of KEYWORDS) {
      await sql`
        INSERT INTO blog_keywords (keyword, category, lang)
        VALUES (${kw.keyword}, ${kw.category}, ${kw.lang})
      `
    }

    return new Response(JSON.stringify({ ok: true, inserted: KEYWORDS.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
