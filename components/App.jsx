'use client'
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import { startOAuthFlow, parseAuthFromURL, clearSession, loadSession, findOrCreateSpreadsheet, loadTasks, appendTask, updateTaskRow, deleteTaskRow, getSheetId, loadProjects, appendProject, updateProject, deleteProject, getProjectsSheetId, loadSubTasks, appendSubTask, updateSubTaskRow, deleteSubTaskRow, getSubTasksSheetId, loadMembers, appendMember, updateMemberRow, deleteMemberRow, getMembersSheetId } from '../lib/gapi'
import { generateAiPmReport, mapExcelToTasks } from '../lib/aipm'
import { exportTasksToExcel, parseExcelFile } from '../lib/excel'

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const DARK = {
  bg:      '#09090b',
  surface: '#18181b',
  border:  '#27272a',
  text:    '#f4f4f5',
  muted:   '#71717a',
  emerald: '#10b981',
  indigo:  '#6366f1',
  red:     '#ef4444',
  amber:   '#f59e0b',
}

const LIGHT = {
  bg:      '#f8fafc',
  surface: '#ffffff',
  border:  '#e2e8f0',
  text:    '#0f172a',
  muted:   '#64748b',
  emerald: '#059669',
  indigo:  '#4f46e5',
  red:     '#dc2626',
  amber:   '#d97706',
}

// ─── THEME CONTEXT ───────────────────────────────────────────────────────────
const ThemeCtx = createContext(DARK)
const useTheme = () => useContext(ThemeCtx)

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
    // workspace — tabs
    tabProjects: 'Projects',
    tabKanban:   'Kanban',
    tabSheet:    'Sheet',
    tabMyTasks:  'My Tasks',
    tabPublish:  'Publish',
    tabSettings: 'Settings',
    // projects view
    projectsTitle:    'Projects',
    newProject:       '+ New Project',
    projectTasks:     (n) => `${n} task${n !== 1 ? 's' : ''}`,
    editProject:      'Edit',
    deleteProject:    'Delete',
    projectModalNew:  'New Project',
    projectModalEdit: 'Edit Project',
    projectName:      'Project Name',
    projectDesc:      'Description',
    projectColor:     'Color',
    saveProject:      'Save',
    allProjects:      'All Projects',
    confirmDeleteProject: 'Delete this project? Tasks will remain.',
    // my tasks view
    myTasksTitle: 'My Tasks',
    myTasksEmpty: 'No tasks assigned to you',
    myTasksDueSoon: 'Due soon',
    // kanban filters
    filterAssignee: 'Assignee',
    filterPriority: 'Priority',
    filterSort:     'Sort',
    filterAll:      'All',
    sortDefault:    'Default',
    sortDueDate:    'Due Date',
    sortPriority:   'Priority',
    clearFilters:   'Clear',
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
    // P1 features
    subtasks:        'Subtasks',
    addSubtask:      'Add subtask',
    labels:          'Labels',
    manageLabels:    'Manage labels',
    keyTask:         'Key task',
    keyTasksOnly:    'Key tasks only',
    labelName:       'Label name',
    labelColor:      'Color',
    addLabel:        'Add label',
    noLabels:        'No labels yet',
    // P2 team members
    tabTeam:          'Team',
    addMember:        'Add member',
    memberRole:       'Role',
    jobTitle:         'Job title',
    responsibilities: 'Responsibilities',
    workStyle:        'Work style',
    editProfile:      'Edit profile',
    addComment:       'Add comment',
    noMembers:        'No members yet',
    memberNotFound:   'No registered user found with this email',
    emailPlaceholder: 'Enter email address',
    searchMember:     'Search & add',
    // P3 AI PM
    tabAiPm:        'AI PM',
    generateReport: 'Generate Report',
    copyReport:     'Copy',
    sendSlack:      'Send to Slack',
    slackWebhook:   'Slack Webhook URL',
    reportHistory:  'Report History',
    generating:     'Generating...',
    noApiKey:       'Set NEXT_PUBLIC_GEMINI_API_KEY to use AI PM',
    // P4 Gantt + Excel
    gantt:          'Gantt',
    exportExcel:    'Export Excel',
    importExcel:    'Import Excel',
    analyzeWithAi:  'Analyze with AI',
    analyzing:      'Analyzing...',
    previewImport:  'Preview',
    importTasks:    (n) => `Import ${n} tasks`,
    importSuccess:  'Imported successfully',
    dropOrClick:    'Drop Excel file here or click to browse',
    noGeminiKey:    'Set NEXT_PUBLIC_GEMINI_API_KEY to use AI import',
    zoomWeek:       'Week',
    zoomMonth:      'Month',
    zoomQuarter:    'Quarter',
    noDateTasks:    'Tasks without dates are not shown',
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
    tabProjects: '프로젝트',
    tabKanban:   '칸반',
    tabSheet:    '시트',
    tabMyTasks:  '내 태스크',
    tabPublish:  '발행',
    tabSettings: '설정',
    projectsTitle:    '프로젝트',
    newProject:       '+ 새 프로젝트',
    projectTasks:     (n) => `태스크 ${n}개`,
    editProject:      '수정',
    deleteProject:    '삭제',
    projectModalNew:  '새 프로젝트',
    projectModalEdit: '프로젝트 수정',
    projectName:      '프로젝트 이름',
    projectDesc:      '설명',
    projectColor:     '색상',
    saveProject:      '저장',
    allProjects:      '전체 프로젝트',
    confirmDeleteProject: '이 프로젝트를 삭제할까요? 태스크는 유지됩니다.',
    myTasksTitle: '내 태스크',
    myTasksEmpty: '담당 태스크가 없습니다',
    myTasksDueSoon: '마감 임박',
    filterAssignee: '담당자',
    filterPriority: '우선순위',
    filterSort:     '정렬',
    filterAll:      '전체',
    sortDefault:    '기본',
    sortDueDate:    '마감일순',
    sortPriority:   '우선순위순',
    clearFilters:   '초기화',
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
    // P1 features
    subtasks:        '서브태스크',
    addSubtask:      '서브태스크 추가',
    labels:          '라벨',
    manageLabels:    '라벨 관리',
    keyTask:         '핵심 태스크',
    keyTasksOnly:    '핵심 태스크만',
    labelName:       '라벨 이름',
    labelColor:      '색상',
    addLabel:        '라벨 추가',
    noLabels:        '라벨이 없습니다',
    // P2 team members
    tabTeam:          '팀',
    addMember:        '멤버 추가',
    memberRole:       '역할',
    jobTitle:         '직함',
    responsibilities: '담당업무',
    workStyle:        '업무스타일',
    editProfile:      '프로필 편집',
    addComment:       '댓글 추가',
    noMembers:        '멤버가 없습니다',
    memberNotFound:   '이 이메일은 등록된 사용자가 없습니다',
    emailPlaceholder: '이메일 주소 입력',
    searchMember:     '검색 및 추가',
    // P3 AI PM
    tabAiPm:        'AI PM',
    generateReport: '보고서 생성',
    copyReport:     '복사',
    sendSlack:      '슬랙 전송',
    slackWebhook:   '슬랙 웹훅 URL',
    reportHistory:  '보고서 기록',
    generating:     '생성 중...',
    noApiKey:       'AI PM을 사용하려면 NEXT_PUBLIC_GEMINI_API_KEY를 설정하세요',
    // P4 Gantt + Excel
    gantt:          '간트',
    exportExcel:    '엑셀 내보내기',
    importExcel:    '엑셀 가져오기',
    analyzeWithAi:  'AI로 분석',
    analyzing:      '분석 중...',
    previewImport:  '미리보기',
    importTasks:    (n) => `${n}개 태스크 가져오기`,
    importSuccess:  '가져오기 완료',
    dropOrClick:    '엑셀 파일을 여기 드롭하거나 클릭하여 선택',
    noGeminiKey:    'AI 가져오기를 사용하려면 NEXT_PUBLIC_GEMINI_API_KEY를 설정하세요',
    zoomWeek:       '주',
    zoomMonth:      '월',
    zoomQuarter:    '분기',
    noDateTasks:    '날짜 없는 태스크는 표시되지 않습니다',
  },
}

// ─── LANG CONTEXT ────────────────────────────────────────────────────────────
const LangContext = createContext(null)
const useLang = () => useContext(LangContext)

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STAGE_KEYS    = ['planning', 'design', 'publishing', 'dev']
const PRIORITY_KEYS = ['high', 'medium', 'low']
let nextTaskId = 100
let nextMemberId = 1000

const INITIAL_TASKS = [
  { id: 1,  title: 'Homepage Renewal Planning',     stage: 'planning',   assignee: 'Alex',   dueDate: '2026-06-10', priority: 'high',   rowNum: 2, published: false, desc: '', comments: [], projectId: '', labelIds: [], isKeyTask: false },
  { id: 2,  title: 'Login UI Wireframe',            stage: 'design',     assignee: 'Jordan', dueDate: '2026-06-15', priority: 'medium', rowNum: 3, published: false, desc: '', comments: [], projectId: '', labelIds: [], isKeyTask: false },
  { id: 3,  title: 'Main Landing Publishing',       stage: 'publishing', assignee: 'Sam',    dueDate: '2026-06-20', priority: 'medium', rowNum: 4, published: false, desc: '', comments: [], projectId: '', labelIds: [], isKeyTask: false },
  { id: 4,  title: 'API Auth Module',               stage: 'dev',        assignee: 'Casey',  dueDate: '2026-06-25', priority: 'high',   rowNum: 5, published: false, desc: '', comments: [], projectId: '', labelIds: [], isKeyTask: false },
  { id: 5,  title: 'Dashboard Component Design',    stage: 'planning',   assignee: 'Morgan', dueDate: '2026-07-01', priority: 'low',    rowNum: 6, published: false, desc: '', comments: [], projectId: '', labelIds: [], isKeyTask: false },
  { id: 6,  title: 'Mobile Responsive Design',      stage: 'design',     assignee: 'Jordan', dueDate: '2026-07-05', priority: 'high',   rowNum: 7, published: false, desc: '', comments: [], projectId: '', labelIds: [], isKeyTask: false },
  { id: 7,  title: 'Search Feature Implementation', stage: 'dev',        assignee: 'Alex',   dueDate: '2026-07-10', priority: 'medium', rowNum: 8, published: true,  desc: '', comments: [], projectId: '', labelIds: [], isKeyTask: false },
]

const PROJECT_COLORS = ['#6366f1', '#14b8a6', '#f97316', '#ef4444', '#eab308', '#34d399']

const DEFAULT_LABELS = [
  { id: 'l1', name: 'Bug',     color: '#ef4444' },
  { id: 'l2', name: 'Feature', color: '#6366f1' },
  { id: 'l3', name: 'Design',  color: '#f97316' },
  { id: 'l4', name: 'Docs',    color: '#14b8a6' },
]
const LABEL_PRESET_COLORS = ['#ef4444','#f97316','#eab308','#34d399','#14b8a6','#6366f1','#a855f7','#ec4899']

function loadLabels() {
  try {
    const raw = localStorage.getItem('tf_labels')
    if (raw) return JSON.parse(raw)
  } catch (e) { void e }
  return DEFAULT_LABELS
}
function saveLabels(labels) {
  try { localStorage.setItem('tf_labels', JSON.stringify(labels)) } catch (e) { void e }
}

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
  const Z = useTheme()
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

function Badge({ children, color }) {
  const Z = useTheme()
  if (color === undefined) color = Z.muted
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
  const Z = useTheme()
  const colors = { high: Z.red, medium: Z.amber, low: Z.muted }
  return <Badge color={colors[priorityKey] || Z.muted}>{t(`priority.${priorityKey}`)}</Badge>
}

function Btn({ children, onClick, variant = 'default', small, style, disabled }) {
  const Z = useTheme()
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
  const Z = useTheme()
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
  const Z = useTheme()
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
  const Z = useTheme()
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
  const Z = useTheme()
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
  const Z = useTheme()
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
  const Z = useTheme()
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
              style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 8px', outline: 'none', boxSizing: 'border-box', colorScheme: 'auto' }} />
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

// ─── LABEL MANAGER MODAL ─────────────────────────────────────────────────────
function LabelManagerModal({ open, onClose, labels, setLabels }) {
  const { t } = useLang()
  const Z = useTheme()
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(LABEL_PRESET_COLORS[0])

  const addLabel = () => {
    if (!newName.trim()) return
    const label = { id: `l_${Date.now()}`, name: newName.trim(), color: newColor }
    const updated = [...labels, label]
    setLabels(updated)
    saveLabels(updated)
    setNewName('')
  }

  const deleteLabel = (id) => {
    const updated = labels.filter(l => l.id !== id)
    setLabels(updated)
    saveLabels(updated)
  }

  if (!open) return null
  return (
    <ModalShell onClose={onClose} maxWidth={400}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{t('manageLabels')}</div>
        <Btn variant="ghost" small onClick={onClose}>✕</Btn>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {labels.length === 0 && <div style={{ color: Z.muted, fontSize: 12 }}>{t('noLabels')}</div>}
        {labels.map(l => (
          <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: l.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ flex: 1, fontSize: 13 }}>{l.name}</span>
            <Btn variant="danger" small onClick={() => deleteLabel(l.id)}>✕</Btn>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${Z.border}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: Z.muted, fontWeight: 600 }}>{t('addLabel')}</div>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t('labelName')}
            onKeyDown={e => e.key === 'Enter' && addLabel()}
            style={{ background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 8px', outline: 'none' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LABEL_PRESET_COLORS.map(c => (
              <div key={c} onClick={() => setNewColor(c)} style={{ width: 22, height: 22, borderRadius: 4, background: c, cursor: 'pointer', border: newColor === c ? `2px solid ${Z.text}` : '2px solid transparent', boxSizing: 'border-box' }} />
            ))}
          </div>
          <Btn variant="primary" small onClick={addLabel} disabled={!newName.trim()}>{t('addLabel')}</Btn>
        </div>
      </div>
    </ModalShell>
  )
}

// ─── COMMENT TEXT RENDERER (highlights @mentions) ───────────────────────────
function CommentText({ text }) {
  const Z = useTheme()
  const parts = text.split(/(@\w[\w\s]*?\b)/g)
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('@') ? (
          <span key={i} style={{ color: Z.indigo, fontWeight: 700 }}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

// ─── TASK DETAIL MODAL (P2) ──────────────────────────────────────────────────
function TaskDetailModal({ task, open, onClose, onUpdate, stageLabel, subTasks, onAddSubTask, onToggleSubTask, onUpdateSubTask, onDeleteSubTask, labels, setLabels, projectMembers, currentUser }) {
  const { t } = useLang()
  const Z = useTheme()
  const stageOptions    = STAGE_KEYS.map(k => ({ value: k, label: stageLabel(k) }))
  const priorityOptions = PRIORITY_KEYS.map(k => ({ value: k, label: t(`priority.${k}`) }))
  const [form, setForm] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [newSubtask, setNewSubtask] = useState('')
  const [labelManagerOpen, setLabelManagerOpen] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState('')
  const [mentionQuery, setMentionQuery] = useState(null) // {query, pos}
  const commentInputRef = useRef(null)

  useEffect(() => { if (task) setForm({ ...task }) }, [task])

  if (!open || !form) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const authorName = currentUser?.name || 'You'

  const postComment = () => {
    if (!commentText.trim()) return
    const c = { id: Date.now(), author: authorName, text: commentText.trim(), createdAt: new Date().toISOString() }
    set('comments', [...(form.comments || []), c])
    setCommentText('')
    setMentionQuery(null)
  }

  const deleteComment = (cid) => {
    set('comments', (form.comments || []).filter(c => c.id !== cid))
  }

  const saveEditComment = (cid) => {
    set('comments', (form.comments || []).map(c => c.id === cid ? { ...c, text: editingCommentText } : c))
    setEditingCommentId(null)
  }

  const handleCommentInput = (e) => {
    const val = e.target.value
    setCommentText(val)
    // detect @
    const cursor = e.target.selectionStart
    const textBefore = val.slice(0, cursor)
    const atIdx = textBefore.lastIndexOf('@')
    if (atIdx !== -1 && (atIdx === 0 || /\s/.test(textBefore[atIdx - 1]))) {
      const query = textBefore.slice(atIdx + 1)
      if (!/\s/.test(query)) {
        setMentionQuery({ query, pos: atIdx })
        return
      }
    }
    setMentionQuery(null)
  }

  const insertMention = (name) => {
    if (mentionQuery === null) return
    const before = commentText.slice(0, mentionQuery.pos)
    const after = commentText.slice(mentionQuery.pos + 1 + mentionQuery.query.length)
    const newText = `${before}@${name} ${after}`
    setCommentText(newText)
    setMentionQuery(null)
    commentInputRef.current?.focus()
  }

  const filteredMentionMembers = mentionQuery !== null && projectMembers
    ? projectMembers.filter(m => m.name.toLowerCase().startsWith(mentionQuery.query.toLowerCase()))
    : []

  const save = () => { onUpdate(form); onClose() }

  const addSubtask = () => {
    if (!newSubtask.trim()) return
    const st = { id: `st_${Date.now()}`, taskId: String(task.id), title: newSubtask.trim(), done: false, assignee: '', dueDate: '' }
    onAddSubTask(st)
    setNewSubtask('')
  }

  const toggleLabel = (labelId) => {
    const current = form.labelIds || []
    const next = current.includes(labelId) ? current.filter(id => id !== labelId) : [...current, labelId]
    set('labelIds', next)
  }

  const taskSubTasks = subTasks || []
  const doneCount = taskSubTasks.filter(s => s.done).length
  const totalCount = taskSubTasks.length

  return (
    <>
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
                style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '5px 8px', outline: 'none', boxSizing: 'border-box', colorScheme: 'auto' }} />
            </div>
          </div>
          {/* Labels */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: Z.muted, fontWeight: 700, letterSpacing: 1 }}>{t('labels').toUpperCase()}</div>
              <button onClick={() => setLabelManagerOpen(true)} style={{ background: 'none', border: 'none', color: Z.indigo, fontSize: 11, cursor: 'pointer', padding: 0 }}>{t('manageLabels')}</button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {labels.map(l => {
                const active = (form.labelIds || []).includes(l.id)
                return (
                  <button key={l.id} onClick={() => toggleLabel(l.id)} style={{
                    padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${l.color}44`,
                    background: active ? l.color + '33' : 'transparent',
                    color: active ? l.color : Z.muted,
                    transition: 'all .1s',
                  }}>{l.name}</button>
                )
              })}
            </div>
          </div>
          {/* Description */}
          <div>
            <div style={{ fontSize: 10, color: Z.muted, marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>{t('descLabel').toUpperCase()}</div>
            <textarea value={form.desc || ''} onChange={e => set('desc', e.target.value)} placeholder={t('descPlaceholder')} rows={4}
              style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 13, padding: '8px 10px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          {/* Subtasks */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: Z.muted, fontWeight: 700, letterSpacing: 1 }}>{t('subtasks').toUpperCase()}</div>
              {totalCount > 0 && <span style={{ fontSize: 11, color: Z.muted }}>{doneCount}/{totalCount}</span>}
            </div>
            {/* Progress bar */}
            {totalCount > 0 && (
              <div style={{ height: 4, background: Z.border, borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(doneCount / totalCount) * 100}%`, background: Z.emerald, borderRadius: 2, transition: 'width .3s' }} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {taskSubTasks.map(st => (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, padding: '6px 10px' }}>
                  <input type="checkbox" checked={st.done} onChange={() => onToggleSubTask(st.id)}
                    style={{ accentColor: Z.emerald, width: 14, height: 14, flexShrink: 0, cursor: 'pointer' }} />
                  <span style={{ flex: 1, fontSize: 12, textDecoration: st.done ? 'line-through' : 'none', color: st.done ? Z.muted : Z.text }}>{st.title}</span>
                  <input value={st.assignee} onChange={e => onUpdateSubTask(st.id, 'assignee', e.target.value)}
                    placeholder="assignee" style={{ width: 70, background: 'transparent', border: 'none', color: Z.muted, fontSize: 11, outline: 'none' }} />
                  <input type="date" value={st.dueDate} onChange={e => onUpdateSubTask(st.id, 'dueDate', e.target.value)}
                    style={{ width: 100, background: 'transparent', border: 'none', color: Z.muted, fontSize: 11, outline: 'none', colorScheme: 'auto' }} />
                  <button onClick={() => onDeleteSubTask(st.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: Z.muted, fontSize: 11, padding: '1px 3px' }}
                    onMouseEnter={e => e.currentTarget.style.color = Z.red}
                    onMouseLeave={e => e.currentTarget.style.color = Z.muted}
                  >✕</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSubtask()}
                placeholder={t('addSubtask')}
                style={{ flex: 1, background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 10px', outline: 'none' }} />
              <Btn variant="default" small onClick={addSubtask} disabled={!newSubtask.trim()}>{t('addSubtask')}</Btn>
            </div>
          </div>
          {/* Comments */}
          <div>
            <div style={{ fontSize: 10, color: Z.muted, marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>{t('commentsLabel').toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
              {(form.comments || []).map(c => {
                const isOwn = c.author === authorName
                const timeDisplay = c.createdAt
                  ? new Date(c.createdAt).toLocaleTimeString('en-US', { hour12: false })
                  : (c.time || '')
                return (
                  <div key={c.id} style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: Z.indigo + '44', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: Z.indigo }}>
                      {c.author?.[0] ?? '?'}
                    </div>
                    <div style={{ background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, padding: '6px 10px', flex: 1 }}>
                      <div style={{ fontSize: 10, color: Z.muted, marginBottom: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{c.author} · {timeDisplay}</span>
                        {isOwn && editingCommentId !== c.id && (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => { setEditingCommentId(c.id); setEditingCommentText(c.text) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: Z.muted, fontSize: 10, padding: '1px 3px' }}
                              onMouseEnter={e => e.currentTarget.style.color = Z.indigo}
                              onMouseLeave={e => e.currentTarget.style.color = Z.muted}
                            >Edit</button>
                            <button onClick={() => deleteComment(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: Z.muted, fontSize: 10, padding: '1px 3px' }}
                              onMouseEnter={e => e.currentTarget.style.color = Z.red}
                              onMouseLeave={e => e.currentTarget.style.color = Z.muted}
                            >✕</button>
                          </div>
                        )}
                      </div>
                      {editingCommentId === c.id ? (
                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          <input autoFocus value={editingCommentText} onChange={e => setEditingCommentText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveEditComment(c.id); if (e.key === 'Escape') setEditingCommentId(null) }}
                            style={{ flex: 1, background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 4, color: Z.text, fontSize: 12, padding: '3px 6px', outline: 'none' }} />
                          <Btn variant="primary" small onClick={() => saveEditComment(c.id)}>Save</Btn>
                          <Btn variant="ghost" small onClick={() => setEditingCommentId(null)}>✕</Btn>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12 }}><CommentText text={c.text} /></div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Comment input with @mention */}
            <div style={{ position: 'relative' }}>
              {mentionQuery !== null && filteredMentionMembers.length > 0 && (
                <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 6, zIndex: 20, maxHeight: 140, overflowY: 'auto', marginBottom: 4 }}>
                  {filteredMentionMembers.map(m => (
                    <div key={m.id} onClick={() => insertMention(m.name)}
                      style={{ padding: '7px 12px', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}
                      onMouseEnter={e => e.currentTarget.style.background = Z.bg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: Z.indigo + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: Z.indigo, flexShrink: 0 }}>
                        {m.name[0]}
                      </div>
                      <span style={{ color: Z.indigo, fontWeight: 600 }}>@{m.name}</span>
                      {m.jobTitle && <span style={{ color: Z.muted, fontSize: 11 }}>{m.jobTitle}</span>}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <input ref={commentInputRef} value={commentText} onChange={handleCommentInput}
                  onKeyDown={e => { if (e.key === 'Enter' && !mentionQuery) postComment(); if (e.key === 'Escape') setMentionQuery(null) }}
                  placeholder={t('commentPlaceholder')}
                  style={{ flex: 1, background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 10px', outline: 'none' }} />
                <Btn variant="default" small onClick={postComment}>{t('postComment')}</Btn>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 24px', borderTop: `1px solid ${Z.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn variant="ghost" onClick={onClose}>{t('closeDetail')}</Btn>
          <Btn variant="primary" onClick={save}>{t('saveDetail')}</Btn>
        </div>
      </ModalShell>
      {labelManagerOpen && (
        <LabelManagerModal open={labelManagerOpen} onClose={() => setLabelManagerOpen(false)} labels={labels} setLabels={setLabels} />
      )}
    </>
  )
}

// ─── SHARE MODAL (P0) ────────────────────────────────────────────────────────
function ShareModal({ open, onClose }) {
  const { t } = useLang()
  const Z = useTheme()
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
  const Z = useTheme()
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
function TaskCard({ task, isMobile, onStageChange, onPublish, onDelete, onDetail, onToggleKeyTask, addLog, stageLabel, labels }) {
  const { t } = useLang()
  const Z = useTheme()
  const stageIdx = STAGE_KEYS.indexOf(task.stage)

  const moveStage = async (dir) => {
    const nk = STAGE_KEYS[stageIdx + dir]; if (!nk) return
    addLog(t('sheetReqLog')(task.rowNum, stageLabel(nk)), 'info')
    onStageChange(task.id, nk)
    sim(350).then(() => addLog(t('sheetDoneLog')(task.rowNum, stageLabel(nk)), 'success'))
  }

  const taskLabels = (labels || []).filter(l => (task.labelIds || []).includes(l.id))

  return (
    <div
      draggable={true}
      onDragStart={e => e.dataTransfer.setData('taskId', String(task.id))}
      style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, cursor: 'grab' }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <div onClick={() => onDetail(task)} style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4, flex: 1, cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = Z.indigo}
          onMouseLeave={e => e.currentTarget.style.color = Z.text}
        >{task.title}</div>
        {/* Star (key task) */}
        <button
          onClick={() => onToggleKeyTask && onToggleKeyTask(task.id)}
          title={t('keyTask')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: '1px 3px', flexShrink: 0, color: task.isKeyTask ? Z.amber : Z.muted }}
          onMouseEnter={e => { e.currentTarget.style.color = Z.amber }}
          onMouseLeave={e => { e.currentTarget.style.color = task.isKeyTask ? Z.amber : Z.muted }}
        >⭐</button>
        <button onClick={() => onDelete(task.id)} title={t('deleteTask')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: Z.muted, fontSize: 11, padding: '1px 4px', borderRadius: 4, flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = Z.red}
          onMouseLeave={e => e.currentTarget.style.color = Z.muted}
        >✕</button>
      </div>
      {/* Label badges */}
      {taskLabels.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {taskLabels.map(l => (
            <span key={l.id} style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: l.color + '28', color: l.color, border: `1px solid ${l.color}44` }}>{l.name}</span>
          ))}
        </div>
      )}
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

// ─── PROJECT MODAL ───────────────────────────────────────────────────────────
function ProjectModal({ open, onClose, onSave, initial }) {
  const { t } = useLang()
  const Z = useTheme()
  const [form, setForm] = useState({ name: '', description: '', color: PROJECT_COLORS[0] })
  useEffect(() => {
    if (open) setForm(initial ? { name: initial.name, description: initial.description || '', color: initial.color || PROJECT_COLORS[0] } : { name: '', description: '', color: PROJECT_COLORS[0] })
  }, [open, initial])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const save = () => { if (!form.name.trim()) return; onSave(form); onClose() }
  if (!open) return null
  return (
    <ModalShell onClose={onClose} maxWidth={440}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{initial ? t('projectModalEdit') : t('projectModalNew')}</div>
        <Btn variant="ghost" small onClick={onClose}>✕</Btn>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: Z.muted, marginBottom: 5, fontWeight: 600 }}>{t('projectName')} *</div>
          <input autoFocus value={form.name} onChange={e => set('name', e.target.value)} onKeyDown={e => e.key === 'Enter' && save()}
            style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 13, padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: Z.muted, marginBottom: 5, fontWeight: 600 }}>{t('projectDesc')}</div>
          <input value={form.description} onChange={e => set('description', e.target.value)}
            style={{ width: '100%', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 13, padding: '7px 10px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: Z.muted, marginBottom: 8, fontWeight: 600 }}>{t('projectColor')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {PROJECT_COLORS.map(c => (
              <div key={c} onClick={() => set('color', c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: form.color === c ? `3px solid ${Z.text}` : `3px solid transparent`, transition: 'border .15s', boxSizing: 'border-box' }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '14px 24px', borderTop: `1px solid ${Z.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>{t('cancel')}</Btn>
        <Btn variant="primary" onClick={save} disabled={!form.name.trim()}>{t('saveProject')}</Btn>
      </div>
    </ModalShell>
  )
}

// ─── PROJECTS VIEW ────────────────────────────────────────────────────────────
function ProjectsView({ projects, tasks, onCreateProject, onEditProject, onDeleteProject, onSelectProject }) {
  const { t } = useLang()
  const Z = useTheme()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const handleEdit = (e, project) => {
    e.stopPropagation()
    setEditingProject(project)
    setModalOpen(true)
  }
  const handleDelete = (e, project) => {
    e.stopPropagation()
    if (window.confirm(t('confirmDeleteProject'))) onDeleteProject(project.id)
  }
  const handleSave = (form) => {
    if (editingProject) onEditProject({ ...editingProject, ...form })
    else onCreateProject(form)
    setEditingProject(null)
  }
  const handleClose = () => { setModalOpen(false); setEditingProject(null) }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{t('projectsTitle')}</div>
        <Btn variant="primary" onClick={() => { setEditingProject(null); setModalOpen(true) }}>{t('newProject')}</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {projects.map(project => {
          const count = tasks.filter(tk => tk.projectId === project.id).length
          return (
            <div key={project.id} onClick={() => onSelectProject(project.id)}
              style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = project.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = Z.border}
            >
              <div style={{ display: 'flex' }}>
                <div style={{ width: 5, background: project.color, flexShrink: 0 }} />
                <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.name}</div>
                  {project.description && <div style={{ fontSize: 12, color: Z.muted, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.description}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: Z.muted }}>{t('projectTasks')(count)}</span>
                    <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                      <Btn variant="ghost" small onClick={e => handleEdit(e, project)}>{t('editProject')}</Btn>
                      <Btn variant="danger" small onClick={e => handleDelete(e, project)}>{t('deleteProject')}</Btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {projects.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: Z.muted, fontSize: 13 }}>
            {t('newProject')}
          </div>
        )}
      </div>
      <ProjectModal open={modalOpen} onClose={handleClose} onSave={handleSave} initial={editingProject} />
    </div>
  )
}

// ─── MY TASKS VIEW ────────────────────────────────────────────────────────────
function MyTasksView({ tasks, projects, user, onDetail }) {
  const { t } = useLang()
  const Z = useTheme()
  const [keyTasksOnly, setKeyTasksOnly] = useState(false)
  const myTasks = tasks.filter(tk => tk.assignee && user?.name && tk.assignee.toLowerCase() === user.name.toLowerCase())
  const displayTasks = keyTasksOnly ? myTasks.filter(tk => tk.isKeyTask) : myTasks

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false
    const diff = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 3
  }

  // Group by projectId
  const groups = {}
  displayTasks.forEach(tk => {
    const pid = tk.projectId || '__none__'
    if (!groups[pid]) groups[pid] = []
    groups[pid].push(tk)
  })

  const getProjectName = (pid) => {
    if (pid === '__none__') return t('allProjects')
    return projects.find(p => p.id === pid)?.name || pid
  }
  const getProjectColor = (pid) => {
    if (pid === '__none__') return Z.muted
    return projects.find(p => p.id === pid)?.color || Z.muted
  }

  if (myTasks.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 8 }}>
        <div style={{ fontSize: 32 }}>✓</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{t('myTasksTitle')}</div>
        <div style={{ fontSize: 12, color: Z.muted }}>{t('myTasksEmpty')}</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{t('myTasksTitle')}</div>
        <button
          onClick={() => setKeyTasksOnly(v => !v)}
          style={{
            padding: '4px 10px', borderRadius: 6, border: `1px solid ${keyTasksOnly ? Z.amber : Z.border}`,
            background: keyTasksOnly ? Z.amber + '22' : 'transparent',
            color: keyTasksOnly ? Z.amber : Z.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >⭐ {t('keyTasksOnly')}</button>
      </div>
      {Object.entries(groups).map(([pid, groupTasks]) => (
        <div key={pid}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: getProjectColor(pid), flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: Z.muted, letterSpacing: 0.5 }}>{getProjectName(pid).toUpperCase()}</span>
            <span style={{ fontSize: 10, background: Z.border, borderRadius: 10, padding: '1px 7px', color: Z.muted }}>{groupTasks.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {groupTasks.map(tk => (
              <div key={tk.id} onClick={() => onDetail(tk)}
                style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', transition: 'border-color .15s', display: 'flex', alignItems: 'center', gap: 10 }}
                onMouseEnter={e => e.currentTarget.style.borderColor = Z.indigo}
                onMouseLeave={e => e.currentTarget.style.borderColor = Z.border}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {tk.isKeyTask && <span style={{ color: Z.amber, fontSize: 12 }}>⭐</span>}
                    {tk.title}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Badge color={Z.indigo}>{t(`stage.${tk.stage}`)}</Badge>
                    <PriorityBadge priorityKey={tk.priority} />
                    {tk.dueDate && (
                      <span style={{ fontSize: 11, color: isDueSoon(tk.dueDate) ? Z.red : Z.muted, fontWeight: isDueSoon(tk.dueDate) ? 700 : 400 }}>
                        📅 {tk.dueDate}{isDueSoon(tk.dueDate) ? ` — ${t('myTasksDueSoon')}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── GANTT VIEW ──────────────────────────────────────────────────────────────
const STAGE_COLORS = {
  planning:   '#818cf8',
  design:     '#34d399',
  publishing: '#fbbf24',
  dev:        '#f87171',
}

function GanttView({ tasks, onOpenTask, stageLabel }) {
  const { t } = useLang()
  const Z = useTheme()
  const [zoom, setZoom] = useState('normal') // normal | month | quarter

  const DAY_WIDTH = zoom === 'normal' ? 28 : zoom === 'month' ? 14 : 8
  const LEFT_COL = 140

  // Only tasks with at least a dueDate
  const datedTasks = tasks.filter(tk => tk.dueDate)

  // Date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let startDate = new Date(today)
  if (datedTasks.length > 0) {
    const allDates = datedTasks.flatMap(tk => {
      const dates = [new Date(tk.dueDate)]
      if (tk.startDate) dates.push(new Date(tk.startDate))
      return dates
    })
    const earliest = new Date(Math.min(...allDates.map(d => d.getTime())))
    // Start 2 days before earliest
    startDate = new Date(earliest)
    startDate.setDate(startDate.getDate() - 2)
  }

  const totalDays = 60 + (zoom === 'quarter' ? 60 : zoom === 'month' ? 30 : 0)
  const timelineWidth = totalDays * DAY_WIDTH

  const dateToX = (dateStr) => {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    const diff = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    return diff * DAY_WIDTH
  }

  const todayX = (() => {
    const diff = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    return diff * DAY_WIDTH
  })()

  // Build header: months + days
  const headerDays = []
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    headerDays.push(d)
  }

  // Month groups
  const monthGroups = []
  let curMonth = null
  let curStart = 0
  headerDays.forEach((d, i) => {
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (key !== curMonth) {
      if (curMonth !== null) monthGroups.push({ label: `${curMonth}`, start: curStart, end: i })
      curMonth = key
      curStart = i
    }
  })
  if (curMonth !== null) monthGroups.push({ label: curMonth, start: curStart, end: headerDays.length })

  // Group tasks by stage
  const grouped = STAGE_KEYS.map(sk => ({
    stage: sk,
    tasks: datedTasks.filter(tk => tk.stage === sk),
  }))

  const PRIORITY_COLORS = { high: Z.red, medium: Z.amber, low: Z.muted }

  const zoomOpts = [
    { value: 'normal', label: t('zoomWeek') },
    { value: 'month',  label: t('zoomMonth') },
    { value: 'quarter', label: t('zoomQuarter') },
  ]

  const ROW_H = 36

  return (
    <div>
      {/* Zoom controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        {zoomOpts.map(o => (
          <button key={o.value} onClick={() => setZoom(o.value)} style={{
            padding: '4px 12px', borderRadius: 6, border: `1px solid ${zoom === o.value ? Z.indigo : Z.border}`,
            background: zoom === o.value ? Z.indigo + '22' : 'transparent',
            color: zoom === o.value ? Z.indigo : Z.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{o.label}</button>
        ))}
        <span style={{ fontSize: 11, color: Z.muted, marginLeft: 8 }}>{t('noDateTasks')}</span>
      </div>

      {/* Gantt grid */}
      <div style={{ display: 'flex', border: `1px solid ${Z.border}`, borderRadius: 8, overflow: 'hidden', fontFamily: 'inherit' }}>
        {/* Left fixed column */}
        <div style={{ width: LEFT_COL, flexShrink: 0, borderRight: `1px solid ${Z.border}`, background: Z.surface, zIndex: 5 }}>
          {/* Header spacer */}
          <div style={{ height: 44, borderBottom: `1px solid ${Z.border}`, background: Z.bg }} />
          {grouped.map(({ stage, tasks: stageTasks }) => {
            if (stageTasks.length === 0) return null
            return (
              <div key={stage}>
                {/* Stage header */}
                <div style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, color: STAGE_COLORS[stage] || Z.muted, background: Z.bg, borderBottom: `1px solid ${Z.border}`, letterSpacing: 0.5 }}>
                  {stageLabel(stage).toUpperCase()}
                </div>
                {stageTasks.map(tk => (
                  <div key={tk.id} style={{ height: ROW_H, display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', borderBottom: `1px solid ${Z.border}`, background: Z.surface }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLORS[tk.priority] || Z.muted, flexShrink: 0 }} />
                    {tk.isKeyTask && <span style={{ fontSize: 10, color: Z.amber, flexShrink: 0 }}>⭐</span>}
                    <span style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, cursor: 'pointer', color: Z.text }}
                      onClick={() => onOpenTask(tk)}
                      title={tk.title}
                    >{tk.title}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Scrollable timeline */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'visible', position: 'relative' }}>
          {/* Header: month row */}
          <div style={{ display: 'flex', height: 22, borderBottom: `1px solid ${Z.border}`, background: Z.bg, minWidth: timelineWidth, position: 'sticky', top: 0, zIndex: 4 }}>
            {monthGroups.map((mg, mi) => {
              const [yr, mon] = mg.label.split('-')
              const d = new Date(Number(yr), Number(mon), 1)
              const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
              return (
                <div key={mi} style={{ width: (mg.end - mg.start) * DAY_WIDTH, flexShrink: 0, fontSize: 10, fontWeight: 700, color: Z.muted, padding: '3px 6px', borderRight: `1px solid ${Z.border}`, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {label}
                </div>
              )
            })}
          </div>
          {/* Header: day row */}
          <div style={{ display: 'flex', height: 22, borderBottom: `1px solid ${Z.border}`, background: Z.bg, minWidth: timelineWidth, position: 'sticky', top: 22, zIndex: 4 }}>
            {headerDays.map((d, i) => (
              <div key={i} style={{ width: DAY_WIDTH, flexShrink: 0, fontSize: 9, color: d.getDay() === 0 || d.getDay() === 6 ? Z.red : Z.muted, textAlign: 'center', lineHeight: '22px', borderRight: `1px solid ${Z.border}22`, position: 'relative' }}>
                {zoom === 'normal' || d.getDate() % (zoom === 'month' ? 3 : 7) === 1 ? d.getDate() : ''}
              </div>
            ))}
          </div>

          {/* Task rows */}
          <div style={{ minWidth: timelineWidth, position: 'relative' }}>
            {/* Today line */}
            {todayX >= 0 && todayX <= timelineWidth && (
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: todayX, width: 1, background: Z.red, zIndex: 3, pointerEvents: 'none', borderLeft: `1.5px dashed ${Z.red}` }} />
            )}

            {grouped.map(({ stage, tasks: stageTasks }) => {
              if (stageTasks.length === 0) return null
              const stageColor = STAGE_COLORS[stage] || Z.muted
              return (
                <div key={stage}>
                  {/* Stage header row (invisible, just height alignment) */}
                  <div style={{ height: 24, background: Z.bg, borderBottom: `1px solid ${Z.border}` }} />
                  {stageTasks.map(tk => {
                    const hasStart = !!tk.startDate
                    const hasDue = !!tk.dueDate
                    const startX = hasStart ? dateToX(tk.startDate) : dateToX(tk.dueDate)
                    const endX = hasDue ? dateToX(tk.dueDate) + DAY_WIDTH : startX + DAY_WIDTH
                    const barWidth = Math.max(endX - startX, DAY_WIDTH)
                    const assigneeInitial = tk.assignee ? tk.assignee[0].toUpperCase() : ''

                    return (
                      <div key={tk.id} style={{ height: ROW_H, borderBottom: `1px solid ${Z.border}`, position: 'relative', background: Z.surface }}>
                        {/* Day column backgrounds (alternating weekend) */}
                        {headerDays.map((d, di) => (
                          (d.getDay() === 0 || d.getDay() === 6) ? (
                            <div key={di} style={{ position: 'absolute', top: 0, bottom: 0, left: di * DAY_WIDTH, width: DAY_WIDTH, background: Z.bg + '88', pointerEvents: 'none' }} />
                          ) : null
                        ))}
                        {/* Bar */}
                        {startX < timelineWidth && (
                          <div
                            onClick={() => onOpenTask(tk)}
                            title={tk.title}
                            style={{
                              position: 'absolute',
                              top: 6, height: ROW_H - 12,
                              left: Math.max(0, startX),
                              width: barWidth,
                              background: stageColor + 'aa',
                              border: `1px solid ${stageColor}`,
                              borderRadius: 4,
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 6, paddingRight: 4,
                              overflow: 'hidden',
                              zIndex: 2,
                              transition: 'opacity .1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                          >
                            <span style={{ fontSize: 10, fontWeight: 600, color: Z.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tk.title}</span>
                            {assigneeInitial && (
                              <span style={{ width: 16, height: 16, borderRadius: '50%', background: stageColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#000', flexShrink: 0 }}>
                                {assigneeInitial}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── EXCEL IMPORT MODAL ──────────────────────────────────────────────────────
function ExcelImportModal({ onClose, onImport, currentProjectId }) {
  const { t } = useLang()
  const Z = useTheme()
  const [step, setStep] = useState('upload') // 'upload' | 'preview' | 'importing'
  const [file, setFile] = useState(null)
  const [parsedTasks, setParsedTasks] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const STAGE_OPTS = ['기획', '디자인', '퍼블', '개발', '완료']
  const PRIORITY_OPTS = ['낮음', '보통', '높음', '긴급']

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const { headers, rows } = await parseExcelFile(file)
      const tasks = await mapExcelToTasks({ headers, rows, projectId: currentProjectId })
      setParsedTasks(tasks)
      setStep('preview')
    } catch (e) {
      setError(e.message || 'Error analyzing file')
    } finally {
      setLoading(false)
    }
  }

  const updateTask = (idx, field, value) => {
    setParsedTasks(prev => prev.map((tk, i) => i === idx ? { ...tk, [field]: value } : tk))
  }

  const doImport = async () => {
    setStep('importing')
    await onImport(parsedTasks)
    onClose()
  }

  const STAGE_LABEL = { '기획': '기획', '디자인': '디자인', '퍼블': '퍼블', '개발': '개발', '완료': '완료' }
  const PRIORITY_LABEL = { '낮음': '낮음', '보통': '보통', '높음': '높음', '긴급': '긴급' }

  return (
    <ModalShell onClose={onClose} maxWidth={720}>
      {/* Header */}
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>📂 {t('importExcel')}</div>
        <Btn variant="ghost" small onClick={onClose}>✕</Btn>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        {step === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? Z.indigo : Z.border}`,
                borderRadius: 10,
                padding: '40px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? `${Z.indigo}0f` : 'transparent',
                transition: 'border-color .15s, background .15s',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
              <div style={{ fontSize: 13, color: file ? Z.text : Z.muted, fontWeight: file ? 600 : 400 }}>
                {file ? file.name : t('dropOrClick')}
              </div>
              <div style={{ fontSize: 11, color: Z.muted, marginTop: 6 }}>.xlsx · .xls · .csv</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files?.[0] || null)}
            />
            {error && (
              <div style={{ fontSize: 12, color: Z.red, background: `${Z.red}18`, border: `1px solid ${Z.red}33`, borderRadius: 6, padding: '8px 12px' }}>
                ⚠ {error}
              </div>
            )}
          </div>
        )}

        {step === 'preview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13, color: Z.muted }}>
              {parsedTasks.length} {parsedTasks.length === 1 ? 'task' : 'tasks'} ready to import
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: Z.bg }}>
                    {['Title', 'Stage', 'Priority', 'Assignee', 'Due Date', 'Key Task'].map(col => (
                      <th key={col} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, fontSize: 11, color: Z.muted, borderBottom: `1px solid ${Z.border}`, whiteSpace: 'nowrap' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedTasks.map((tk, idx) => (
                    <tr key={tk.id} style={{ borderBottom: `1px solid ${Z.border}` }}>
                      <td style={{ padding: '6px 10px', minWidth: 160 }}>
                        <input
                          value={tk.title}
                          onChange={e => updateTask(idx, 'title', e.target.value)}
                          style={{ background: 'transparent', border: 'none', color: Z.text, fontSize: 12, width: '100%', outline: 'none', padding: 0 }}
                        />
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <select value={tk.stage} onChange={e => updateTask(idx, 'stage', e.target.value)}
                          style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 4, color: Z.text, fontSize: 11, padding: '2px 4px', cursor: 'pointer' }}>
                          {STAGE_OPTS.map(s => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <select value={tk.priority} onChange={e => updateTask(idx, 'priority', e.target.value)}
                          style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 4, color: Z.text, fontSize: 11, padding: '2px 4px', cursor: 'pointer' }}>
                          {PRIORITY_OPTS.map(p => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <input
                          value={tk.assignee}
                          onChange={e => updateTask(idx, 'assignee', e.target.value)}
                          style={{ background: 'transparent', border: 'none', color: Z.text, fontSize: 12, width: 80, outline: 'none', padding: 0 }}
                        />
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <input
                          type="date"
                          value={tk.dueDate}
                          onChange={e => updateTask(idx, 'dueDate', e.target.value)}
                          style={{ background: 'transparent', border: 'none', color: Z.text, fontSize: 11, outline: 'none', colorScheme: 'auto' }}
                        />
                      </td>
                      <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={!!tk.isKeyTask}
                          onChange={e => updateTask(idx, 'isKeyTask', e.target.checked)}
                          style={{ accentColor: Z.amber, cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 12 }}>
            <div style={{ fontSize: 24 }}>⏳</div>
            <div style={{ fontSize: 13, color: Z.muted }}>{t('analyzing')}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 24px', borderTop: `1px solid ${Z.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
        {step === 'upload' && (
          <>
            <Btn variant="ghost" onClick={onClose}>{t('cancel')}</Btn>
            <Btn variant="primary" onClick={analyze} disabled={!file || loading}>
              {loading ? t('analyzing') : t('analyzeWithAi')}
            </Btn>
          </>
        )}
        {step === 'preview' && (
          <>
            <Btn variant="ghost" onClick={() => setStep('upload')}>← Back</Btn>
            <Btn variant="emerald" onClick={doImport} disabled={parsedTasks.length === 0}>
              {t('importTasks')(parsedTasks.length)}
            </Btn>
          </>
        )}
      </div>
    </ModalShell>
  )
}

// ─── KANBAN VIEW ─────────────────────────────────────────────────────────────
function KanbanView({ tasks, isMobile, onStageChange, onPublish, onDelete, onDetail, onAdd, onToggleKeyTask, addLog, stageLabel, totalTaskCount, labels, onExportExcel, onImportExcel }) {
  const { t } = useLang()
  const Z = useTheme()
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'gantt'
  const [activeStageIdx, setActiveStageIdx] = useState(0)
  const [addingStage, setAddingStage] = useState(null)
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [keyTasksOnly, setKeyTasksOnly] = useState(false)
  const [dragOverStage, setDragOverStage] = useState(null)
  const visibleStages = isMobile ? [STAGE_KEYS[activeStageIdx]] : STAGE_KEYS

  const assignees = ['all', ...Array.from(new Set(tasks.map(tk => tk.assignee).filter(Boolean)))]
  const priorityOpts = [
    { value: 'all', label: t('filterAll') },
    { value: 'high', label: t('priority.high') },
    { value: 'medium', label: t('priority.medium') },
    { value: 'low', label: t('priority.low') },
  ]
  const sortOpts = [
    { value: 'default', label: t('sortDefault') },
    { value: 'dueDate', label: t('sortDueDate') },
    { value: 'priority', label: t('sortPriority') },
  ]
  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }
  const hasFilters = filterAssignee !== 'all' || filterPriority !== 'all' || sortBy !== 'default' || keyTasksOnly

  let filteredTasks = tasks
  if (filterAssignee !== 'all') filteredTasks = filteredTasks.filter(tk => tk.assignee === filterAssignee)
  if (filterPriority !== 'all') filteredTasks = filteredTasks.filter(tk => tk.priority === filterPriority)
  if (keyTasksOnly) filteredTasks = filteredTasks.filter(tk => tk.isKeyTask)
  if (sortBy === 'dueDate') filteredTasks = [...filteredTasks].sort((a, b) => (a.dueDate || '9999') < (b.dueDate || '9999') ? -1 : 1)
  else if (sortBy === 'priority') filteredTasks = [...filteredTasks].sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1))

  const handleDrop = (e, targetStage) => {
    e.preventDefault()
    setDragOverStage(null)
    const taskId = Number(e.dataTransfer.getData('taskId'))
    if (!taskId) return
    onStageChange(taskId, targetStage)
  }

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
      {/* Top toolbar: view mode + Excel */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        {/* View mode toggle */}
        <div style={{ display: 'flex', border: `1px solid ${Z.border}`, borderRadius: 6, overflow: 'hidden' }}>
          {[{ id: 'kanban', label: '⬡ ' + t('tabKanban') }, { id: 'gantt', label: '▬ ' + t('gantt') }].map(m => (
            <button key={m.id} onClick={() => setViewMode(m.id)} style={{
              padding: '5px 12px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: viewMode === m.id ? Z.border : 'transparent',
              color: viewMode === m.id ? Z.text : Z.muted,
              transition: 'background .15s, color .15s',
            }}>{m.label}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Btn variant="default" small onClick={onImportExcel}>📂 {t('importExcel')}</Btn>
          <Btn variant="default" small onClick={onExportExcel}>📥 {t('exportExcel')}</Btn>
        </div>
      </div>

      {/* Gantt view */}
      {viewMode === 'gantt' && (
        <GanttView tasks={filteredTasks} onOpenTask={onDetail} stageLabel={stageLabel} />
      )}

      {/* Kanban board */}
      {viewMode === 'kanban' && (
        <>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: Z.muted, fontWeight: 600 }}>{t('filterAssignee')}:</span>
            <Select value={filterAssignee} onChange={setFilterAssignee}
              options={assignees.map(a => ({ value: a, label: a === 'all' ? t('filterAll') : a }))} />
            <span style={{ fontSize: 11, color: Z.muted, fontWeight: 600 }}>{t('filterPriority')}:</span>
            <Select value={filterPriority} onChange={setFilterPriority} options={priorityOpts} />
            <span style={{ fontSize: 11, color: Z.muted, fontWeight: 600 }}>{t('filterSort')}:</span>
            <Select value={sortBy} onChange={setSortBy} options={sortOpts} />
            <button
              onClick={() => setKeyTasksOnly(v => !v)}
              style={{
                padding: '4px 10px', borderRadius: 6, border: `1px solid ${keyTasksOnly ? Z.amber : Z.border}`,
                background: keyTasksOnly ? Z.amber + '22' : 'transparent',
                color: keyTasksOnly ? Z.amber : Z.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >⭐ {t('keyTasksOnly')}</button>
            {hasFilters && <Btn variant="ghost" small onClick={() => { setFilterAssignee('all'); setFilterPriority('all'); setSortBy('default'); setKeyTasksOnly(false) }}>{t('clearFilters')}</Btn>}
          </div>
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
              const col = filteredTasks.filter(task => task.stage === sk)
              const isDragOver = dragOverStage === sk
              return (
                <div key={sk}>
                  {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${Z.border}` }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: Z.muted }}>{stageLabel(sk)}</span>
                      <span style={{ fontSize: 10, background: Z.border, borderRadius: 10, padding: '1px 7px', color: Z.muted }}>{col.length}</span>
                    </div>
                  )}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOverStage(sk) }}
                    onDragLeave={() => setDragOverStage(null)}
                    onDrop={e => handleDrop(e, sk)}
                    style={{
                      display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60,
                      borderRadius: 8, transition: 'border .15s',
                      border: isDragOver ? `2px dashed ${Z.indigo}` : '2px solid transparent',
                      padding: isDragOver ? '4px' : '0',
                    }}
                  >
                    {col.map(task => (
                      <TaskCard key={task.id} task={task} isMobile={isMobile}
                        onStageChange={onStageChange} onPublish={onPublish}
                        onDelete={onDelete} onDetail={onDetail}
                        onToggleKeyTask={onToggleKeyTask}
                        addLog={addLog} stageLabel={stageLabel} labels={labels} />
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
        </>
      )}
    </div>
  )
}

// ─── INLINE INPUT ────────────────────────────────────────────────────────────
function InlineInput({ value, onChange, type = 'text' }) {
  const Z = useTheme()
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
  const Z = useTheme()
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
  const Z = useTheme()
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
function SettingsView({ user, stageLabels, setStageLabels, spreadsheetId, syncing }) {
  const { t } = useLang()
  const Z = useTheme()
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

      {/* Google Sheets connection card */}
      <div style={{ background: Z.surface, border: `1px solid ${spreadsheetId ? Z.emerald : Z.border}`, borderRadius: 8, padding: '16px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 10 }}>GOOGLE SHEETS DATABASE</div>
        {user?.sandbox ? (
          <div style={{ fontSize: 12, color: Z.amber }}>⚠ Sandbox mode — sign in with Google to connect your Drive</div>
        ) : syncing ? (
          <div style={{ fontSize: 12, color: Z.amber }}>● Connecting to Google Drive…</div>
        ) : spreadsheetId ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <span style={{ color: Z.emerald, fontWeight: 700 }}>● Connected</span>
            </div>
            <div style={{ fontSize: 11, color: Z.muted, wordBreak: 'break-all' }}>
              Spreadsheet ID: <code style={{ color: Z.text, fontSize: 10 }}>{spreadsheetId}</code>
            </div>
            <a
              href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: Z.indigo, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              ↗ Open in Google Sheets
            </a>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: Z.muted }}>Not connected</div>
        )}
      </div>
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

// ─── MEMBER PROFILE MODAL ────────────────────────────────────────────────────
function MemberProfileModal({ open, onClose, member, onSave, canEdit }) {
  const { t } = useLang()
  const Z = useTheme()
  const [form, setForm] = useState({ jobTitle: '', responsibilities: '', workStyle: '' })
  useEffect(() => {
    if (member) setForm({ jobTitle: member.jobTitle || '', responsibilities: member.responsibilities || '', workStyle: member.workStyle || '' })
  }, [member])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const save = () => { onSave({ ...member, ...form }); onClose() }
  if (!open || !member) return null
  return (
    <ModalShell onClose={onClose} maxWidth={440}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${Z.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{t('editProfile')}</div>
        <Btn variant="ghost" small onClick={onClose}>✕</Btn>
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: Z.indigo + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: Z.indigo, flexShrink: 0 }}>
            {member.avatarUrl ? <img src={member.avatarUrl} alt="" style={{ width: 44, height: 44, borderRadius: '50%' }} /> : (member.name?.[0] ?? '?')}
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>{member.name}</div>
            <div style={{ fontSize: 12, color: Z.muted }}>{member.email}</div>
            <Badge color={member.role === 'owner' ? Z.amber : member.role === 'admin' ? Z.indigo : Z.muted}>{member.role}</Badge>
          </div>
        </div>
        {[
          { key: 'jobTitle', label: t('jobTitle') },
          { key: 'responsibilities', label: t('responsibilities') },
          { key: 'workStyle', label: t('workStyle') },
        ].map(({ key, label }) => (
          <div key={key}>
            <div style={{ fontSize: 11, color: Z.muted, marginBottom: 5, fontWeight: 600 }}>{label}</div>
            <input value={form[key]} onChange={e => set(key, e.target.value)} disabled={!canEdit}
              style={{ width: '100%', background: canEdit ? Z.bg : Z.surface, border: `1px solid ${Z.border}`, borderRadius: 6, color: canEdit ? Z.text : Z.muted, fontSize: 13, padding: '7px 10px', outline: 'none', boxSizing: 'border-box', cursor: canEdit ? 'text' : 'default' }} />
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 24px', borderTop: `1px solid ${Z.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>{t('cancel')}</Btn>
        {canEdit && <Btn variant="primary" onClick={save}>{t('saveProject')}</Btn>}
      </div>
    </ModalShell>
  )
}

// ─── WORK TEAM TAB ────────────────────────────────────────────────────────────
function WorkTeamTab({ projects, allMembers, onAddMember, onUpdateMember, onDeleteMember, currentUser }) {
  const { t } = useLang()
  const Z = useTheme()
  const [selectedProjId, setSelectedProjId] = useState(projects[0]?.id || null)
  const [addingEmail, setAddingEmail] = useState('')
  const [addingOpen, setAddingOpen] = useState(false)
  const [addError, setAddError] = useState('')
  const [profileMember, setProfileMember] = useState(null)

  // Keep selectedProjId in sync if projects list changes
  useEffect(() => {
    if (!selectedProjId && projects.length > 0) setSelectedProjId(projects[0].id)
  }, [projects, selectedProjId])

  const projectMembers = allMembers.filter(m => m.projectId === selectedProjId)
  const ownerMember = projectMembers.find(m => m.role === 'owner')

  const handleAddMember = () => {
    if (!addingEmail.trim()) return
    setAddError('')
    const email = addingEmail.trim().toLowerCase()
    // Check if already in project
    if (projectMembers.some(m => m.email.toLowerCase() === email)) {
      setAddError('Already a member of this project')
      return
    }
    // Search existing users across all members
    const existing = allMembers.find(m => m.email.toLowerCase() === email)
    if (!existing) {
      setAddError(t('memberNotFound'))
      return
    }
    const newMember = {
      id: `mem_${++nextMemberId}`,
      projectId: selectedProjId,
      email: existing.email,
      name: existing.name,
      role: 'member',
      jobTitle: existing.jobTitle || '',
      responsibilities: existing.responsibilities || '',
      workStyle: existing.workStyle || '',
      avatarUrl: existing.avatarUrl || '',
    }
    onAddMember(newMember)
    setAddingEmail('')
    setAddingOpen(false)
    setAddError('')
  }

  const canEditProfile = (member) => {
    if (!currentUser) return false
    return currentUser.email?.toLowerCase() === member.email?.toLowerCase() || ownerMember?.email?.toLowerCase() === currentUser.email?.toLowerCase()
  }

  const roleBadgeColor = (role) => role === 'owner' ? Z.amber : role === 'admin' ? Z.indigo : Z.muted

  if (projects.length === 0) {
    return <div style={{ color: Z.muted, fontSize: 13, textAlign: 'center', paddingTop: 60 }}>{t('newProject')}</div>
  }

  return (
    <div style={{ maxWidth: 640 }}>
      {/* Project selector */}
      {projects.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <Select value={selectedProjId || ''} onChange={setSelectedProjId} options={projects.map(p => ({ value: p.id, label: p.name }))} style={{ minWidth: 180 }} />
        </div>
      )}
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700 }}>{projects.find(p => p.id === selectedProjId)?.name || ''}</div>
        <Btn variant="primary" small onClick={() => { setAddingOpen(v => !v); setAddError(''); setAddingEmail('') }}>{t('addMember')}</Btn>
      </div>
      {/* Add member inline form */}
      {addingOpen && (
        <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: 14, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, color: Z.muted, fontWeight: 600 }}>{t('emailPlaceholder')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input autoFocus value={addingEmail} onChange={e => { setAddingEmail(e.target.value); setAddError('') }}
              onKeyDown={e => e.key === 'Enter' && handleAddMember()}
              placeholder="email@example.com"
              style={{ flex: 1, background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 13, padding: '7px 10px', outline: 'none' }} />
            <Btn variant="primary" small onClick={handleAddMember} disabled={!addingEmail.trim()}>{t('searchMember')}</Btn>
            <Btn variant="ghost" small onClick={() => { setAddingOpen(false); setAddError(''); setAddingEmail('') }}>✕</Btn>
          </div>
          {addError && <div style={{ fontSize: 12, color: Z.red }}>{addError}</div>}
        </div>
      )}
      {/* Member list */}
      {projectMembers.length === 0 ? (
        <div style={{ color: Z.muted, fontSize: 13, textAlign: 'center', padding: 40 }}>{t('noMembers')}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {projectMembers.map(member => (
            <div key={member.id} style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'border-color .15s' }}
              onClick={() => setProfileMember(member)}
              onMouseEnter={e => e.currentTarget.style.borderColor = Z.indigo}
              onMouseLeave={e => e.currentTarget.style.borderColor = Z.border}
            >
              {/* Avatar */}
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: Z.indigo + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: Z.indigo, flexShrink: 0 }}>
                {member.avatarUrl ? <img src={member.avatarUrl} alt="" style={{ width: 38, height: 38, borderRadius: '50%' }} /> : (member.name?.[0] ?? '?')}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{member.name}</div>
                {member.jobTitle && <div style={{ fontSize: 11, color: Z.muted, marginTop: 1 }}>{member.jobTitle}</div>}
                <div style={{ fontSize: 11, color: Z.muted }}>{member.email}</div>
              </div>
              {/* Role badge */}
              <Badge color={roleBadgeColor(member.role)}>{member.role}</Badge>
              {/* Delete (not owner) */}
              {member.role !== 'owner' && ownerMember?.email?.toLowerCase() === currentUser?.email?.toLowerCase() && (
                <button
                  onClick={e => { e.stopPropagation(); onDeleteMember(member.id) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: Z.muted, fontSize: 13, padding: '2px 4px', borderRadius: 4, flexShrink: 0 }}
                  onMouseEnter={ev => ev.currentTarget.style.color = Z.red}
                  onMouseLeave={ev => ev.currentTarget.style.color = Z.muted}
                >✕</button>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Profile modal */}
      {profileMember && (
        <MemberProfileModal
          open={!!profileMember}
          onClose={() => setProfileMember(null)}
          member={profileMember}
          canEdit={canEditProfile(profileMember)}
          onSave={(updated) => { onUpdateMember(updated); setProfileMember(null) }}
        />
      )}
    </div>
  )
}

// ─── AI PM VIEW ──────────────────────────────────────────────────────────────
function AiPmView({ members, tasks, subTasks }) {
  const { t, lang } = useLang()
  const Z = useTheme()
  const [reportLang, setReportLang] = useState(lang)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState('')
  const [error, setError] = useState('')
  const [slackUrl, setSlackUrl] = useState(() => {
    try { return localStorage.getItem('tf_slack_webhook') || '' } catch (e) { void e; return '' }
  })
  const [slackSending, setSlackSending] = useState(false)
  const [slackResult, setSlackResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState(() => {
    try { const raw = localStorage.getItem('tf_aipm_reports'); return raw ? JSON.parse(raw) : [] } catch (e) { void e; return [] }
  })

  const hasApiKey = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY

  const saveSlackUrl = (url) => {
    setSlackUrl(url)
    try { localStorage.setItem('tf_slack_webhook', url) } catch (e) { void e }
  }

  const generate = async () => {
    setLoading(true)
    setError('')
    setReport('')
    try {
      const text = await generateAiPmReport({ members, tasks, subTasks, lang: reportLang })
      setReport(text)
      const entry = { text, ts: new Date().toISOString() }
      setHistory(prev => {
        const next = [entry, ...prev].slice(0, 3)
        try { localStorage.setItem('tf_aipm_reports', JSON.stringify(next)) } catch (e) { void e }
        return next
      })
    } catch (e) {
      setError(e.message || 'Unknown error')
    }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard?.writeText(report).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendSlack = async () => {
    if (!slackUrl || !report) return
    setSlackSending(true)
    setSlackResult('')
    try {
      const res = await fetch('/api/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: slackUrl, text: '📊 AI PM Report\n\n' + report }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setSlackResult(`Error: ${data.error || res.status}`)
      else setSlackResult('✓ Sent!')
    } catch (e) {
      setSlackResult(`Error: ${e.message}`)
    }
    setSlackSending(false)
  }

  // Render report: parse ### headings into bold colored lines
  const renderReport = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return (
          <div key={i} style={{ fontWeight: 700, fontSize: 14, color: Z.indigo, marginTop: 16, marginBottom: 4 }}>
            {line.slice(4)}
          </div>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <div key={i} style={{ fontWeight: 800, fontSize: 15, color: Z.emerald, marginTop: 20, marginBottom: 6 }}>
            {line.slice(3)}
          </div>
        )
      }
      if (line.trim() === '') return <div key={i} style={{ height: 6 }} />
      return (
        <div key={i} style={{ fontSize: 13, color: Z.text, lineHeight: 1.7 }}>
          {line}
        </div>
      )
    })
  }

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>✨ AI PM</div>
        {/* Lang toggle */}
        <div style={{ display: 'flex', border: `1px solid ${Z.border}`, borderRadius: 6, overflow: 'hidden' }}>
          {['ko', 'en'].map(l => (
            <button key={l} onClick={() => setReportLang(l)} style={{
              padding: '4px 10px', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer',
              background: reportLang === l ? Z.border : 'transparent',
              color: reportLang === l ? Z.text : Z.muted,
            }}>{l.toUpperCase()}</button>
          ))}
        </div>
        <Btn variant="primary" onClick={generate} disabled={loading || !hasApiKey}>
          {loading ? t('generating') : `✨ ${t('generateReport')}`}
        </Btn>
      </div>

      {!hasApiKey && (
        <div style={{ background: `${Z.amber}18`, border: `1px solid ${Z.amber}44`, borderRadius: 8, padding: '10px 16px', fontSize: 12, color: Z.amber }}>
          {t('noApiKey')}
        </div>
      )}

      {error && (
        <div style={{ background: `${Z.red}18`, border: `1px solid ${Z.red}44`, borderRadius: 8, padding: '10px 16px', fontSize: 12, color: Z.red }}>
          ⚠ {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: Z.indigo, fontSize: 13, padding: 20 }}>
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◆</span>
          {t('generating')}
        </div>
      )}

      {report && !loading && (
        <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 10, padding: '20px 24px' }}>
          {/* Action row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Btn variant={copied ? 'emerald' : 'default'} small onClick={copy}>
              {copied ? '✓ Copied' : t('copyReport')}
            </Btn>
            <div style={{ display: 'flex', gap: 6, flex: 1, minWidth: 200 }}>
              <input
                value={slackUrl}
                onChange={e => saveSlackUrl(e.target.value)}
                placeholder={t('slackWebhook')}
                style={{ flex: 1, background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '4px 8px', outline: 'none' }}
              />
              <Btn variant="default" small onClick={sendSlack} disabled={slackSending || !slackUrl}>
                {slackSending ? '…' : t('sendSlack')}
              </Btn>
            </div>
            {slackResult && <span style={{ fontSize: 12, color: slackResult.startsWith('✓') ? Z.emerald : Z.red, alignSelf: 'center' }}>{slackResult}</span>}
          </div>
          {/* Report body */}
          <div style={{ borderTop: `1px solid ${Z.border}`, paddingTop: 16 }}>
            {renderReport(report)}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 8 }}>{t('reportHistory').toUpperCase()}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((h, i) => (
              <div key={i}
                onClick={() => setReport(h.text)}
                style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '10px 14px', cursor: 'pointer', transition: 'border-color .15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = Z.indigo}
                onMouseLeave={e => e.currentTarget.style.borderColor = Z.border}
              >
                <div style={{ fontSize: 11, color: Z.muted, marginBottom: 4 }}>{new Date(h.ts).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: Z.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {h.text.slice(0, 120)}…
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slack URL persistent store row */}
      {!report && (
        <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, letterSpacing: 1 }}>{t('slackWebhook').toUpperCase()}</div>
          <input
            value={slackUrl}
            onChange={e => saveSlackUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            style={{ background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, color: Z.text, fontSize: 12, padding: '6px 10px', outline: 'none' }}
          />
        </div>
      )}
    </div>
  )
}

// ─── WORKSPACE ───────────────────────────────────────────────────────────────
// ─── TUTORIAL ────────────────────────────────────────────────────────────────
function TutorialModal({ open, onClose }) {
  const { t } = useLang()
  const Z = useTheme()
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

function Workspace({ user, onSignOut, onSignIn, isMobile, onToggleDark, darkMode }) {
  const { t } = useLang()
  const Z = useTheme()
  const [tasks, setTasks]                   = useState(user?.sandbox ? INITIAL_TASKS : [])
  const [projects, setProjects]             = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [activeTab, setActiveTab]           = useState('projects')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [aiOpen, setAiOpen]         = useState(false)
  const [shareOpen, setShareOpen]       = useState(false)
  const [importOpen, setImportOpen]     = useState(false)
  const [detailTask, setDetailTask]     = useState(null)
  const [toast, setToast]               = useState(null)
  const [tutorialOpen, setTutorialOpen] = useState(() => {
    if (user?.sandbox) return false
    try { return !localStorage.getItem('tf_tutorial_done') } catch { return true }
  })
  const [stageLabels, setStageLabels]   = useState({})
  const stageLabel = useCallback(key => stageLabels[key] || t(`stage.${key}`), [stageLabels, t])

  // Subtasks
  const [allSubTasks, setAllSubTasks] = useState([])
  const [detailSubTasks, setDetailSubTasks] = useState([])
  const [subTasksSheetId, setSubTasksSheetId] = useState(null)

  // Members
  const [allMembers, setAllMembers] = useState([])
  const [membersSheetId, setMembersSheetId] = useState(null)

  // Labels (localStorage)
  const [labels, setLabels] = useState(() => loadLabels())

  // Sheets state
  const [spreadsheetId, setSpreadsheetId]   = useState(null)
  const [sheetId, setSheetId]               = useState(0)
  const [projectsSheetId, setProjectsSheetId] = useState(null)
  const [syncing, setSyncing]               = useState(false)
  const [syncError, setSyncError]           = useState(null)

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

  // ── Connect to Google Sheets on mount (non-sandbox) ──────────────────────
  useEffect(() => {
    if (user?.sandbox) return
    let cancelled = false
    const connect = async () => {
      setSyncing(true)
      setSyncError(null)
      try {
        addLog('Connecting to Google Drive…', 'info')
        const sid = await findOrCreateSpreadsheet()
        if (cancelled) return
        setSpreadsheetId(sid)
        const numericSheetId = await getSheetId(sid)
        setSheetId(numericSheetId)
        const numericProjectsSheetId = await getProjectsSheetId(sid)
        setProjectsSheetId(numericProjectsSheetId)
        const numericSubTasksSheetId = await getSubTasksSheetId(sid)
        setSubTasksSheetId(numericSubTasksSheetId)
        const numericMembersSheetId = await getMembersSheetId(sid)
        setMembersSheetId(numericMembersSheetId)
        addLog(`Spreadsheet ready: ${sid}`, 'success')
        const loadedProjects = await loadProjects(sid)
        if (!cancelled) setProjects(loadedProjects)
        const loadedSubTasks = await loadSubTasks(sid)
        if (!cancelled) setAllSubTasks(loadedSubTasks)
        const loadedMembers = await loadMembers(sid)
        if (!cancelled) setAllMembers(loadedMembers)
        const loaded = await loadTasks(sid)
        if (cancelled) return
        setTasks(loaded.length > 0 ? loaded : INITIAL_TASKS)
        if (loaded.length === 0) {
          // Write initial demo tasks to sheet
          for (const task of INITIAL_TASKS) {
            const row = await appendTask(sid, task)
            setTasks(prev => prev.map(tk => tk.id === task.id ? { ...tk, rowNum: row } : tk))
          }
          addLog('Demo tasks written to sheet', 'success')
        } else {
          addLog(`Loaded ${loaded.length} tasks from sheet`, 'success')
        }
      } catch (e) {
        if (!cancelled) setSyncError(e.message)
        addLog(`Connection failed: ${e.message}`, 'error')
      } finally {
        if (!cancelled) setSyncing(false)
      }
    }
    connect()
    return () => { cancelled = true }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sheets-aware CRUD helpers ────────────────────────────────────────────
  const syncUpdate = useCallback(async (task) => {
    if (!spreadsheetId || !task.rowNum) return
    try {
      await updateTaskRow(spreadsheetId, task.rowNum, task)
      addLog(t('sheetDoneLog')(task.rowNum, task.stage), 'success')
    } catch (e) {
      addLog(`Sync error: ${e.message}`, 'error')
    }
  }, [spreadsheetId, addLog, t])

  const onStageChange = useCallback((id, sk) => {
    setTasks(prev => {
      const updated = prev.map(tk => tk.id === id ? { ...tk, stage: sk } : tk)
      const task = updated.find(tk => tk.id === id)
      syncUpdate(task)
      return updated
    })
  }, [syncUpdate])

  const onUpdateTask = useCallback((id, field, val) => {
    setTasks(prev => {
      const updated = prev.map(tk => tk.id === id ? { ...tk, [field]: val } : tk)
      const task = updated.find(tk => tk.id === id)
      syncUpdate(task)
      return updated
    })
  }, [syncUpdate])

  const onAddTask = useCallback(async (task) => {
    const taskWithProject = { ...task, projectId: selectedProjectId || task.projectId || '' }
    const taskToAdd = taskWithProject
    setTasks(prev => [...prev, taskToAdd])
    addLog(`New task added: "${task.title}"`, 'success')
    if (spreadsheetId) {
      try {
        const rowNum = await appendTask(spreadsheetId, taskToAdd)
        setTasks(prev => prev.map(tk => tk.id === taskToAdd.id ? { ...tk, rowNum } : tk))
        addLog(`Sheet row ${rowNum} created`, 'success')
      } catch (e) {
        addLog(`Sheet append failed: ${e.message}`, 'error')
      }
    }
  }, [spreadsheetId, addLog, selectedProjectId])

  const onDeleteTask = useCallback(async (id) => {
    const task = tasks.find(tk => tk.id === id)
    setTasks(prev => prev.filter(tk => tk.id !== id))
    addLog(t('deleteLog')(task.title), 'info')
    if (spreadsheetId && task.rowNum) {
      try {
        await deleteTaskRow(spreadsheetId, sheetId, task.rowNum)
        // Re-index rowNums after deletion
        setTasks(prev => prev.map(tk => ({
          ...tk,
          rowNum: tk.rowNum > task.rowNum ? tk.rowNum - 1 : tk.rowNum,
        })))
        addLog(`Sheet row ${task.rowNum} deleted`, 'success')
      } catch (e) {
        addLog(`Sheet delete failed: ${e.message}`, 'error')
      }
    }
  }, [tasks, spreadsheetId, sheetId, addLog, t])

  const onPublish = useCallback(async (id) => {
    const task = tasks.find(tk => tk.id === id)
    addLog(t('publishReqLog')(task.title), 'ai')
    const updated = { ...task, published: true }
    setTasks(prev => prev.map(tk => tk.id === id ? updated : tk))
    await syncUpdate(updated)
    addLog(t('publishDoneLog')(task.title.replace(/\s+/g, '-').toLowerCase()), 'success')
  }, [tasks, syncUpdate, addLog, t])

  const onDetailUpdate = useCallback((updated) => {
    setTasks(prev => prev.map(tk => tk.id === updated.id ? updated : tk))
    syncUpdate(updated)
  }, [syncUpdate])

  const onToggleKeyTask = useCallback((id) => {
    setTasks(prev => {
      const updated = prev.map(tk => tk.id === id ? { ...tk, isKeyTask: !tk.isKeyTask } : tk)
      const task = updated.find(tk => tk.id === id)
      syncUpdate(task)
      return updated
    })
  }, [syncUpdate])

  // ── SubTask CRUD ─────────────────────────────────────────────────────────
  const openDetailWithSubTasks = useCallback((task) => {
    setDetailTask(task)
    setDetailSubTasks(allSubTasks.filter(s => s.taskId === String(task.id)))
  }, [allSubTasks])

  const onAddSubTask = useCallback(async (st) => {
    setAllSubTasks(prev => [...prev, st])
    setDetailSubTasks(prev => [...prev, st])
    if (spreadsheetId) {
      try {
        const rowNum = await appendSubTask(spreadsheetId, st)
        const withRow = { ...st, rowNum }
        setAllSubTasks(prev => prev.map(s => s.id === st.id ? withRow : s))
        setDetailSubTasks(prev => prev.map(s => s.id === st.id ? withRow : s))
      } catch (e) { addLog(`SubTask append failed: ${e.message}`, 'error') }
    }
  }, [spreadsheetId, addLog])

  const onToggleSubTask = useCallback((stId) => {
    setAllSubTasks(prev => {
      const updated = prev.map(s => s.id === stId ? { ...s, done: !s.done } : s)
      const st = updated.find(s => s.id === stId)
      if (spreadsheetId && st?.rowNum) {
        updateSubTaskRow(spreadsheetId, st.rowNum, st).catch(e => addLog(`SubTask update failed: ${e.message}`, 'error'))
      }
      return updated
    })
    setDetailSubTasks(prev => prev.map(s => s.id === stId ? { ...s, done: !s.done } : s))
  }, [spreadsheetId, addLog])

  const onUpdateSubTask = useCallback((stId, field, value) => {
    setAllSubTasks(prev => {
      const updated = prev.map(s => s.id === stId ? { ...s, [field]: value } : s)
      const st = updated.find(s => s.id === stId)
      if (spreadsheetId && st?.rowNum) {
        updateSubTaskRow(spreadsheetId, st.rowNum, st).catch(e => addLog(`SubTask update failed: ${e.message}`, 'error'))
      }
      return updated
    })
    setDetailSubTasks(prev => prev.map(s => s.id === stId ? { ...s, [field]: value } : s))
  }, [spreadsheetId, addLog])

  const onDeleteSubTask = useCallback(async (stId) => {
    const st = allSubTasks.find(s => s.id === stId)
    setAllSubTasks(prev => prev.filter(s => s.id !== stId))
    setDetailSubTasks(prev => prev.filter(s => s.id !== stId))
    if (spreadsheetId && st?.rowNum && subTasksSheetId != null) {
      try {
        await deleteSubTaskRow(spreadsheetId, subTasksSheetId, st.rowNum)
        setAllSubTasks(prev => prev.map(s => ({ ...s, rowNum: s.rowNum > st.rowNum ? s.rowNum - 1 : s.rowNum })))
      } catch (e) { addLog(`SubTask delete failed: ${e.message}`, 'error') }
    }
  }, [allSubTasks, spreadsheetId, subTasksSheetId, addLog])

  // ── Member CRUD ───────────────────────────────────────────────────────────
  const onAddMember = useCallback(async (member) => {
    setAllMembers(prev => [...prev, member])
    if (spreadsheetId) {
      try {
        const rowNum = await appendMember(spreadsheetId, member)
        setAllMembers(prev => prev.map(m => m.id === member.id ? { ...m, rowNum } : m))
      } catch (e) { addLog(`Member append failed: ${e.message}`, 'error') }
    }
  }, [spreadsheetId, addLog])

  const onUpdateMember = useCallback(async (updated) => {
    setAllMembers(prev => prev.map(m => m.id === updated.id ? updated : m))
    if (spreadsheetId && updated.rowNum) {
      try { await updateMemberRow(spreadsheetId, updated.rowNum, updated) }
      catch (e) { addLog(`Member update failed: ${e.message}`, 'error') }
    }
  }, [spreadsheetId, addLog])

  const onDeleteMember = useCallback(async (memberId) => {
    const member = allMembers.find(m => m.id === memberId)
    setAllMembers(prev => prev.filter(m => m.id !== memberId))
    if (spreadsheetId && member?.rowNum && membersSheetId != null) {
      try {
        await deleteMemberRow(spreadsheetId, membersSheetId, member.rowNum)
        setAllMembers(prev => prev.map(m => ({ ...m, rowNum: m.rowNum > member.rowNum ? m.rowNum - 1 : m.rowNum })))
      } catch (e) { addLog(`Member delete failed: ${e.message}`, 'error') }
    }
  }, [allMembers, spreadsheetId, membersSheetId, addLog])

  const onAIConfirm = useCallback(async (newTasks) => {
    setTasks(prev => [...prev, ...newTasks])
    if (spreadsheetId) {
      for (const task of newTasks) {
        try {
          const rowNum = await appendTask(spreadsheetId, task)
          setTasks(prev => prev.map(tk => tk.id === task.id ? { ...tk, rowNum } : tk))
        } catch (e) {
          addLog(`Sheet append failed: ${e.message}`, 'error')
        }
      }
    }
  }, [spreadsheetId, addLog])

  const onImportTasks = useCallback(async (newTasks) => {
    const tasksWithProject = newTasks.map(tk => ({ ...tk, projectId: selectedProjectId || tk.projectId || '' }))
    setTasks(prev => [...prev, ...tasksWithProject])
    addLog(`Imported ${tasksWithProject.length} tasks from Excel`, 'success')
    if (spreadsheetId) {
      for (const task of tasksWithProject) {
        try {
          const rowNum = await appendTask(spreadsheetId, task)
          setTasks(prev => prev.map(tk => tk.id === task.id ? { ...tk, rowNum } : tk))
        } catch (e) {
          addLog(`Sheet append failed: ${e.message}`, 'error')
        }
      }
    }
    setToast(t('importSuccess'))
  }, [spreadsheetId, addLog, selectedProjectId, t])

  // ── Project CRUD ──────────────────────────────────────────────────────────
  const onCreateProject = useCallback(async (form) => {
    const project = { id: `proj_${Date.now()}`, name: form.name, color: form.color, description: form.description, createdAt: new Date().toISOString() }
    setProjects(prev => [...prev, project])
    if (spreadsheetId) {
      try {
        const rowNum = await appendProject(spreadsheetId, project)
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, rowNum } : p))
      } catch (e) { addLog(`Project append failed: ${e.message}`, 'error') }
    }
    // Add current user as owner member
    if (user && !user.sandbox) {
      const ownerMember = {
        id: `mem_${++nextMemberId}`,
        projectId: project.id,
        email: user.email || '',
        name: user.name || '',
        role: 'owner',
        jobTitle: '', responsibilities: '', workStyle: '',
        avatarUrl: user.picture || '',
      }
      setAllMembers(prev => [...prev, ownerMember])
      if (spreadsheetId) {
        try {
          const mRowNum = await appendMember(spreadsheetId, ownerMember)
          setAllMembers(prev => prev.map(m => m.id === ownerMember.id ? { ...m, rowNum: mRowNum } : m))
        } catch (e) { addLog(`Member append failed: ${e.message}`, 'error') }
      }
    }
  }, [spreadsheetId, addLog, user])

  const onEditProject = useCallback(async (updated) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
    if (spreadsheetId && updated.rowNum) {
      try { await updateProject(spreadsheetId, updated.rowNum, updated) }
      catch (e) { addLog(`Project update failed: ${e.message}`, 'error') }
    }
  }, [spreadsheetId, addLog])

  const onDeleteProject = useCallback(async (projectId) => {
    const project = projects.find(p => p.id === projectId)
    setProjects(prev => prev.filter(p => p.id !== projectId))
    if (spreadsheetId && project?.rowNum && projectsSheetId != null) {
      try {
        await deleteProject(spreadsheetId, projectsSheetId, project.rowNum)
        setProjects(prev => prev.map(p => ({ ...p, rowNum: p.rowNum > project.rowNum ? p.rowNum - 1 : p.rowNum })))
      } catch (e) { addLog(`Project delete failed: ${e.message}`, 'error') }
    }
  }, [projects, spreadsheetId, projectsSheetId, addLog])

  const tabs = [
    { id: 'projects', label: t('tabProjects'), icon: '◈' },
    { id: 'kanban',   label: t('tabKanban'),   icon: '⬡' },
    { id: 'sheet',    label: t('tabSheet'),    icon: '⊞' },
    { id: 'mytasks',  label: t('tabMyTasks'),  icon: '✓' },
    { id: 'team',     label: t('tabTeam'),     icon: '👥' },
    { id: 'aipm',     label: t('tabAiPm'),     icon: '✨' },
    { id: 'blog',     label: t('tabPublish'),  icon: '↑' },
    { id: 'settings', label: t('tabSettings'), icon: '⚙' },
  ]

  // Project-filtered tasks for kanban/sheet
  const filteredByProject = selectedProjectId
    ? tasks.filter(tk => tk.projectId === selectedProjectId)
    : tasks

  const selectedProject = projects.find(p => p.id === selectedProjectId)
  const projectLabel = selectedProject ? selectedProject.name : t('allProjects')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Sync error banner */}
      {syncError && (
        <div style={{ background: `${Z.red}22`, borderBottom: `1px solid ${Z.red}44`, padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 12 }}>
          <span style={{ color: Z.red }}>⚠ Google Sheets sync error: {syncError}</span>
          <button onClick={() => setSyncError(null)} style={{ background: 'none', border: `1px solid ${Z.red}`, color: Z.red, borderRadius: 5, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}

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
        {(activeTab === 'kanban' || activeTab === 'sheet') && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ color: Z.muted }}>›</span>
            {selectedProject && <div style={{ width: 8, height: 8, borderRadius: '50%', background: selectedProject.color }} />}
            <span style={{ color: Z.muted, cursor: selectedProjectId ? 'pointer' : 'default' }} onClick={() => selectedProjectId && setSelectedProjectId(null)}>{projectLabel}</span>
          </div>
        )}
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
          {/* Sheets connection status */}
          {!user?.sandbox && !isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: syncing ? Z.amber : syncError ? Z.red : spreadsheetId ? Z.emerald : Z.muted }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: syncing ? Z.amber : syncError ? Z.red : spreadsheetId ? Z.emerald : Z.muted, display: 'inline-block', flexShrink: 0 }} />
              {syncing ? 'Syncing…' : syncError ? 'Sync error' : spreadsheetId ? 'Sheets connected' : 'Connecting…'}
            </div>
          )}
          <button onClick={onToggleDark} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} style={{ background: 'none', border: `1px solid ${Z.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 14, color: Z.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
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
          {!isMobile && user && !user.sandbox && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: Z.muted }}>
              {user.picture && <img src={user.picture} alt="" style={{ width: 22, height: 22, borderRadius: '50%' }} />}
              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
            </div>
          )}
          {!isMobile && <Btn variant="ghost" small onClick={onSignOut}>{t('signOut')}</Btn>}
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: isMobile ? '16px 16px 80px' : '24px', maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {activeTab === 'projects' && (
          <ProjectsView projects={projects} tasks={tasks}
            onCreateProject={onCreateProject} onEditProject={onEditProject} onDeleteProject={onDeleteProject}
            onSelectProject={(pid) => { setSelectedProjectId(pid); setActiveTab('kanban') }} />
        )}
        {activeTab === 'kanban' && (
          <KanbanView tasks={filteredByProject} isMobile={isMobile}
            onStageChange={onStageChange} onPublish={onPublish}
            onDelete={onDeleteTask} onDetail={openDetailWithSubTasks}
            onAdd={onAddTask} addLog={addLog}
            onToggleKeyTask={onToggleKeyTask}
            stageLabel={stageLabel} totalTaskCount={filteredByProject.length}
            labels={labels}
            allSubTasks={allSubTasks}
            allMembers={allMembers}
            onExportExcel={() => exportTasksToExcel(filteredByProject, allSubTasks, allMembers, labels)}
            onImportExcel={() => setImportOpen(true)} />
        )}
        {activeTab === 'sheet' && (
          <SpreadsheetView tasks={filteredByProject} onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask} onAddTask={onAddTask}
            addLog={addLog} stageLabel={stageLabel} />
        )}
        {activeTab === 'mytasks' && (
          <MyTasksView tasks={tasks} projects={projects} user={user} onDetail={openDetailWithSubTasks} />
        )}
        {activeTab === 'team' && (
          <WorkTeamTab
            projects={projects}
            allMembers={allMembers}
            onAddMember={onAddMember}
            onUpdateMember={onUpdateMember}
            onDeleteMember={onDeleteMember}
            currentUser={user}
          />
        )}
        {activeTab === 'aipm'     && (
          <AiPmView
            members={selectedProjectId ? allMembers.filter(m => m.projectId === selectedProjectId) : allMembers}
            tasks={filteredByProject}
            subTasks={allSubTasks}
          />
        )}
        {activeTab === 'blog'     && <AutopressView tasks={tasks} addLog={addLog} />}
        {activeTab === 'settings' && <SettingsView user={user} stageLabels={stageLabels} setStageLabels={setStageLabels} spreadsheetId={spreadsheetId} syncing={syncing} />}
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
      {importOpen && (
        <ExcelImportModal
          onClose={() => setImportOpen(false)}
          onImport={onImportTasks}
          currentProjectId={selectedProjectId}
        />
      )}
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
      <TaskDetailModal
        task={detailTask} open={!!detailTask}
        onClose={() => { setDetailTask(null); setDetailSubTasks([]) }}
        onUpdate={onDetailUpdate} stageLabel={stageLabel}
        subTasks={detailSubTasks}
        onAddSubTask={onAddSubTask}
        onToggleSubTask={onToggleSubTask}
        onUpdateSubTask={onUpdateSubTask}
        onDeleteSubTask={onDeleteSubTask}
        labels={labels} setLabels={setLabels}
        projectMembers={detailTask ? allMembers.filter(m => m.projectId === detailTask.projectId) : []}
        currentUser={user}
      />
      <TutorialModal open={tutorialOpen} onClose={() => {
        setTutorialOpen(false)
        try { localStorage.setItem('tf_tutorial_done', '1') } catch (e) { void e }
      }} />
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  )
}

// ─── LANDING WIDGETS ─────────────────────────────────────────────────────────

function SyncShowcase() {
  const { t } = useLang()
  const Z = useTheme()
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
  const Z = useTheme()
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
function Landing({ onSandbox, onResume, onToggleDark, darkMode }) {
  const { t } = useLang()
  const Z = useTheme()
  const [redirecting, setRedirecting] = useState(false)
  const [authError, setAuthError] = useState(() => {
    if (typeof window === 'undefined') return null
    const p = new URLSearchParams(window.location.search)
    const err = p.get('auth_error')
    if (err) window.history.replaceState({}, '', window.location.pathname)
    return err ? decodeURIComponent(err) : null
  })

  const handleSignIn = () => {
    try {
      setRedirecting(true)
      startOAuthFlow()
    } catch (e) {
      setRedirecting(false)
      setAuthError(e.message || 'Sign-in failed')
    }
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
          <button onClick={onToggleDark} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} style={{ background: 'none', border: `1px solid ${Z.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 14, color: Z.muted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <LangToggle />
          <Btn variant="ghost" onClick={onSandbox}>{t('tryGuest')}</Btn>
          <Btn variant="emerald" onClick={handleSignIn} disabled={redirecting}>{redirecting ? t('signingIn') : t('signInGoogle')}</Btn>
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
          <Btn variant="emerald" onClick={onResume ?? handleSignIn} disabled={redirecting} style={{ fontSize: 14, padding: '10px 24px' }}>
            {onResume ? t('ctaStart') : redirecting ? t('signingIn') : t('ctaStart')}
          </Btn>
          {/* P0: sandbox CTA in hero too */}
          <Btn variant="ghost" onClick={onSandbox} style={{ fontSize: 14 }}>{t('tryGuest')}</Btn>
        </div>
        <div style={{ fontSize: 11, color: Z.muted }}>{t('scopeNote')}</div>
        {authError && <div style={{ fontSize: 12, color: Z.red, marginTop: 8 }}>⚠ {authError}</div>}
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
  const [darkMode, setDarkMode]     = useState(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('tf_dark_mode')
        if (saved !== null) return saved === 'true'
      } catch (e) { void e }
    }
    return true
  })
  const Z = darkMode ? DARK : LIGHT
  const toggleDark = () => {
    setDarkMode(d => {
      const next = !d
      try { localStorage.setItem('tf_dark_mode', String(next)) } catch (e) { void e }
      return next
    })
  }
  const [user, setUser]             = useState(() => {
    if (typeof window === 'undefined') return null
    return loadSession() || null
  })
  const [scene, setScene]           = useState(() => {
    if (typeof window === 'undefined') return 'landing'
    return loadSession() ? 'workspace' : 'landing'
  })
  const [transitioning, setTrans]   = useState(false)
  const [isMobile, setIsMobile]     = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  // Restore session (proper initialization since useState initializer can't call setUser)
  useEffect(() => {
    const saved = loadSession()
    if (saved && scene !== 'workspace') { setUser(saved); setScene('workspace') }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleSandbox = () => enter({ name: 'Guest', email: '', sandbox: true })
  const handleSignOut = () => {
    clearSession()
    setScene('landing')
    setUser(null)
  }

  // Handle OAuth redirect callback
  useEffect(() => {
    const result = parseAuthFromURL()
    if (!result) return
    if (result.error) { console.error('Auth error:', result.error); return }
    if (result.user) enter(result.user)
  }, []) // mount-only intentional

  return (
    <ThemeCtx.Provider value={Z}>
      <LangContext.Provider value={{ lang, setLang, t }}>
        <div style={{ fontFamily: "'Inter',system-ui,-apple-system,sans-serif", background: Z.bg, color: Z.text, minHeight: '100vh', fontSize: 14, lineHeight: 1.5, opacity: transitioning ? 0 : 1, transition: 'opacity .3s' }}>
          {scene === 'landing'    && <Landing onSandbox={handleSandbox} onResume={user ? () => setScene('workspace') : null} onToggleDark={toggleDark} darkMode={darkMode} />}
          {scene === 'workspace'  && <Workspace user={user} onSignOut={handleSignOut} onSignIn={() => enter({ name: t('demoUserName'), email: t('demoUserEmail') })} isMobile={isMobile} onToggleDark={toggleDark} darkMode={darkMode} />}
        </div>
      </LangContext.Provider>
    </ThemeCtx.Provider>
  )
}
