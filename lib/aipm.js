// Gemini API client-side call
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function mapExcelToTasks({ headers, rows, projectId }) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set')

  const taskSchema = `{
  "title": "string (required — task name)",
  "stage": "string (one of: 기획 | 디자인 | 퍼블 | 개발 | 완료)",
  "priority": "string (one of: 낮음 | 보통 | 높음 | 긴급)",
  "assignee": "string (person name or empty)",
  "startDate": "string (YYYY-MM-DD or empty)",
  "dueDate": "string (YYYY-MM-DD or empty)",
  "desc": "string (description or empty)",
  "isKeyTask": "boolean"
}`

  const prompt = `You are a data migration assistant. Convert the following spreadsheet data into TaskFlow task objects.

TaskFlow task schema (JSON):
${taskSchema}

Rules:
- Map column names intelligently (e.g. "작업명"→title, "담당자"→assignee, "마감"→dueDate, "상태"→stage, "설명"→desc)
- For stage: map any status/stage values to the closest of: 기획, 디자인, 퍼블, 개발, 완료
- For priority: map to 낮음/보통/높음/긴급 based on context (high/urgent/critical→긴급, low/minor→낮음, else 보통)
- For dates: convert to YYYY-MM-DD format. If month/day only, assume current year.
- Skip rows that have no meaningful title
- Return ONLY a valid JSON array, no markdown, no explanation

Spreadsheet columns: ${JSON.stringify(headers)}

Data (first ${rows.length} rows):
${JSON.stringify(rows, null, 2)}`

  const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4096 }
    })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Gemini API error ${res.status}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'

  // Extract JSON from response (remove potential markdown code blocks)
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Gemini returned invalid JSON')

  const tasks = JSON.parse(jsonMatch[0])

  // Map Korean stage names back to English keys
  const stageMap = { '기획': 'planning', '디자인': 'design', '퍼블': 'publishing', '개발': 'dev', '완료': 'dev' }
  const priorityMap = { '낮음': 'low', '보통': 'medium', '높음': 'high', '긴급': 'high' }

  // Assign projectId and defaults
  return tasks.map((t, i) => ({
    id: Date.now() + i,
    title: t.title || 'Untitled',
    stage: stageMap[t.stage] || 'planning',
    priority: priorityMap[t.priority] || 'medium',
    assignee: t.assignee || '',
    startDate: t.startDate || '',
    dueDate: t.dueDate || '',
    desc: t.desc || '',
    published: false,
    comments: [],
    projectId: projectId || '',
    labelIds: [],
    isKeyTask: !!t.isKeyTask,
  }))
}

export async function generateAiPmReport({ members, tasks, subTasks, lang = 'ko' }) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set')

  const prompt = buildPrompt({ members, tasks, subTasks, lang })

  const res = await fetch(`${GEMINI_API}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Gemini API error ${res.status}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

function buildPrompt({ members, tasks, subTasks, lang }) {
  const today = new Date()
  const memberStats = members.map(m => {
    const myTasks = tasks.filter(t => t.assignee === m.name)
    const mySubTasks = subTasks.filter(s => s.assignee === m.name)
    const overdue = myTasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.stage !== '완료')
    const done = myTasks.filter(t => t.stage === '완료')
    const inProg = myTasks.filter(t => t.stage !== '완료' && t.stage !== '기획')
    const keyCount = myTasks.filter(t => t.isKeyTask).length
    const subDone = mySubTasks.filter(s => s.done).length
    return {
      ...m,
      totalTasks: myTasks.length,
      completedTasks: done.length,
      inProgressTasks: inProg.length,
      overdueTasks: overdue.length,
      keyTasks: keyCount,
      subTaskDone: subDone,
      subTaskTotal: mySubTasks.length,
      taskList: myTasks.map(t => `[${t.stage}] ${t.title} (마감: ${t.dueDate || '미정'}, 우선순위: ${t.priority}${t.isKeyTask ? ', ⭐핵심' : ''})`).join('\n'),
    }
  })

  const today_str = today.toISOString().split('T')[0]

  if (lang === 'ko') {
    return `당신은 프로젝트 관리 AI입니다. 아래 팀 현황을 분석하여 보고서를 작성해주세요.

오늘 날짜: ${today_str}

## 팀원 현황
${memberStats.map(m => `
### ${m.name} (${m.jobTitle || '직함 미등록'}) - ${m.role}
- 담당업무: ${m.responsibilities || '미등록'}
- 업무스타일: ${m.workStyle || '미등록'}
- 전체 태스크: ${m.totalTasks}개 (완료: ${m.completedTasks}, 진행중: ${m.inProgressTasks}, 지연: ${m.overdueTasks})
- 핵심 태스크: ${m.keyTasks}개
- 서브태스크: ${m.subTaskDone}/${m.subTaskTotal} 완료
- 태스크 목록:
${m.taskList || '(없음)'}
`).join('\n')}

## 요청사항
다음 형식으로 보고서를 작성해주세요:

### 📊 개인별 진행 현황
(각 팀원별 진행률, 위험도, 워크로드 평가. 업무스타일과 담당업무 특성을 고려한 분석 포함)

### 🚨 위험 신호
(지연된 태스크, 과부하 팀원, 병목 구간)

### 💡 팀장 권고사항
(업무 재분배 제안, 우선순위 조정, 주의해야 할 팀원)

### 📅 이번 주 핵심 액션
(즉시 처리해야 할 항목 3~5개)`
  } else {
    return `You are a project management AI. Analyze the team status below and write a report.

Today: ${today_str}

## Team Status
${memberStats.map(m => `
### ${m.name} (${m.jobTitle || 'No title'}) - ${m.role}
- Responsibilities: ${m.responsibilities || 'Not set'}
- Work style: ${m.workStyle || 'Not set'}
- Tasks: ${m.totalTasks} total (done: ${m.completedTasks}, in progress: ${m.inProgressTasks}, overdue: ${m.overdueTasks})
- Key tasks: ${m.keyTasks}
- Subtasks: ${m.subTaskDone}/${m.subTaskTotal} done
- Task list:
${m.taskList || '(none)'}
`).join('\n')}

## Report format:

### 📊 Individual Progress
(Per-member progress, risk level, workload — consider work style and responsibilities)

### 🚨 Risk Signals
(Overdue tasks, overloaded members, bottlenecks)

### 💡 Manager Recommendations
(Workload redistribution, priority adjustments, members to watch)

### 📅 This Week's Key Actions
(3-5 items that need immediate attention)`
  }
}
