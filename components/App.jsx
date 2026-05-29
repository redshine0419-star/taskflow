'use client'
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const Z = {
  bg:      '#09090b',
  surface: '#18181b',
  border:  '#27272a',
  text:    '#f4f4f5',
  muted:   '#a1a1aa',
  emerald: '#34d399',
  indigo:  '#818cf8',
  red:     '#f87171',
  amber:   '#fbbf24',
}

// ─── I18N ────────────────────────────────────────────────────────────────────
const TR = {
  en: {
    // stages
    'stage.planning':   'Planning',
    'stage.design':     'Design',
    'stage.publishing': 'Publishing',
    'stage.dev':        'Dev',
    // priorities
    'priority.high':   'High',
    'priority.medium': 'Medium',
    'priority.low':    'Low',
    // landing — nav
    signInGoogle: 'G  Sign in with Google',
    signingIn:    'Connecting…',
    tryGuest:     'Try without sign-in →',
    // landing — hero  (P1: outcome-focused copy)
    heroPill:    'BYOD · Serverless · Google Drive Native',
    heroTitle1:  'Zero fees. Zero servers.',
    heroTitle2:  'Your data, your Drive.',
    heroBody:    'No subscriptions. No vendor lock-in. Your team\'s tasks live in your own Google Drive — with real-time two-way sync between kanban and spreadsheet.',
    ctaStart:    'Get started free →',
    scopeNote:   '🔒 scope: drive.file — only accesses files this app creates',
    // landing — roi  (P1: removed AdSense row)
    // landing — sync showcase
    syncTitle:    'Live Sync Demo',
    syncKanban:   'Kanban (click → next stage)',
    syncSheet:    'Google Sheet (instant)',
    syncColTitle: 'Title',
    syncColStage: 'Stage',
    // landing — ai demo
    aiDemoTitle:       '◆ AI Parser — Try It',
    aiDemoPlaceholder: 'Paste meeting notes and click Analyze…',
    aiSample:    'Sample',
    aiAnalyze:   '◆ Analyze',
    aiAnalyzing: 'Analyzing…',
    // landing — features
    feat1Title: 'Kanban + Spreadsheet', feat1Desc: 'Two-way real-time sync',
    feat2Title: 'AI Meeting Parser',    feat2Desc: 'Gemini 2.5 Flash powered',
    feat3Title: 'Auto-publish SEO',     feat3Desc: 'Dev retrospectives on autopilot',
    feat4Title: 'Full Privacy',         feat4Desc: 'drive.file scope only',
    // tutorial
    tutorialBtn:   '? How to use',
    tutorialTitle: 'Welcome to TaskFlow',
    tutorialSkip:  'Skip',
    tutorialPrev:  '← Back',
    tutorialNext:  'Next →',
    tutorialDone:  'Got it!',
    tutorialSteps: [
      { icon: '⬡', title: 'Kanban Board', body: 'Your tasks live in 4 stages: Planning → Design → Dev → Publishing. Drag the stage badge on each card to move it forward.' },
      { icon: '+', title: 'Add a Task', body: 'Click the dashed "+ Add task" button at the bottom of any column. Fill in title, assignee, priority, and due date.' },
      { icon: '⊞', title: 'Spreadsheet View', body: 'Switch to Sheet tab to see all tasks as a table. Edit cells inline — changes sync back to the kanban board instantly.' },
      { icon: '◆', title: 'AI Meeting Parser', body: 'Click "AI Parser" in the header, paste your meeting notes, and TaskFlow will extract tasks automatically using Gemini AI.' },
      { icon: '↑', title: 'Publish Tab', body: 'Mark a task complete, then go to the Publish tab to auto-generate a dev retrospective blog post — great for team SEO.' },
      { icon: '⚙', title: 'Settings', body: 'Rename pipeline stages to match your workflow (e.g. "Review" instead of "Publishing"), and invite teammates by email.' },
    ],
    // workspace — header
    aiParserBtn: '◆ AI Parser',
    syncLogBtn:  'SYNC LOG',
    shareBtn:    'Share',
    signOut:     'Sign out',
    // workspace — tabs  (P1: SEO → Publish)
    tabKanban:   'Kanban',
    tabSheet:    'Sheet',
    tabPublish:  'Publish',
    tabSettings: 'Settings',
    // sandbox banner
    sandboxBanner:   '👋 You\'re in sandbox mode — data is not saved.',
    sandboxSignIn:   'Sign in to save →',
    // kanban
    noTasks:    'No tasks',
    addTask:    '+ Add task',
    prevStage:  '◀ Prev',
    nextStage:  'Next ▶',
    publishBtn: '↑ Autopress Publish',
    // add task modal
    addTaskTitle:   'New Task',
    fieldTitle:     'Title',
    fieldAssignee:  'Assignee',
    fieldDueDate:   'Due date',
    fieldPriority:  'Priority',
    fieldStage:     'Stage',
    saveTask:       'Add task',
    cancel:         'Cancel',
    // task card actions
    deleteTask:     'Delete',
    viewDetail:     'Detail',
    publishedBadge: 'Published',
    // task detail modal
    detailTitle:       'Task Detail',
    descLabel:         'Description',
    descPlaceholder:   'Add notes, links, or context…',
    commentsLabel:     'Activity',
    commentPlaceholder:'Write a comment…',
    postComment:       'Post',
    closeDetail:       'Close',
    saveDetail:        'Save changes',
    // spreadsheet
    colNum:      '#',
    colTitle:    'Title',
    colStage:    'Stage',
    colAssignee: 'Assignee',
    colDueDate:  'Due Date',
    colPriority: 'Priority',
    colActions:  '',
    addRow:      '+ Add row',
    inlineEditLog: (id, f, v) => `Inline edit: row${id} [${f}] → "${v}"`,
    sheetSyncLog:  (id, f)    => `Sheets synced: row${id} [${f}] updated`,
    // autopress (P1: tab label changed to Publish)
    publishedTasks:    'Published Tasks',
    publishHint:       'Publish a task from the Kanban Dev column',
    articleGenerating: '◆ Generating SEO article…',
    articleHint:       'Click a published task on the left to generate its SEO article',
    articleLabel:      '● PUBLISHED · taskflow.io/blog/',
    articleHeading:    'Dev Retrospective',
    articleAssignee:   'Assignee',
    articleCompleted:  'Completed',
    articlePriority:   'Priority',
    articleSummary:    'Summary',
    articleSummaryBody: (t) => `This task — ${t} — was managed in the TaskFlow workspace and successfully delivered.`,
    articleWork:       'Key Deliverables',
    articleWork1:      'Requirements analysis & tech spec',
    articleWork2:      'UI/UX design & publishing complete',
    articleWork3:      'Code review & QA passed',
    articleWork4:      'Production deployment done',
    articleInsights:   'Outcomes & Insights',
    articleInsightsBody: (a, d) => `Led by ${a}, delivered on schedule by ${d}. Free Asana & Jira alternative — SEO optimized.`,
    autopressLog:     (t) => `Autopress article request: "${t}"`,
    autopressDoneLog: 'SEO article ready: taskflow.io/blog/',
    // settings
    settingCrawlerLabel: 'Allow Google crawler',
    settingCrawlerDesc:  'Expose Autopress posts to search engines',
    settingSyncLabel:    'Real-time auto-sync',
    settingSyncDesc:     'Google Sheets API two-way sync',
    settingNotifLabel:   'Sync notifications',
    settingNotifDesc:    'Show badge on sync success / failure',
    connectedAccount:    'CONNECTED ACCOUNT',
    driveConnected:      'Drive connected',
    scopeInfo:           '🔒 scope: drive.file — only accesses files created by this app.',
    // pipeline customization (P1)
    pipelineTitle:   'PIPELINE STAGES',
    pipelineDesc:    'Customize your workflow stage names',
    pipelineReset:   'Reset',
    pipelineSave:    'Save',
    // share modal (P0)
    shareModalTitle: 'Share Workspace',
    shareModalDesc:  'Your data lives in Google Drive. Share the spreadsheet URL with your team.',
    shareCopyBtn:    'Copy Sheets URL',
    shareCopied:     '✓ Copied!',
    shareNote:       '💡 Anyone with the link can view and edit the shared spreadsheet.',
    // invite team (P2)
    inviteTitle:    'INVITE TEAM MEMBER',
    inviteEmail:    'Email address',
    inviteSend:     'Send invite',
    inviteSent:     '✓ Invite sent!',
    inviteDesc:     'They\'ll receive access to the shared Google Sheet.',
    // drawer
    drawerTitle:  '● SYNC CONSOLE',
    drawerEmpty:  'No sync logs yet',
    drawerFooter: 'Google Sheets API v4 · Drive API v3 · scope: drive.file',
    // ai modal
    aiModalTitle:    '◆ AI Meeting Parser',
    aiModalSubtitle: 'Gemini 2.5 Flash · Unstructured text → Structured data',
    aiModalHint:     'Paste meeting notes, Slack logs, etc.',
    aiLoadSample:    'Load sample',
    aiCancel:        'Cancel',
    aiAnalyzeBtn:    '◆ Analyze',
    aiReEnter:       'Re-enter',
    aiConfirm:       '✓ Confirm · Add to Sheet',
    aiExtracted:     (n) => `AI extracted ${n} task${n !== 1 ? 's' : ''}. Review and confirm.`,
    aiStageLabel:    'Stage',
    aiAssigneeLabel: 'Assignee',
    aiDueDateLabel:  'Due',
    aiParseLog:      'Sending Gemini 2.5 Flash API request…',
    aiParsedLog:     (n) => `AI parse complete: ${n} task${n !== 1 ? 's' : ''} extracted`,
    aiAppendLog:     (n) => `Google Sheets append: batch insert ${n} row${n !== 1 ? 's' : ''}`,
    aiAppendDoneLog: (n) => `Sheets API 200 · ${n} row${n !== 1 ? 's' : ''} inserted`,
    // workspace init logs
    initLog1: 'Drive API: TaskFlow_Database_2026.xlsx provisioned',
    initLog2: 'Google Sheets: initialized (7 rows)',
    initLog3: 'Two-way real-time sync active',
    sheetReqLog:   (r, s) => `Sheets API request: row${r} col C → "${s}"`,
    sheetDoneLog:  (r, s) => `Sheets synced: row${r} → "${s}"`,
    publishReqLog: (t)    => `Autopress publish request: "${t}"`,
    publishDoneLog:(s)    => `Published: taskflow.io/blog/${s}`,
    appendReqLog:  (n)    => `Google Sheets append: ${n} row batch insert`,
    appendDoneLog: (n)    => `Sheets API 200 · ${n} rows inserted`,
    deleteLog:     (t)    => `Task deleted: "${t}"`,
    sampleMinutes: `[2026-05-29 Dev Team Weekly]
Attendees: Alex, Jordan, Sam

1. Notification system refactor (assignee: Alex, due: 2026-07-15, priority: high) — planning stage
2. Dark mode toggle component (assignee: Jordan, due: 2026-07-20, priority: medium) — design stage
3. Performance monitoring dashboard (assignee: Sam, due: 2026-07-25, priority: high) — dev stage`,
    fallbackTaskTitle: 'New Parsed Task',
    fallbackAssignee:  'Unassigned',
    demoUserName:  'Alex Johnson',
    demoUserEmail: 'alex@example.com',
    // empty state (P2)
    emptyStateTitle: 'No tasks here yet',
    emptyStateDesc:  'Add your first task to kick off the workflow',
    emptyStateAdd:   '+ Create first task',
  },

  ko: {
    'stage.planning':   '기획',
    'stage.design':     '디자인',
    'stage.publishing': '퍼블',
    'stage.dev':        '개발',
    'priority.high':   '높음',
    'priority.medium': '보통',
    'priority.low':    '낮음',
    signInGoogle: 'G  Google로 시작',
    signingIn:    '연결 중…',
    tryGuest:     '로그인 없이 체험 →',
    heroPill:    'BYOD · 서버리스 · Google Drive 네이티브',
    heroTitle1:  '구독료 없이. 서버 없이.',
    heroTitle2:  '데이터는 내 드라이브에.',
    heroBody:    '월정액 없음. 벤더 종속 없음. 팀의 모든 태스크가 내 구글 드라이브에 저장됩니다 — 칸반과 스프레드시트가 실시간 양방향 동기화됩니다.',
    ctaStart:    '무료로 시작하기 →',
    scopeNote:   '🔒 scope: drive.file — 앱이 생성한 파일에만 접근합니다',
    syncTitle:    '실시간 싱크 체감 위젯',
    syncKanban:   '칸반 (클릭 → 다음 단계)',
    syncSheet:    '구글 시트 (즉시 반영)',
    syncColTitle: '제목',
    syncColStage: '단계',
    aiDemoTitle:       '◆ AI 파서 체험',
    aiDemoPlaceholder: '회의록을 붙여넣고 AI 분석을 눌러보세요…',
    aiSample:    '샘플',
    aiAnalyze:   '◆ AI 분석',
    aiAnalyzing: '분석 중…',
    feat1Title: '칸반 + 스프레드시트', feat1Desc: '양방향 실시간 동기화',
    feat2Title: 'AI 회의록 파서',      feat2Desc: 'Gemini 2.5 Flash 연동',
    feat3Title: '자동 SEO 발행',       feat3Desc: '개발 회고록 자동 생성',
    feat4Title: '완전한 프라이버시',    feat4Desc: 'drive.file 스코프 제한',
    // tutorial
    tutorialBtn:   '? 사용법',
    tutorialTitle: 'TaskFlow 시작하기',
    tutorialSkip:  '건너뛰기',
    tutorialPrev:  '← 이전',
    tutorialNext:  '다음 →',
    tutorialDone:  '시작하기!',
    tutorialSteps: [
      { icon: '⬡', title: '칸반 보드', body: '태스크는 Planning → Design → Dev → Publishing 4단계로 진행됩니다. 카드의 단계 배지를 클릭해 이동하세요.' },
      { icon: '+', title: '태스크 추가', body: '각 컬럼 하단의 점선 "+ 태스크 추가" 버튼을 클릭하세요. 제목, 담당자, 우선순위, 마감일을 입력할 수 있습니다.' },
      { icon: '⊞', title: '스프레드시트 뷰', body: '시트 탭으로 전환하면 모든 태스크를 표 형태로 볼 수 있습니다. 셀을 클릭해 직접 편집하면 칸반에 즉시 반영됩니다.' },
      { icon: '◆', title: 'AI 회의록 파서', body: '헤더의 "AI 파서" 버튼을 클릭하고 회의록을 붙여넣으면 Gemini AI가 자동으로 태스크를 추출합니다.' },
      { icon: '↑', title: '발행 탭', body: '태스크를 완료로 표시한 뒤 발행 탭에서 개발 회고록 블로그 포스트를 자동으로 생성할 수 있습니다.' },
      { icon: '⚙', title: '설정', body: '파이프라인 단계 이름을 팀 워크플로우에 맞게 변경하고, 이메일로 팀원을 초대할 수 있습니다.' },
    ],
    aiParserBtn: '◆ AI 파서',
    syncLogBtn:  'SYNC LOG',
    shareBtn:    '공유',
    signOut:     '로그아웃',
    tabKanban:   '칸반',
    tabSheet:    '시트',
    tabPublish:  '발행',
    tabSettings: '설정',
    sandboxBanner: '👋 샌드박스 모드입니다 — 데이터는 저장되지 않습니다.',
    sandboxSignIn: '로그인하고 저장하기 →',
    noTasks:    '태스크 없음',
    addTask:    '+ 태스크 추가',
    prevStage:  '◀ 이전',
    nextStage:  '다음 ▶',
    publishBtn: '↑ Autopress 발행',
    addTaskTitle:   '새 태스크',
    fieldTitle:     '제목',
    fieldAssignee:  '담당자',
    fieldDueDate:   '마감일',
    fieldPriority:  '우선순위',
    fieldStage:     '단계',
    saveTask:       '태스크 추가',
    cancel:         '취소',
    deleteTask:     '삭제',
    viewDetail:     '상세',
    publishedBadge: '발행됨',
    detailTitle:       '태스크 상세',
    descLabel:         '설명',
    descPlaceholder:   '메모, 링크, 세부 내용을 입력하세요…',
    commentsLabel:     '활동',
    commentPlaceholder:'댓글을 입력하세요…',
    postComment:       '등록',
    closeDetail:       '닫기',
    saveDetail:        '저장',
    colNum:      '#',
    colTitle:    '제목',
    colStage:    '단계',
    colAssignee: '담당자',
    colDueDate:  '마감일',
    colPriority: '우선순위',
    colActions:  '',
    addRow:      '+ 행 추가',
    inlineEditLog: (id, f, v) => `인라인 편집: row${id} [${f}] → "${v}"`,
    sheetSyncLog:  (id, f)    => `Sheets 동기화: row${id} [${f}] 업데이트`,
    publishedTasks:    '발행된 태스크',
    publishHint:       '칸반 개발 탭에서 태스크를 발행하세요',
    articleGenerating: '◆ SEO 아티클 생성 중…',
    articleHint:       '좌측에서 발행된 태스크를 클릭하면 SEO 아티클이 생성됩니다',
    articleLabel:      '● PUBLISHED · taskflow.io/blog/',
    articleHeading:    '개발 회고록',
    articleAssignee:   '담당자',
    articleCompleted:  '완료일',
    articlePriority:   '우선순위',
    articleSummary:    '요약',
    articleSummaryBody: (t) => `본 태스크 — ${t} — 는 TaskFlow에서 관리된 업무의 최종 완료 회고록입니다.`,
    articleWork:       '주요 작업 내역',
    articleWork1:      '요건 분석 및 기술 스펙 정의',
    articleWork2:      'UI/UX 설계 및 퍼블리싱 완료',
    articleWork3:      '코드 리뷰 및 QA 테스트 통과',
    articleWork4:      '프로덕션 배포 완료',
    articleInsights:   '성과 및 인사이트',
    articleInsightsBody: (a, d) => `${a} 담당자 주도로 ${d} 기한 내 완료. 아사나 지라 대체 무료 칸반보드 SEO 최적화 완료.`,
    autopressLog:     (t) => `Autopress SEO 아티클 생성 요청: "${t}"`,
    autopressDoneLog: 'SEO 아티클 생성 완료: taskflow.io/blog/',
    settingCrawlerLabel: '구글 크롤봇 수집 허용',
    settingCrawlerDesc:  'Autopress 발행 포스트를 검색 엔진에 공개합니다',
    settingSyncLabel:    '실시간 자동 동기화',
    settingSyncDesc:     'Google Sheets API 자동 양방향 동기화',
    settingNotifLabel:   '동기화 알림',
    settingNotifDesc:    '싱크 성공/실패 시 콘솔 배지에 알림 표시',
    connectedAccount:    '연결된 계정',
    driveConnected:      'Drive 연결됨',
    scopeInfo:           '🔒 scope: drive.file — 앱이 생성한 파일에만 접근. 개인 파일 접근 불가.',
    pipelineTitle:   '파이프라인 단계',
    pipelineDesc:    '워크플로우 단계명을 커스터마이징하세요',
    pipelineReset:   '초기화',
    pipelineSave:    '저장',
    shareModalTitle: '워크스페이스 공유',
    shareModalDesc:  '데이터는 구글 드라이브에 있습니다. 스프레드시트 URL을 팀원과 공유하세요.',
    shareCopyBtn:    'Sheets URL 복사',
    shareCopied:     '✓ 복사됨!',
    shareNote:       '💡 링크를 가진 팀원은 스프레드시트를 보고 수정할 수 있습니다.',
    inviteTitle:    '팀원 초대',
    inviteEmail:    '이메일 주소',
    inviteSend:     '초대 보내기',
    inviteSent:     '✓ 초대 발송 완료!',
    inviteDesc:     '초대받은 팀원은 공유 구글 시트에 접근할 수 있습니다.',
    drawerTitle:  '● SYNC CONSOLE',
    drawerEmpty:  '아직 동기화 로그가 없습니다',
    drawerFooter: 'Google Sheets API v4 · Drive API v3 · scope: drive.file',
    aiModalTitle:    '◆ AI 회의록 파서',
    aiModalSubtitle: 'Gemini 2.5 Flash · 비정형 텍스트 → 구조화 데이터',
    aiModalHint:     '회의록, 슬랙 대화 로그 등을 붙여넣기 하세요',
    aiLoadSample:    '샘플 불러오기',
    aiCancel:        '취소',
    aiAnalyzeBtn:    '◆ AI 분석',
    aiReEnter:       '다시 입력',
    aiConfirm:       '✓ 확인 · 시트에 추가',
    aiExtracted:     (n) => `AI가 ${n}개의 태스크를 추출했습니다. 검수 후 확인하세요.`,
    aiStageLabel:    '단계',
    aiAssigneeLabel: '담당',
    aiDueDateLabel:  '마감',
    aiParseLog:      'Gemini 2.5 Flash API 요청 전송 중…',
    aiParsedLog:     (n) => `AI 파싱 완료: ${n}개 태스크 추출`,
    aiAppendLog:     (n) => `Google Sheets append 요청: ${n}행 일괄 적재`,
    aiAppendDoneLog: (n) => `Sheets API 응답 200 · ${n}개 행 삽입 완료`,
    initLog1: 'Drive API: TaskFlow_Database_2026.xlsx 생성 완료',
    initLog2: 'Google Sheets: 시트 초기화 완료 (7행)',
    initLog3: '양방향 실시간 동기화 활성화',
    sheetReqLog:   (r, s) => `Sheets API 요청: row${r} C열 → "${s}"`,
    sheetDoneLog:  (r, s) => `Sheets 동기화 완료: row${r} "${s}"`,
    publishReqLog: (t)    => `Autopress 발행 요청: "${t}"`,
    publishDoneLog:(s)    => `발행 완료: taskflow.io/blog/${s}`,
    appendReqLog:  (n)    => `Google Sheets append 요청: ${n}행 일괄 적재`,
    appendDoneLog: (n)    => `Sheets API 응답 200 · ${n}개 행 삽입 완료`,
    deleteLog:     (t)    => `태스크 삭제: "${t}"`,
    sampleMinutes: `[2026-05-29 개발팀 주간 회의]
참석: 김민준, 이서연, 박지호

1. 알림 시스템 리팩터링 (담당: 박지호, 마감: 2026-07-15, 우선순위: 높음) — 기획 단계
2. 다크모드 토글 컴포넌트 개발 (담당: 이서연, 마감: 2026-07-20, 우선순위: 보통) — 디자인 단계
3. 성능 모니터링 대시보드 (담당: 김민준, 마감: 2026-07-25, 우선순위: 높음) — 개발 단계`,
    fallbackTaskTitle: '신규 파싱 태스크',
    fallbackAssignee:  '미배정',
    demoUserName:  '김민준',
    demoUserEmail: 'minj@example.com',
    emptyStateTitle: '태스크가 없습니다',
    emptyStateDesc:  '첫 번째 태스크를 추가해 워크플로우를 시작하세요',
    emptyStateAdd:   '+ 첫 태스크 만들기',
  },
}

// ─── LANG CONTEXT ────────────────────────────────────────────────────────────
const LangContext = createContext(null)
const useLang = () => useContext(LangContext)

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STAGE_KEYS    = ['planning', 'design', 'publishing', 'dev']
const PRIORITY_KEYS = ['high', 'medium', 'low']
let nextTaskId = 100

const INITIAL_TASKS = [
  { id: 1,  title: 'Homepage Renewal Planning',     stage: 'planning',   assignee: 'Alex',   dueDate: '2026-06-10', priority: 'high',   rowNum: 2, published: false, desc: '', comments: [] },
  { id: 2,  title: 'Login UI Wireframe',            stage: 'design',     assignee: 'Jordan', dueDate: '2026-06-15', priority: 'medium', rowNum: 3, published: false, desc: '', comments: [] },
  { id: 3,  title: 'Main Landing Publishing',       stage: 'publishing', assignee: 'Sam',    dueDate: '2026-06-20', priority: 'medium', rowNum: 4, published: false, desc: '', comments: [] },
  { id: 4,  title: 'API Auth Module',               stage: 'dev',        assignee: 'Casey',  dueDate: '2026-06-25', priority: 'high',   rowNum: 5, published: false, desc: '', comments: [] },
  { id: 5,  title: 'Dashboard Component Design',    stage: 'planning',   assignee: 'Morgan', dueDate: '2026-07-01', priority: 'low',    rowNum: 6, published: false, desc: '', comments: [] },
  { id: 6,  title: 'Mobile Responsive Design',      stage: 'design',     assignee: 'Jordan', dueDate: '2026-07-05', priority: 'high',   rowNum: 7, published: false, desc: '', comments: [] },
  { id: 7,  title: 'Search Feature Implementation', stage: 'dev',        assignee: 'Alex',   dueDate: '2026-07-10', priority: 'medium', rowNum: 8, published: true,  desc: '', comments: [] },
]

// ─── UTILS ───────────────────────────────────────────────────────────────────
let logId = 0
const makeLog = (msg, type = 'info') => ({
  id: ++logId,
  time: new Date().toLocaleTimeString('en-US', { hour12: false }),
  msg, type,
})
const sim = (d = 400) => new Promise(r => setTimeout(r, d))

// ─── ATOMS ───────────────────────────────────────────────────────────────────
function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div style={{ display: 'flex', border: `1px solid ${Z.border}`, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
      {['en', 'ko'].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: '4px 9px', fontSize: 11, fontWeight: 700,
          border: 'none', cursor: 'pointer',
          background: lang === l ? Z.border : 'transparent',
          color: lang === l ? Z.text : Z.muted,
          transition: 'background .15s, color .15s', letterSpacing: 0.5,
        }}>{l.toUpperCase()}</button>
      ))}
    </div>
  )
}

function Badge({ children, color = Z.muted }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 7px', borderRadius: 4,
      fontSize: 11, fontWeight: 600,
      border: `1px solid ${color}33`, color, background: `${color}18`,
    }}>{children}</span>
  )
}

function PriorityBadge({ priorityKey }) {
  const { t } = useLang()
  const colors = { high: Z.red, medium: Z.amber, low: Z.muted }
  return <Badge color={colors[priorityKey] || Z.muted}>{t(`priority.${priorityKey}`)}</Badge>
}

function Btn({ children, onClick, variant = 'default', small, style, disabled }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', borderRadius: 6,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600, transition: 'opacity .15s, background .15s',
    opacity: disabled ? 0.5 : 1,
    fontSize: small ? 12 : 13,
    padding: small ? '4px 10px' : '7px 14px',
  }
  const variants = {
    default: { background: Z.border,           color: Z.text },
    primary: { background: Z.indigo,           color: '#fff' },
    emerald: { background: Z.emerald,          color: '#052e16' },
    ghost:   { background: 'transparent',      color: Z.muted, padding: small ? '3px 6px' : '6px 10px' },
    danger:  { background: '#7f1d1d33',        color: Z.red, border: `1px solid ${Z.red}33` },
  }
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

function Select({ value, onChange, options, style }) {
  const norm = options.map(o => typeof o === 'string' ? { value: o, label: o } : o)
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      background: Z.surface, border: `1px solid ${Z.border}`,
      borderRadius: 6, color: Z.text, fontSize: 12, padding: '4px 8px',
      outline: 'none', cursor: 'pointer', ...style,
    }}>
      {norm.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 36, height: 20, borderRadius: 10,
      background: checked ? Z.emerald : Z.border,
      position: 'relative', cursor: 'pointer',
      transition: 'background .2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: checked ? 19 : 3,
        width: 14, height: 14, borderRadius: '50%',
        background: checked ? '#052e16' : Z.muted,
        transition: 'left .2s',
      }} />
    </div>
  )
}

function Overlay({ onClick }) {
  return <div onClick={onClick} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 55 }} />
}

function ModalShell({ children, maxWidth = 560, onClose }) {
  return (
    <>
      <Overlay onClick={onClose} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        pointerEvents: 'none',
      }}>
        <div style={{
          background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 12,
          width: '100%', maxWidth, maxHeight: '90vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          pointerEvents: 'auto',
        }}>
          {children}
        </div>
      </div>
    </>
  )
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const id = setTimeout(onDone, 2200); return () => clearTimeout(id) }, [onDone])
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: Z.surface, border: `1px solid ${Z.emerald}55`,
      color: Z.emerald, padding: '10px 20px', borderRadius: 8,
      fontSize: 13, fontWeight: 600, zIndex: 80,
      boxShadow: `0 4px 20px rgba(0,0,0,.4)`,
    }}>{msg}</div>
  )
}

// ─── SIDE DRAWER ─────────────────────────────────────────────────────────────
function SideDrawer({ open, onClose, logs }) {
  const { t } = useLang()
  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 40 }} />}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: Math.min(380, typeof window !== 'undefined' ? window.innerWidth : 380),
        height: '100vh', background: Z.surface, borderLeft: `1px solid ${Z.border}`,
        zIndex: 50,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${Z.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: Z.emerald, letterSpacing: 1 }}>{t('drawerTitle')}</span>
          <Btn variant="ghost" small onClick={onClose}>✕</Btn>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {logs.length === 0 && <div style={{ color: Z.muted, textAlign: 'center', marginTop: 40 }}>{t('drawerEmpty')}</div>}
          {[...logs].reverse().map(l => (
            <div key={l.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '4px 0', borderBottom: `1px solid ${Z.border}` }}>
              <span style={{ color: Z.muted, flexShrink: 0 }}>{l.time}</span>
              <span style={{ color: l.type === 'success' ? Z.emerald : l.type === 'error' ? Z.red : l.type === 'ai' ? Z.indigo : Z.muted }}>
                {l.type === 'success' ? '✓' : l.type === 'error' ? '✗' : l.type === 'ai' ? '◆' : '›'}
              </span>
              <span style={{ color: Z.text, wordBreak: 'break-all' }}>{l.msg}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 16px', borderTop: `1px solid ${Z.border}`, color: Z.muted, fontSize: 10 }}>{t('drawerFooter')}</div>
      </div>
    </>
  )
}

// ─── ADD TASK MODAL (P0) ─────────────────────────────────────────────────────
function AddTaskModal({ open, onClose, onAdd, defaultStage, stageLabel }) {
  const { t } = useLang()
  const stageOptions = STAGE_KEYS.map(k => ({ value: k, label: stageLabel(k) }))
  const priorityOptions = PRIORITY_KEYS.map(k => ({ value: k, label: t(`priority.${k}`) }))
  const [form, setForm] = useState({ title: '', assignee: '', dueDate: '', priority: 'medium', stage: defaultStage || 'planning' })

  // reset when opened
  useEffect(() => {
    if (open) setForm({ title: '', assignee: '', dueDate: '', priority: 'medium', stage: defaultStage || 'planning' })
  }, [open, defaultStage])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.title.trim()) return
    onAdd({ ...form, title: form.title.trim(), id: ++nextTaskId, rowNum: nextTaskId, published: false, desc: '', comments: [] })
    onClose()
  }

  if (!open) return null
  return (
    <ModalShell onClose={onClose} maxWidth={480}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{t('addTaskTitle')}</div>
        <Btn variant="ghost" small onClick={onClose}>✕</Btn>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Title */}
        <div>
          <div style={{ fontSize: 11, color: Z.muted, marginBottom: 5, fontWeight: 600 }}>{t('fieldTitle')} *</div>
          <input autoFocus value={form.title} onChange={e => set('title', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 13, padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Stage */}
          <div>
            <div style={{ fontSize: 11, color: Z.muted, marginBottom: 5, fontWeight: 600 }}>{t('fieldStage')}</div>
            <Select value={form.stage} onChange={v => set('stage', v)} options={stageOptions} style={{ width: '100%' }} />
          </div>
          {/* Priority */}
          <div>
            <div style={{ fontSize: 11, color: Z.muted, marginBottom: 5, fontWeight: 600 }}>{t('fieldPriority')}</div>
            <Select value={form.priority} onChange={v => set('priority', v)} options={priorityOptions} style={{ width: '100%' }} />
          </div>
          {/* Assignee */}
          <div>
            <div style={{ fontSize: 11, color: Z.muted, marginBottom: 5, fontWeight: 600 }}>{t('fieldAssignee')}</div>
            <input value={form.assignee} onChange={e => set('assignee', e.target.value)}
              style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 8px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          {/* Due date */}
          <div>
            <div style={{ fontSize: 11, color: Z.muted, marginBottom: 5, fontWeight: 600 }}>{t('fieldDueDate')}</div>
            <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
              style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 8px', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 24px', borderTop: `1px solid ${Z.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>{t('cancel')}</Btn>
        <Btn variant="primary" onClick={save} disabled={!form.title.trim()}>{t('saveTask')}</Btn>
      </div>
    </ModalShell>
  )
}

// ─── TASK DETAIL MODAL (P2) ──────────────────────────────────────────────────
function TaskDetailModal({ task, open, onClose, onUpdate, stageLabel }) {
  const { t } = useLang()
  const stageOptions    = STAGE_KEYS.map(k => ({ value: k, label: stageLabel(k) }))
  const priorityOptions = PRIORITY_KEYS.map(k => ({ value: k, label: t(`priority.${k}`) }))
  const [form, setForm] = useState(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => { if (task) setForm({ ...task }) }, [task])

  if (!open || !form) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const postComment = () => {
    if (!commentText.trim()) return
    const c = { id: Date.now(), author: 'You', text: commentText.trim(), time: new Date().toLocaleTimeString('en-US', { hour12: false }) }
    set('comments', [...(form.comments || []), c])
    setCommentText('')
  }

  const save = () => { onUpdate(form); onClose() }

  return (
    <ModalShell onClose={onClose} maxWidth={600}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{t('detailTitle')}</div>
        <Btn variant="ghost" small onClick={onClose}>✕</Btn>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Title */}
        <input value={form.title} onChange={e => set('title', e.target.value)}
          style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 15, fontWeight: 700, padding: '8px 10px', outline: 'none', boxSizing: 'border-box' }} />
        {/* Meta row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: Z.muted, marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>{t('fieldStage').toUpperCase()}</div>
            <Select value={form.stage} onChange={v => set('stage', v)} options={stageOptions} style={{ width: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: Z.muted, marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>{t('fieldPriority').toUpperCase()}</div>
            <Select value={form.priority} onChange={v => set('priority', v)} options={priorityOptions} style={{ width: '100%' }} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: Z.muted, marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>{t('fieldAssignee').toUpperCase()}</div>
            <input value={form.assignee} onChange={e => set('assignee', e.target.value)}
              style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '5px 8px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: Z.muted, marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>{t('fieldDueDate').toUpperCase()}</div>
            <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
              style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '5px 8px', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
          </div>
        </div>
        {/* Description */}
        <div>
          <div style={{ fontSize: 10, color: Z.muted, marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>{t('descLabel').toUpperCase()}</div>
          <textarea value={form.desc || ''} onChange={e => set('desc', e.target.value)} placeholder={t('descPlaceholder')} rows={4}
            style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 13, padding: '8px 10px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        {/* Comments */}
        <div>
          <div style={{ fontSize: 10, color: Z.muted, marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>{t('commentsLabel').toUpperCase()}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
            {(form.comments || []).map(c => (
              <div key={c.id} style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: Z.indigo + '44', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: Z.indigo }}>
                  {c.author[0]}
                </div>
                <div style={{ background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, padding: '6px 10px', flex: 1 }}>
                  <div style={{ fontSize: 10, color: Z.muted, marginBottom: 2 }}>{c.author} · {c.time}</div>
                  <div style={{ fontSize: 12 }}>{c.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={commentText} onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && postComment()}
              placeholder={t('commentPlaceholder')}
              style={{ flex: 1, background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 10px', outline: 'none' }} />
            <Btn variant="default" small onClick={postComment}>{t('postComment')}</Btn>
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 24px', borderTop: `1px solid ${Z.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>{t('closeDetail')}</Btn>
        <Btn variant="primary" onClick={save}>{t('saveDetail')}</Btn>
      </div>
    </ModalShell>
  )
}

// ─── SHARE MODAL (P0) ────────────────────────────────────────────────────────
function ShareModal({ open, onClose }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const fakeUrl = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit'

  const copy = () => {
    navigator.clipboard?.writeText(fakeUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!open) return null
  return (
    <ModalShell onClose={onClose} maxWidth={440}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{t('shareModalTitle')}</div>
        <Btn variant="ghost" small onClick={onClose}>✕</Btn>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 13, color: Z.muted }}>{t('shareModalDesc')}</div>
        <div style={{ background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, padding: '8px 12px', fontSize: 11, color: Z.muted, fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {fakeUrl}
        </div>
        <Btn variant={copied ? 'emerald' : 'primary'} onClick={copy} style={{ justifyContent: 'center' }}>
          {copied ? t('shareCopied') : t('shareCopyBtn')}
        </Btn>
        <div style={{ fontSize: 11, color: Z.muted }}>{t('shareNote')}</div>
      </div>
    </ModalShell>
  )
}

// ─── AI PARSER MODAL ─────────────────────────────────────────────────────────
function AIParserModal({ open, onClose, onConfirm, addLog }) {
  const { t } = useLang()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const parse = async () => {
    if (!text.trim()) return
    setLoading(true)
    addLog(t('aiParseLog'), 'ai')
    await sim(600)
    const parsed = []
    const lines = text.split('\n').filter(l => l.trim())
    lines.forEach(line => {
      const titleMatch    = line.match(/^\d+\.\s+(.+?)\s*[\(（]/)
      const assigneeMatch = line.match(/(?:assignee|담당)[:\s：]+([^\s,()]+)/i)
      const dueDateMatch  = line.match(/(?:due|마감)[:\s：]+([\d\-]+)/i)
      const priEnMatch    = line.match(/priority[:\s：]+(high|medium|low)/i)
      const priKoMatch    = line.match(/우선순위[:\s：]+(높음|보통|낮음)/)
      const stgEnMatch    = line.match(/(planning|design|publishing|dev)\s*stage/i)
      const stgKoMatch    = line.match(/(기획|디자인|퍼블|개발)\s*단계/)
      const priKoMap = { '높음':'high','보통':'medium','낮음':'low' }
      const stgKoMap = { '기획':'planning','디자인':'design','퍼블':'publishing','개발':'dev' }
      const priority = priEnMatch ? priEnMatch[1].toLowerCase() : priKoMatch ? priKoMap[priKoMatch[1]] : 'medium'
      const stage    = stgEnMatch ? stgEnMatch[1].toLowerCase()  : stgKoMatch ? stgKoMap[stgKoMatch[1]] : 'planning'
      if (titleMatch || (assigneeMatch && dueDateMatch)) {
        parsed.push({ id: ++nextTaskId, title: titleMatch ? titleMatch[1].trim() : `Task #${parsed.length+1}`, assignee: assigneeMatch ? assigneeMatch[1] : t('fallbackAssignee'), dueDate: dueDateMatch ? dueDateMatch[1] : '', priority, stage, rowNum: nextTaskId, published: false, desc: '', comments: [] })
      }
    })
    if (!parsed.length) parsed.push({ id: ++nextTaskId, title: t('fallbackTaskTitle'), assignee: t('fallbackAssignee'), dueDate: '2026-07-31', priority: 'medium', stage: 'planning', rowNum: nextTaskId, published: false, desc: '', comments: [] })
    setResults(parsed)
    addLog(t('aiParsedLog')(parsed.length), 'ai')
    setLoading(false)
  }

  const confirm = async () => {
    addLog(t('aiAppendLog')(results.length), 'info')
    await sim(500)
    addLog(t('aiAppendDoneLog')(results.length), 'success')
    onConfirm(results)
    setText(''); setResults(null); onClose()
  }
  const close = () => { setText(''); setResults(null); onClose() }

  if (!open) return null
  return (
    <ModalShell onClose={close} maxWidth={640}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${Z.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{t('aiModalTitle')}</div>
          <div style={{ fontSize: 11, color: Z.muted, marginTop: 2 }}>{t('aiModalSubtitle')}</div>
        </div>
        <Btn variant="ghost" small onClick={close}>✕</Btn>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {!results ? (
          <>
            <div style={{ fontSize: 12, color: Z.muted, marginBottom: 8 }}>{t('aiModalHint')}</div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t('sampleMinutes')} rows={10}
              style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 8, color: Z.text, fontSize: 12, padding: 12, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            <div style={{ marginTop: 12 }}>
              <Btn variant="ghost" small onClick={() => setText(t('sampleMinutes'))}>{t('aiLoadSample')}</Btn>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 12, color: Z.muted, marginBottom: 12 }}>{t('aiExtracted')(results.length)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {results.map((task, i) => (
                <div key={task.id} style={{ background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{i+1}. {task.title}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, color: Z.muted }}>
                    <span>{t('aiStageLabel')}: <span style={{ color: Z.indigo }}>{task.stage}</span></span>
                    <span>{t('aiAssigneeLabel')}: {task.assignee}</span>
                    <span>{t('aiDueDateLabel')}: {task.dueDate}</span>
                    <PriorityBadge priorityKey={task.priority} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '16px 24px', borderTop: `1px solid ${Z.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        {!results ? (
          <><Btn variant="ghost" onClick={close}>{t('aiCancel')}</Btn><Btn variant="primary" onClick={parse} disabled={loading || !text.trim()}>{loading ? t('aiAnalyzing') : t('aiAnalyzeBtn')}</Btn></>
        ) : (
          <><Btn variant="ghost" onClick={() => setResults(null)}>{t('aiReEnter')}</Btn><Btn variant="emerald" onClick={confirm}>{t('aiConfirm')}</Btn></>
        )}
      </div>
    </ModalShell>
  )
}

// ─── TASK CARD ────────────────────────────────────────────────────────────────
function TaskCard({ task, isMobile, onStageChange, onPublish, onDelete, onDetail, addLog, stageLabel }) {
  const { t } = useLang()
  const stageIdx = STAGE_KEYS.indexOf(task.stage)

  const moveStage = async (dir) => {
    const nk = STAGE_KEYS[stageIdx + dir]; if (!nk) return
    addLog(t('sheetReqLog')(task.rowNum, stageLabel(nk)), 'info')
    onStageChange(task.id, nk)
    sim(350).then(() => addLog(t('sheetDoneLog')(task.rowNum, stageLabel(nk)), 'success'))
  }

  return (
    <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <div onClick={() => onDetail(task)} style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4, flex: 1, cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = Z.indigo}
          onMouseLeave={e => e.currentTarget.style.color = Z.text}
        >{task.title}</div>
        <button onClick={() => onDelete(task.id)} title={t('deleteTask')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: Z.muted, fontSize: 11, padding: '1px 4px', borderRadius: 4, flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = Z.red}
          onMouseLeave={e => e.currentTarget.style.color = Z.muted}
        >✕</button>
      </div>
      {/* Meta */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontSize: 11, color: Z.muted }}>
        {task.assignee && <span>👤 {task.assignee}</span>}
        {task.dueDate  && <span>📅 {task.dueDate}</span>}
        <PriorityBadge priorityKey={task.priority} />
        {task.published && <Badge color={Z.emerald}>{t('publishedBadge')}</Badge>}
        {(task.comments?.length > 0) && <span style={{ color: Z.muted }}>💬 {task.comments.length}</span>}
      </div>
      {/* Mobile stage controls */}
      {isMobile && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Btn variant="ghost" small onClick={() => moveStage(-1)} disabled={stageIdx === 0} style={{ flex: 1, justifyContent: 'center' }}>{t('prevStage')}</Btn>
          <span style={{ fontSize: 10, color: Z.muted, flexShrink: 0 }}>{stageLabel(task.stage)}</span>
          <Btn variant="ghost" small onClick={() => moveStage(1)} disabled={stageIdx === STAGE_KEYS.length-1} style={{ flex: 1, justifyContent: 'center' }}>{t('nextStage')}</Btn>
        </div>
      )}
      {/* Publish */}
      {task.stage === 'dev' && !task.published && (
        <Btn variant="emerald" small onClick={() => onPublish(task.id)}>{t('publishBtn')}</Btn>
      )}
    </div>
  )
}

// ─── KANBAN VIEW ─────────────────────────────────────────────────────────────
function KanbanView({ tasks, isMobile, onStageChange, onPublish, onDelete, onDetail, onAdd, addLog, stageLabel, totalTaskCount }) {
  const { t } = useLang()
  const [activeStageIdx, setActiveStageIdx] = useState(0)
  const [addingStage, setAddingStage] = useState(null)
  const visibleStages = isMobile ? [STAGE_KEYS[activeStageIdx]] : STAGE_KEYS

  // Empty state when no tasks at all
  if (totalTaskCount === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
        <div style={{ fontSize: 32 }}>⬡</div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{t('emptyStateTitle')}</div>
        <div style={{ fontSize: 13, color: Z.muted }}>{t('emptyStateDesc')}</div>
        <Btn variant="primary" onClick={() => setAddingStage('planning')}>{t('emptyStateAdd')}</Btn>
        <AddTaskModal open={!!addingStage} onClose={() => setAddingStage(null)} onAdd={task => { onAdd(task); setAddingStage(null) }} defaultStage={addingStage} stageLabel={stageLabel} />
      </div>
    )
  }

  return (
    <div>
      {isMobile && (
        <div style={{ display: 'flex', border: `1px solid ${Z.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
          {STAGE_KEYS.map((key, i) => (
            <button key={key} onClick={() => setActiveStageIdx(i)} style={{
              flex: 1, padding: '8px 4px',
              background: i === activeStageIdx ? Z.indigo+'33' : 'transparent',
              border: 'none', borderRight: i < STAGE_KEYS.length-1 ? `1px solid ${Z.border}` : 'none',
              color: i === activeStageIdx ? Z.indigo : Z.muted,
              fontSize: 12, fontWeight: i === activeStageIdx ? 700 : 400, cursor: 'pointer',
            }}>{stageLabel(key)}</button>
          ))}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${STAGE_KEYS.length},1fr)`, gap: 12 }}>
        {visibleStages.map(sk => {
          const col = tasks.filter(task => task.stage === sk)
          return (
            <div key={sk}>
              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${Z.border}` }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: Z.muted }}>{stageLabel(sk)}</span>
                  <span style={{ fontSize: 10, background: Z.border, borderRadius: 10, padding: '1px 7px', color: Z.muted }}>{col.length}</span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.map(task => (
                  <TaskCard key={task.id} task={task} isMobile={isMobile}
                    onStageChange={onStageChange} onPublish={onPublish}
                    onDelete={onDelete} onDetail={onDetail}
                    addLog={addLog} stageLabel={stageLabel} />
                ))}
                {/* + Add task button per column */}
                <button onClick={() => setAddingStage(sk)} style={{
                  border: `1px dashed ${Z.border}`, borderRadius: 8, padding: '9px',
                  background: 'transparent', color: Z.muted, fontSize: 12, cursor: 'pointer',
                  width: '100%', textAlign: 'center', transition: 'border-color .15s, color .15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = Z.indigo; e.currentTarget.style.color = Z.indigo }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = Z.border; e.currentTarget.style.color = Z.muted }}
                >
                  {t('addTask')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <AddTaskModal open={!!addingStage} onClose={() => setAddingStage(null)}
        onAdd={task => { onAdd(task); setAddingStage(null) }}
        defaultStage={addingStage} stageLabel={stageLabel} />
    </div>
  )
}

// ─── INLINE INPUT ────────────────────────────────────────────────────────────
function InlineInput({ value, onChange, type = 'text' }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  if (!editing && val !== value) setVal(value)
  const commit = () => { setEditing(false); if (val !== value) onChange(val) }
  if (editing) {
    return (
      <input autoFocus type={type} value={val} onChange={e => setVal(e.target.value)} onBlur={commit} onKeyDown={e => e.key === 'Enter' && commit()}
        style={{ background: Z.bg, border: `1px solid ${Z.indigo}`, borderRadius: 4, color: Z.text, fontSize: 12, padding: '3px 6px', outline: 'none', width: '100%' }} />
    )
  }
  return (
    <div onClick={() => setEditing(true)} style={{ padding: '3px 6px', borderRadius: 4, cursor: 'text', fontSize: 12, minHeight: 22, border: '1px solid transparent', transition: 'border-color .1s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = Z.border}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
    >
      {value || <span style={{ color: Z.muted }}>—</span>}
    </div>
  )
}

// ─── SPREADSHEET VIEW ────────────────────────────────────────────────────────
function SpreadsheetView({ tasks, onUpdateTask, onDeleteTask, onAddTask, addLog, stageLabel }) {
  const { t } = useLang()
  const stageOptions    = STAGE_KEYS.map(k => ({ value: k, label: stageLabel(k) }))
  const priorityOptions = PRIORITY_KEYS.map(k => ({ value: k, label: t(`priority.${k}`) }))
  const [addModal, setAddModal] = useState(false)

  const update = async (id, field, value) => {
    addLog(t('inlineEditLog')(id, field, value), 'info')
    onUpdateTask(id, field, value)
    sim(300).then(() => addLog(t('sheetSyncLog')(id, field), 'success'))
  }

  const cols = [t('colNum'), t('colTitle'), t('colStage'), t('colAssignee'), t('colDueDate'), t('colPriority'), t('colActions')]

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${Z.border}` }}>
              {cols.map(c => (
                <th key={c} style={{ padding: '8px 10px', textAlign: 'left', color: Z.muted, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr key={task.id} style={{ borderBottom: `1px solid ${Z.border}`, transition: 'background .1s' }}
                onMouseEnter={e => e.currentTarget.style.background = Z.surface}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '6px 10px', color: Z.muted }}>{i+1}</td>
                <td style={{ padding: '4px 6px', minWidth: 180 }}><InlineInput value={task.title} onChange={v => update(task.id,'title',v)} /></td>
                <td style={{ padding: '4px 6px' }}><Select value={task.stage} onChange={v => update(task.id,'stage',v)} options={stageOptions} /></td>
                <td style={{ padding: '4px 6px', minWidth: 80 }}><InlineInput value={task.assignee} onChange={v => update(task.id,'assignee',v)} /></td>
                <td style={{ padding: '4px 6px', minWidth: 100 }}><InlineInput value={task.dueDate} onChange={v => update(task.id,'dueDate',v)} type="date" /></td>
                <td style={{ padding: '4px 6px' }}><Select value={task.priority} onChange={v => update(task.id,'priority',v)} options={priorityOptions} /></td>
                <td style={{ padding: '4px 6px' }}>
                  <button onClick={() => onDeleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: Z.muted, fontSize: 12, padding: '2px 6px', borderRadius: 4 }}
                    onMouseEnter={e => e.currentTarget.style.color = Z.red}
                    onMouseLeave={e => e.currentTarget.style.color = Z.muted}
                  >✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* + Add row */}
      <button onClick={() => setAddModal(true)} style={{
        marginTop: 8, width: '100%', padding: '8px', border: `1px dashed ${Z.border}`,
        background: 'transparent', color: Z.muted, fontSize: 12, borderRadius: 6, cursor: 'pointer',
        transition: 'border-color .15s, color .15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = Z.indigo; e.currentTarget.style.color = Z.indigo }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = Z.border; e.currentTarget.style.color = Z.muted }}
      >
        {t('addRow')}
      </button>
      <AddTaskModal open={addModal} onClose={() => setAddModal(false)}
        onAdd={task => { onAddTask(task); setAddModal(false) }}
        defaultStage="planning" stageLabel={stageLabel} />
    </div>
  )
}

// ─── AUTOPRESS VIEW ──────────────────────────────────────────────────────────
function AutopressView({ tasks, addLog }) {
  const { t } = useLang()
  const [selected, setSelected] = useState(null)
  const [article, setArticle] = useState(null)
  const [generating, setGenerating] = useState(false)
  const published = tasks.filter(tk => tk.published)

  const genArticle = async (task) => {
    setSelected(task); setGenerating(true); setArticle(null)
    addLog(t('autopressLog')(task.title), 'ai')
    await sim(700)
    const slug = task.title.replace(/\s+/g,'-').toLowerCase()
    const md = `# ${task.title} — ${t('articleHeading')}

**${t('articleAssignee')}:** ${task.assignee}
**${t('articleCompleted')}:** ${task.dueDate}
**${t('articlePriority')}:** ${t(`priority.${task.priority}`)}

## ${t('articleSummary')}
${t('articleSummaryBody')(task.title)}

## ${t('articleWork')}
- ${t('articleWork1')}
- ${t('articleWork2')}
- ${t('articleWork3')}
- ${t('articleWork4')}

## ${t('articleInsights')}
${t('articleInsightsBody')(task.assignee, task.dueDate)}

---
*taskflow.io/blog/${slug}*`
    setArticle(md)
    addLog(t('autopressDoneLog'), 'success')
    setGenerating(false)
  }

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: '0 0 220px', minWidth: 180 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, marginBottom: 10, letterSpacing: 1 }}>{t('publishedTasks')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {published.length === 0 && <div style={{ color: Z.muted, fontSize: 12 }}>{t('publishHint')}</div>}
          {published.map(task => (
            <div key={task.id} onClick={() => genArticle(task)} style={{ background: selected?.id===task.id ? `${Z.indigo}22` : Z.surface, border: `1px solid ${selected?.id===task.id ? Z.indigo : Z.border}`, borderRadius: 8, padding: '10px 12px', cursor: 'pointer', transition: 'border-color .15s' }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{task.title}</div>
              <div style={{ fontSize: 11, color: Z.muted, marginTop: 3 }}>{task.assignee} · {task.dueDate}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {generating && <div style={{ color: Z.indigo, fontSize: 13, padding: 20 }}>{t('articleGenerating')}</div>}
        {article && !generating && (
          <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: Z.emerald, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>{t('articleLabel')}</div>
            <pre style={{ fontFamily: 'inherit', fontSize: 12, color: Z.text, whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.7 }}>{article}</pre>
          </div>
        )}
        {!article && !generating && (
          <div style={{ border: `1px dashed ${Z.border}`, borderRadius: 8, padding: 40, textAlign: 'center', color: Z.muted, fontSize: 12 }}>{t('articleHint')}</div>
        )}
      </div>
    </div>
  )
}

// ─── SETTINGS VIEW ───────────────────────────────────────────────────────────
function SettingsView({ user, stageLabels, setStageLabels }) {
  const { t } = useLang()
  const [isPublic, setIsPublic]         = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [autoSync, setAutoSync]         = useState(true)
  const [localLabels, setLocalLabels]   = useState({ ...stageLabels })
  const [saved, setSaved]               = useState(false)
  const [inviteEmail, setInviteEmail]   = useState('')
  const [inviteSent, setInviteSent]     = useState(false)

  const toggleItems = [
    { label: t('settingCrawlerLabel'), desc: t('settingCrawlerDesc'), value: isPublic,       set: setIsPublic },
    { label: t('settingSyncLabel'),    desc: t('settingSyncDesc'),    value: autoSync,        set: setAutoSync },
    { label: t('settingNotifLabel'),   desc: t('settingNotifDesc'),   value: notifications,   set: setNotifications },
  ]

  const saveLabels = () => {
    setStageLabels({ ...localLabels })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }
  const resetLabels = () => { setLocalLabels({}); setStageLabels({}) }

  const sendInvite = () => {
    if (!inviteEmail.trim()) return
    setInviteSent(true)
    setTimeout(() => { setInviteSent(false); setInviteEmail('') }, 2500)
  }

  return (
    <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Toggles */}
      <div>
        {toggleItems.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < toggleItems.length-1 ? `1px solid ${Z.border}` : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: Z.muted, marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle checked={item.value} onChange={item.set} />
          </div>
        ))}
      </div>

      {/* Pipeline customization (P1) */}
      <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, letterSpacing: 1 }}>{t('pipelineTitle')}</div>
          <Btn variant="ghost" small onClick={resetLabels}>{t('pipelineReset')}</Btn>
        </div>
        <div style={{ fontSize: 11, color: Z.muted, marginBottom: 12 }}>{t('pipelineDesc')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {STAGE_KEYS.map(key => (
            <div key={key}>
              <div style={{ fontSize: 10, color: Z.muted, marginBottom: 3 }}>{key}</div>
              <input value={localLabels[key] ?? ''} onChange={e => setLocalLabels(l => ({ ...l, [key]: e.target.value }))}
                placeholder={t(`stage.${key}`)}
                style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 5, color: Z.text, fontSize: 12, padding: '5px 8px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <Btn variant={saved ? 'emerald' : 'primary'} small onClick={saveLabels}>{saved ? '✓ Saved' : t('pipelineSave')}</Btn>
      </div>

      {/* Invite team (P2) */}
      <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '16px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, marginBottom: 4, letterSpacing: 1 }}>{t('inviteTitle')}</div>
        <div style={{ fontSize: 11, color: Z.muted, marginBottom: 12 }}>{t('inviteDesc')}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendInvite()}
            placeholder={t('inviteEmail')}
            style={{ flex: 1, background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 10px', outline: 'none' }} />
          <Btn variant={inviteSent ? 'emerald' : 'primary'} small onClick={sendInvite} disabled={!inviteEmail.trim()}>
            {inviteSent ? t('inviteSent') : t('inviteSend')}
          </Btn>
        </div>
      </div>

      {/* Connected account */}
      <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, marginBottom: 8, letterSpacing: 1 }}>{t('connectedAccount')}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: Z.indigo+'44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: Z.indigo }}>
            {user?.name?.[0] ?? 'G'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name ?? 'Guest'}</div>
            <div style={{ fontSize: 11, color: Z.muted }}>{user?.email ?? '—'}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Badge color={user?.sandbox ? Z.amber : Z.emerald}>{user?.sandbox ? 'Sandbox' : t('driveConnected')}</Badge>
          </div>
        </div>
        <div style={{ marginTop: 10, fontSize: 10, color: Z.muted, padding: '6px 8px', background: Z.bg, borderRadius: 4 }}>{t('scopeInfo')}</div>
      </div>
    </div>
  )
}

// ─── WORKSPACE ───────────────────────────────────────────────────────────────
// ─── TUTORIAL ────────────────────────────────────────────────────────────────
function TutorialModal({ open, onClose }) {
  const { t } = useLang()
  const [step, setStep] = useState(0)
  const steps = t('tutorialSteps')
  if (!open) return null
  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <>
      <Overlay onClick={onClose} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, pointerEvents: 'none' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 12, width: '100%', maxWidth: 420, overflow: 'hidden', pointerEvents: 'auto' }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: Z.border }}>
          <div style={{ height: '100%', width: `${((step + 1) / steps.length) * 100}%`, background: Z.emerald, transition: 'width .3s' }} />
        </div>
        <div style={{ padding: '28px 28px 24px' }}>
          {/* Step counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: Z.muted, fontWeight: 700, letterSpacing: 1 }}>{t('tutorialTitle').toUpperCase()}</span>
            <span style={{ fontSize: 11, color: Z.muted }}>{step + 1} / {steps.length}</span>
          </div>
          {/* Icon + content */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${Z.emerald}22`, border: `1px solid ${Z.emerald}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
              {current.icon}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, letterSpacing: -0.3 }}>{current.title}</div>
              <div style={{ fontSize: 13, color: Z.muted, lineHeight: 1.6 }}>{current.body}</div>
            </div>
          </div>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
            {steps.map((_, i) => (
              <div key={i} onClick={() => setStep(i)} style={{ width: i === step ? 16 : 6, height: 6, borderRadius: 3, background: i === step ? Z.emerald : Z.border, transition: 'all .2s', cursor: 'pointer' }} />
            ))}
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: Z.muted, fontSize: 12, cursor: 'pointer', padding: '6px 0' }}>{t('tutorialSkip')}</button>
            <div style={{ display: 'flex', gap: 8 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{ background: Z.surface, border: `1px solid ${Z.border}`, color: Z.text, borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t('tutorialPrev')}</button>
              )}
              <button
                onClick={() => isLast ? onClose() : setStep(s => s + 1)}
                style={{ background: Z.emerald, border: 'none', color: '#052e16', borderRadius: 7, padding: '7px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
              >
                {isLast ? t('tutorialDone') : t('tutorialNext')}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

function Workspace({ user, onSignOut, onSignIn, isMobile }) {
  const { t } = useLang()
  const [tasks, setTasks]           = useState(INITIAL_TASKS)
  const [activeTab, setActiveTab]   = useState('kanban')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [aiOpen, setAiOpen]         = useState(false)
  const [shareOpen, setShareOpen]       = useState(false)
  const [detailTask, setDetailTask]     = useState(null)
  const [toast, setToast]               = useState(null)
  const [tutorialOpen, setTutorialOpen] = useState(!user?.sandbox)
  // P1: customizable pipeline labels
  const [stageLabels, setStageLabels] = useState({})
  const stageLabel = useCallback(key => stageLabels[key] || t(`stage.${key}`), [stageLabels, t])

  const [logs, setLogs] = useState(() => [
    makeLog(t('initLog1'), 'success'),
    makeLog(t('initLog2'), 'success'),
    makeLog(t('initLog3'), 'info'),
  ])
  const [newLogCount, setNewLogCount] = useState(0)
  const drawerRef = useRef(false)
  useEffect(() => { drawerRef.current = drawerOpen }, [drawerOpen])

  const addLog = useCallback((msg, type = 'info') => {
    setLogs(prev => [...prev, makeLog(msg, type)])
    if (!drawerRef.current) setNewLogCount(n => n+1)
  }, [])

  const openDrawer = () => { setDrawerOpen(true); setNewLogCount(0) }

  const onStageChange = (id, sk) => setTasks(prev => prev.map(tk => tk.id===id ? { ...tk, stage: sk } : tk))
  const onUpdateTask  = (id, field, val) => setTasks(prev => prev.map(tk => tk.id===id ? { ...tk, [field]: val } : tk))
  const onAddTask     = (task) => { setTasks(prev => [...prev, task]); addLog(`New task added: "${task.title}"`, 'success') }

  const onDeleteTask = (id) => {
    const task = tasks.find(tk => tk.id === id)
    setTasks(prev => prev.filter(tk => tk.id !== id))
    addLog(t('deleteLog')(task.title), 'info')
  }

  const onPublish = async (id) => {
    const task = tasks.find(tk => tk.id===id)
    addLog(t('publishReqLog')(task.title), 'ai')
    setTasks(prev => prev.map(tk => tk.id===id ? { ...tk, published: true } : tk))
    await sim(400)
    addLog(t('publishDoneLog')(task.title.replace(/\s+/g,'-').toLowerCase()), 'success')
  }

  const onDetailUpdate = (updated) => {
    setTasks(prev => prev.map(tk => tk.id===updated.id ? updated : tk))
    addLog(t('sheetSyncLog')(updated.id, 'details'), 'success')
  }

  const onAIConfirm = (newTasks) => setTasks(prev => [...prev, ...newTasks])

  const tabs = [
    { id: 'kanban',   label: t('tabKanban'),   icon: '⬡' },
    { id: 'sheet',    label: t('tabSheet'),    icon: '⊞' },
    { id: 'blog',     label: t('tabPublish'),  icon: '↑' },
    { id: 'settings', label: t('tabSettings'), icon: '⚙' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Sandbox banner (P0) */}
      {user?.sandbox && (
        <div style={{ background: `${Z.amber}22`, borderBottom: `1px solid ${Z.amber}44`, padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 12 }}>
          <span style={{ color: Z.amber }}>{t('sandboxBanner')}</span>
          <button onClick={onSignIn} style={{ background: Z.amber, color: '#451a03', border: 'none', borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            {t('sandboxSignIn')}
          </button>
        </div>
      )}

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${Z.border}`, padding: isMobile ? '10px 16px' : '10px 24px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 20, background: Z.bg }}>
        <div onClick={onSignOut} style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.5, cursor: 'pointer' }}>Task<span style={{ color: Z.emerald }}>Flow</span></div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: activeTab===tab.id ? Z.border : 'transparent', color: activeTab===tab.id ? Z.text : Z.muted, fontSize: 12, fontWeight: activeTab===tab.id ? 600 : 400, transition: 'all .15s' }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <LangToggle />
          {!isMobile && <Btn variant="ghost" small onClick={() => setTutorialOpen(true)}>{t('tutorialBtn')}</Btn>}
          {!isMobile && <Btn variant="default" small onClick={() => setShareOpen(true)}>{t('shareBtn')}</Btn>}
          <Btn variant="primary" small onClick={() => setAiOpen(true)}>{t('aiParserBtn')}</Btn>
          <button onClick={openDrawer} style={{ position: 'relative', background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 6, padding: '5px 10px', cursor: 'pointer', color: Z.muted, fontSize: 11, fontWeight: 700 }}>
            {t('syncLogBtn')}
            {newLogCount > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: Z.emerald, color: '#052e16', borderRadius: 10, fontSize: 9, padding: '1px 5px', fontWeight: 800 }}>{newLogCount}</span>
            )}
          </button>
          {!isMobile && <Btn variant="ghost" small onClick={onSignOut}>{t('signOut')}</Btn>}
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: isMobile ? '16px 16px 80px' : '24px', maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {activeTab === 'kanban' && (
          <KanbanView tasks={tasks} isMobile={isMobile}
            onStageChange={onStageChange} onPublish={onPublish}
            onDelete={onDeleteTask} onDetail={setDetailTask}
            onAdd={onAddTask} addLog={addLog}
            stageLabel={stageLabel} totalTaskCount={tasks.length} />
        )}
        {activeTab === 'sheet' && (
          <SpreadsheetView tasks={tasks} onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask} onAddTask={onAddTask}
            addLog={addLog} stageLabel={stageLabel} />
        )}
        {activeTab === 'blog'     && <AutopressView tasks={tasks} addLog={addLog} />}
        {activeTab === 'settings' && <SettingsView user={user} stageLabels={stageLabels} setStageLabels={setStageLabels} />}
      </main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: Z.surface, borderTop: `1px solid ${Z.border}`, display: 'flex', zIndex: 30, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '10px 4px 8px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: activeTab===tab.id ? Z.indigo : Z.muted, fontSize: 18 }}>
              <span>{tab.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600 }}>{tab.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Modals & drawers */}
      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} logs={logs} />
      <AIParserModal open={aiOpen} onClose={() => setAiOpen(false)} onConfirm={onAIConfirm} addLog={addLog} />
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      <TaskDetailModal task={detailTask} open={!!detailTask} onClose={() => setDetailTask(null)} onUpdate={onDetailUpdate} stageLabel={stageLabel} />
      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  )
}

// ─── LANDING WIDGETS ─────────────────────────────────────────────────────────

function SyncShowcase() {
  const { t } = useLang()
  const [stages, setStages]     = useState([0, 1, 3])
  const [activeCell, setActiveCell] = useState(null)
  const [apiLogs, setApiLogs]   = useState([])
  const demoCards = [{ id: 1, title: 'Planning Doc' }, { id: 2, title: 'UI Design' }, { id: 3, title: 'Frontend Dev' }]
  const clickCard = (i) => {
    const next = (stages[i]+1)%4
    const label = t(`stage.${STAGE_KEYS[next]}`)
    setStages(prev => { const a=[...prev]; a[i]=next; return a })
    setActiveCell(i)
    setApiLogs(prev => [{ id: Date.now(), msg: `PUT /v4/spreadsheets row${i+2} col C → "${label}" 200 OK` }, ...prev.slice(0,3)])
    setTimeout(() => setActiveCell(null), 600)
  }
  return (
    <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 16 }}>{t('syncTitle')}</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 130 }}>
          <div style={{ fontSize: 10, color: Z.muted, marginBottom: 8 }}>{t('syncKanban')}</div>
          {demoCards.map((c,i) => (
            <div key={c.id} onClick={() => clickCard(i)} style={{ background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, padding: '8px 10px', cursor: 'pointer', fontSize: 12, marginBottom: 6 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = Z.emerald}
              onMouseLeave={e => e.currentTarget.style.borderColor = Z.border}
            >
              <div style={{ fontWeight: 600 }}>{c.title}</div>
              <div style={{ fontSize: 10, color: Z.emerald, marginTop: 2 }}>{t(`stage.${STAGE_KEYS[stages[i]]}`)}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 130 }}>
          <div style={{ fontSize: 10, color: Z.muted, marginBottom: 8 }}>{t('syncSheet')}</div>
          <table style={{ fontSize: 11, borderCollapse: 'collapse', width: '100%' }}>
            <thead><tr>
              <th style={{ color: Z.muted, textAlign: 'left', padding: '3px 6px', fontWeight: 600 }}>{t('syncColTitle')}</th>
              <th style={{ color: Z.muted, textAlign: 'left', padding: '3px 6px', fontWeight: 600 }}>{t('syncColStage')}</th>
            </tr></thead>
            <tbody>
              {demoCards.map((c,i) => (
                <tr key={c.id} style={{ background: activeCell===i ? `${Z.emerald}22` : 'transparent', transition: 'background .3s' }}>
                  <td style={{ padding: '4px 6px', borderBottom: `1px solid ${Z.border}` }}>{c.title}</td>
                  <td style={{ padding: '4px 6px', borderBottom: `1px solid ${Z.border}`, color: activeCell===i ? Z.emerald : Z.text, fontWeight: activeCell===i ? 700 : 400, transition: 'color .3s' }}>
                    {t(`stage.${STAGE_KEYS[stages[i]]}`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {apiLogs.length > 0 && (
        <div style={{ marginTop: 12, background: Z.bg, borderRadius: 6, padding: '8px 10px', fontFamily: 'monospace', fontSize: 10, color: Z.emerald, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {apiLogs.map(l => <div key={l.id}>› {l.msg}</div>)}
        </div>
      )}
    </div>
  )
}

function AIDemo() {
  const { t } = useLang()
  const [text, setText]     = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const run = async () => {
    setLoading(true)
    await sim(800)
    setResults([
      { title: 'Notification System Refactor', stage: 'planning', priority: 'high' },
      { title: 'Dark Mode Toggle',             stage: 'design',   priority: 'medium' },
    ])
    setLoading(false)
  }
  return (
    <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 12 }}>{t('aiDemoTitle')}</div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder={t('aiDemoPlaceholder')} rows={4}
        style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: 10, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Btn variant="ghost" small onClick={() => { setText(t('sampleMinutes')); setResults(null) }}>{t('aiSample')}</Btn>
        <Btn variant="primary" small onClick={run} disabled={loading}>{loading ? t('aiAnalyzing') : t('aiAnalyze')}</Btn>
      </div>
      {results && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map((r,i) => (
            <div key={i} style={{ background: Z.bg, border: `1px solid ${Z.indigo}44`, borderRadius: 6, padding: '8px 10px', fontSize: 11 }}>
              <span style={{ fontWeight: 700, color: Z.indigo }}>◆</span>{' '}
              {r.title} · {t(`stage.${r.stage}`)} · <PriorityBadge priorityKey={r.priority} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({ onSignIn, onSandbox }) {
  const { t } = useLang()
  const [signingIn, setSigningIn] = useState(false)
  const handleSignIn = async () => {
    setSigningIn(true)
    await sim(900)
    onSignIn({ name: t('demoUserName'), email: t('demoUserEmail') })
  }
  const features = [
    { icon: '⬡', title: t('feat1Title'), desc: t('feat1Desc') },
    { icon: '◆', title: t('feat2Title'), desc: t('feat2Desc') },
    { icon: '↑', title: t('feat3Title'), desc: t('feat3Desc') },
    { icon: '🔒', title: t('feat4Title'), desc: t('feat4Desc') },
  ]
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 80px' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: `1px solid ${Z.border}`, marginBottom: 64, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>Task<span style={{ color: Z.emerald }}>Flow</span></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LangToggle />
          <Btn variant="ghost" onClick={onSandbox}>{t('tryGuest')}</Btn>
          <Btn variant="emerald" onClick={handleSignIn} disabled={signingIn}>{signingIn ? t('signingIn') : t('signInGoogle')}</Btn>
        </div>
      </nav>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 72 }}>
        <div style={{ display: 'inline-block', background: `${Z.indigo}22`, border: `1px solid ${Z.indigo}44`, borderRadius: 20, padding: '4px 14px', fontSize: 11, color: Z.indigo, fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>
          {t('heroPill')}
        </div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, margin: '0 0 20px' }}>
          {t('heroTitle1')}<br />
          <span style={{ color: Z.emerald }}>{t('heroTitle2')}</span>
        </h1>
        <p style={{ fontSize: 15, color: Z.muted, maxWidth: 520, margin: '0 auto 32px' }}>{t('heroBody')}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
          <Btn variant="emerald" onClick={handleSignIn} disabled={signingIn} style={{ fontSize: 14, padding: '10px 24px' }}>
            {signingIn ? t('signingIn') : t('ctaStart')}
          </Btn>
          {/* P0: sandbox CTA in hero too */}
          <Btn variant="ghost" onClick={onSandbox} style={{ fontSize: 14 }}>{t('tryGuest')}</Btn>
        </div>
        <div style={{ fontSize: 11, color: Z.muted }}>{t('scopeNote')}</div>
      </div>
      {/* Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginBottom: 60 }}>
        <SyncShowcase />
        <AIDemo />
      </div>
      {/* Feature pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
        {features.map(f => (
          <div key={f.title} style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: Z.muted }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang]             = useState('en')
  const [scene, setScene]           = useState('landing')
  const [user, setUser]             = useState(null)
  const [transitioning, setTrans]   = useState(false)
  const [isMobile, setIsMobile]     = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const t = useCallback((key) => {
    const d = TR[lang] ?? TR.en
    return d[key] ?? TR.en[key] ?? key
  }, [lang])

  const enter = async (userData) => {
    setUser(userData); setTrans(true)
    await sim(300)
    setScene('workspace'); setTrans(false)
  }

  const handleSignIn  = (userData) => enter(userData)
  const handleSandbox = () => enter({ name: 'Guest', email: '', sandbox: true })
  const handleSignOut = () => { setScene('landing'); setUser(null) }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <div style={{ fontFamily: "'Inter',system-ui,-apple-system,sans-serif", background: Z.bg, color: Z.text, minHeight: '100vh', fontSize: 14, lineHeight: 1.5, opacity: transitioning ? 0 : 1, transition: 'opacity .3s' }}>
        {scene === 'landing'    && <Landing onSignIn={handleSignIn} onSandbox={handleSandbox} />}
        {scene === 'workspace'  && <Workspace user={user} onSignOut={handleSignOut} onSignIn={() => enter({ name: t('demoUserName'), email: t('demoUserEmail') })} isMobile={isMobile} />}
      </div>
    </LangContext.Provider>
  )
}
