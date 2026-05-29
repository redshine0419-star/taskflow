import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
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
const TRANSLATIONS = {
  en: {
    // stages (internal keys → display labels)
    'stage.planning':   'Planning',
    'stage.design':     'Design',
    'stage.publishing': 'Publishing',
    'stage.dev':        'Dev',

    // priorities
    'priority.high':   'High',
    'priority.medium': 'Medium',
    'priority.low':    'Low',

    // landing — nav
    signInGoogle:  'G  Sign in with Google',
    signingIn:     'Connecting…',

    // landing — hero
    heroPill:      'BYOD · Serverless · Google Drive Native',
    heroTitle1:    'Store every team task',
    heroTitle2:    'in Google Drive',
    heroBody:      'Your data lives in your own Drive — no central server. Kanban board and spreadsheet stay in perfect two-way real-time sync.',
    ctaStart:      'Get started free →',
    ctaDemo:       'Watch demo',
    scopeNote:     '🔒 scope: drive.file — only accesses files this app creates',

    // landing — roi
    roiTitle:      'ROI Cost Savings Calculator',
    roiMembers:    'Team members',
    roiProjects:   'Projects',
    roiMonthlySave:'Monthly tool cost savings',
    roiAdsense:    'Est. AdSense monthly revenue',

    // landing — sync showcase
    syncTitle:     'Live Sync Widget',
    syncKanban:    'Kanban (click → next stage)',
    syncSheet:     'Google Sheet (instant update)',
    syncColTitle:  'Title',
    syncColStage:  'Stage',

    // landing — ai demo
    aiDemoTitle:   '◆ AI Parser — Try It',
    aiDemoPlaceholder: 'Paste meeting notes and click Analyze…',
    aiSample:      'Sample',
    aiAnalyze:     '◆ Analyze',
    aiAnalyzing:   'Analyzing…',

    // landing — feature pills
    feat1Title: 'Kanban + Spreadsheet',
    feat1Desc:  'Two-way real-time sync',
    feat2Title: 'AI Meeting Parser',
    feat2Desc:  'Gemini 2.5 Flash powered',
    feat3Title: 'Autopress SEO',
    feat3Desc:  'Auto-publish dev retrospectives',
    feat4Title: 'Full Privacy',
    feat4Desc:  'drive.file scope only',

    // workspace — header
    aiParserBtn:  '◆ AI Parser',
    syncLogBtn:   'SYNC LOG',
    signOut:      'Sign out',

    // workspace — tabs
    tabKanban:    'Kanban',
    tabSheet:     'Sheet',
    tabSEO:       'SEO',
    tabSettings:  'Settings',

    // kanban
    noTasks:      'No tasks',
    prevStage:    '◀ Prev',
    nextStage:    'Next ▶',
    publishBtn:   '↑ Autopress Publish',

    // spreadsheet
    colNum:       '#',
    colTitle:     'Title',
    colStage:     'Stage',
    colAssignee:  'Assignee',
    colDueDate:   'Due Date',
    colPriority:  'Priority',
    inlineEditLog:(id, field, val) => `Inline edit: row${id} [${field}] → "${val}"`,
    sheetSyncLog: (id, field) => `Sheets synced: row${id} [${field}] updated`,

    // autopress
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
    articleSummaryBody:(title) => `This task — ${title} — was managed in the TaskFlow workspace and successfully completed.`,
    articleWork:       'Key Deliverables',
    articleWork1:      'Requirements analysis & tech spec',
    articleWork2:      'UI/UX design & publishing complete',
    articleWork3:      'Code review & QA passed',
    articleWork4:      'Production deployment done',
    articleInsights:   'Outcomes & Insights',
    articleInsightsBody:(assignee, date) => `Led by ${assignee}, delivered on time by ${date}. Asana Jira alternative free kanban board — SEO optimized.`,
    autopressLog:      (title) => `Autopress article request: "${title}"`,
    autopressDoneLog:  'SEO article ready: taskflow.io/blog/',

    // settings
    settingCrawlerLabel: 'Allow Google crawler',
    settingCrawlerDesc:  'Expose Autopress posts to search engines',
    settingSyncLabel:    'Real-time auto-sync',
    settingSyncDesc:     'Google Sheets API two-way sync',
    settingNotifLabel:   'Sync notifications',
    settingNotifDesc:    'Show badge on sync success / failure',
    connectedAccount:    'CONNECTED ACCOUNT',
    driveConnected:      'Drive connected',
    scopeInfo:           '🔒 scope: drive.file — only accesses files created by this app. Your personal files remain inaccessible.',

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

    // task card
    publishedBadge: 'Published',

    // workspace init logs
    initLog1: 'Drive API: TaskFlow_Database_2026.xlsx provisioned',
    initLog2: 'Google Sheets: initialized (7 rows)',
    initLog3: 'Two-way real-time sync active',

    // sync logs from card/sheet actions
    sheetReqLog:  (rowNum, stage) => `Sheets API request: row${rowNum} col C → "${stage}"`,
    sheetDoneLog: (rowNum, stage) => `Sheets synced: row${rowNum} → "${stage}"`,
    publishReqLog:(title) => `Autopress publish request: "${title}"`,
    publishDoneLog:(slug) => `Published: taskflow.io/blog/${slug}`,
    appendReqLog: (n) => `Google Sheets append: ${n} row batch insert`,
    appendDoneLog:(n) => `Sheets API 200 · ${n} rows inserted`,

    // sample minutes
    sampleMinutes: `[2026-05-29 Dev Team Weekly]
Attendees: Alex, Jordan, Sam

1. Notification system refactor (assignee: Alex, due: 2026-07-15, priority: high) — planning stage
2. Dark mode toggle component (assignee: Jordan, due: 2026-07-20, priority: medium) — design stage
3. Performance monitoring dashboard (assignee: Sam, due: 2026-07-25, priority: high) — dev stage`,

    // ai parser fallback task
    fallbackTaskTitle: 'New Parsed Task',
    fallbackAssignee:  'Unassigned',

    // sign in demo user
    demoUserName: 'Alex Johnson',
    demoUserEmail: 'alex@example.com',
  },

  ko: {
    'stage.planning':   '기획',
    'stage.design':     '디자인',
    'stage.publishing': '퍼블',
    'stage.dev':        '개발',

    'priority.high':   '높음',
    'priority.medium': '보통',
    'priority.low':    '낮음',

    signInGoogle:  'G  Google로 시작',
    signingIn:     '연결 중…',

    heroPill:      'BYOD · 서버리스 · Google Drive 네이티브',
    heroTitle1:    '팀의 모든 업무를',
    heroTitle2:    '구글 드라이브에 저장하세요',
    heroBody:      '중앙 서버 없이 유저 개인 드라이브에 데이터를 저장합니다. 칸반보드와 스프레드시트가 실시간으로 양방향 동기화됩니다.',
    ctaStart:      '무료로 시작하기 →',
    ctaDemo:       '데모 영상 보기',
    scopeNote:     '🔒 scope: drive.file — 앱이 생성한 파일에만 접근합니다',

    roiTitle:      'ROI 예산 절감 계산기',
    roiMembers:    '팀원 수',
    roiProjects:   '프로젝트 수',
    roiMonthlySave:'월간 도구 비용 절감',
    roiAdsense:    '예상 애드센스 월 수익',

    syncTitle:     '실시간 싱크 체감 위젯',
    syncKanban:    '칸반 (클릭 → 다음 단계)',
    syncSheet:     '구글 시트 (즉시 반영)',
    syncColTitle:  '제목',
    syncColStage:  '단계',

    aiDemoTitle:   '◆ AI 파서 체험',
    aiDemoPlaceholder: '회의록을 붙여넣고 AI 분석을 눌러보세요…',
    aiSample:      '샘플',
    aiAnalyze:     '◆ AI 분석',
    aiAnalyzing:   '분석 중…',

    feat1Title: '칸반 + 스프레드시트',
    feat1Desc:  '양방향 실시간 동기화',
    feat2Title: 'AI 회의록 파서',
    feat2Desc:  'Gemini 2.5 Flash 연동',
    feat3Title: 'Autopress SEO',
    feat3Desc:  '개발 회고록 자동 발행',
    feat4Title: '완전한 프라이버시',
    feat4Desc:  'drive.file 스코프 제한',

    aiParserBtn:  '◆ AI 파서',
    syncLogBtn:   'SYNC LOG',
    signOut:      '로그아웃',

    tabKanban:    '칸반',
    tabSheet:     '시트',
    tabSEO:       'SEO',
    tabSettings:  '설정',

    noTasks:      '태스크 없음',
    prevStage:    '◀ 이전',
    nextStage:    '다음 ▶',
    publishBtn:   '↑ Autopress 발행',

    colNum:       '#',
    colTitle:     '제목',
    colStage:     '단계',
    colAssignee:  '담당자',
    colDueDate:   '마감일',
    colPriority:  '우선순위',
    inlineEditLog:(id, field, val) => `인라인 편집: row${id} [${field}] → "${val}"`,
    sheetSyncLog: (id, field) => `Sheets 동기화: row${id} [${field}] 업데이트`,

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
    articleSummaryBody:(title) => `본 태스크는 TaskFlow 워크스페이스에서 관리된 ${title} 작업의 최종 완료 회고록입니다.`,
    articleWork:       '주요 작업 내역',
    articleWork1:      '요건 분석 및 기술 스펙 정의',
    articleWork2:      'UI/UX 설계 및 퍼블리싱 완료',
    articleWork3:      '코드 리뷰 및 QA 테스트 통과',
    articleWork4:      '프로덕션 배포 완료',
    articleInsights:   '성과 및 인사이트',
    articleInsightsBody:(assignee, date) => `${assignee} 담당자 주도 하에 ${date} 기한 내 성공적으로 완료하였습니다. 아사나 지라 대체 무료 칸반보드 SEO 최적화 완료.`,
    autopressLog:      (title) => `Autopress SEO 아티클 생성 요청: "${title}"`,
    autopressDoneLog:  'SEO 아티클 생성 완료: taskflow.io/blog/',

    settingCrawlerLabel: '구글 크롤봇 수집 허용',
    settingCrawlerDesc:  'Autopress 발행 포스트를 검색 엔진에 공개합니다',
    settingSyncLabel:    '실시간 자동 동기화',
    settingSyncDesc:     'Google Sheets API 자동 양방향 동기화',
    settingNotifLabel:   '동기화 알림',
    settingNotifDesc:    '싱크 성공/실패 시 콘솔 배지에 알림 표시',
    connectedAccount:    '연결된 계정',
    driveConnected:      'Drive 연결됨',
    scopeInfo:           '🔒 scope: drive.file — 앱이 생성한 파일에만 접근. 개인 파일 접근 불가.',

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

    publishedBadge: '발행됨',

    initLog1: 'Drive API: TaskFlow_Database_2026.xlsx 생성 완료',
    initLog2: 'Google Sheets: 시트 초기화 완료 (7행)',
    initLog3: '양방향 실시간 동기화 활성화',

    sheetReqLog:  (rowNum, stage) => `Sheets API 요청: row${rowNum} C열 → "${stage}"`,
    sheetDoneLog: (rowNum, stage) => `Sheets 동기화 완료: row${rowNum} "${stage}"`,
    publishReqLog:(title) => `Autopress 발행 요청: "${title}"`,
    publishDoneLog:(slug) => `발행 완료: taskflow.io/blog/${slug}`,
    appendReqLog: (n) => `Google Sheets append 요청: ${n}행 일괄 적재`,
    appendDoneLog:(n) => `Sheets API 응답 200 · ${n}개 행 삽입 완료`,

    sampleMinutes: `[2026-05-29 개발팀 주간 회의]
참석: 김민준, 이서연, 박지호

1. 알림 시스템 리팩터링 (담당: 박지호, 마감: 2026-07-15, 우선순위: 높음) — 기획 단계
2. 다크모드 토글 컴포넌트 개발 (담당: 이서연, 마감: 2026-07-20, 우선순위: 보통) — 디자인 단계
3. 성능 모니터링 대시보드 (담당: 김민준, 마감: 2026-07-25, 우선순위: 높음) — 개발 단계`,

    fallbackTaskTitle: '신규 파싱 태스크',
    fallbackAssignee:  '미배정',

    demoUserName:  '김민준',
    demoUserEmail: 'minj@example.com',
  },
}

// ─── LANG CONTEXT ────────────────────────────────────────────────────────────
const LangContext = createContext(null)

function useLang() {
  return useContext(LangContext)
}

// ─── INTERNAL CONSTANTS (language-agnostic keys) ─────────────────────────────
const STAGE_KEYS    = ['planning', 'design', 'publishing', 'dev']
const PRIORITY_KEYS = ['high', 'medium', 'low']

const INITIAL_TASKS = [
  { id: 1, title: 'Homepage Renewal Planning',    stage: 'planning',   assignee: 'Alex',   dueDate: '2026-06-10', priority: 'high',   rowNum: 2, published: false },
  { id: 2, title: 'Login UI Wireframe',           stage: 'design',     assignee: 'Jordan', dueDate: '2026-06-15', priority: 'medium', rowNum: 3, published: false },
  { id: 3, title: 'Main Landing Publishing',      stage: 'publishing', assignee: 'Sam',    dueDate: '2026-06-20', priority: 'medium', rowNum: 4, published: false },
  { id: 4, title: 'API Auth Module',              stage: 'dev',        assignee: 'Casey',  dueDate: '2026-06-25', priority: 'high',   rowNum: 5, published: false },
  { id: 5, title: 'Dashboard Component Design',   stage: 'planning',   assignee: 'Morgan', dueDate: '2026-07-01', priority: 'low',    rowNum: 6, published: false },
  { id: 6, title: 'Mobile Responsive Design',     stage: 'design',     assignee: 'Jordan', dueDate: '2026-07-05', priority: 'high',   rowNum: 7, published: false },
  { id: 7, title: 'Search Feature Implementation',stage: 'dev',        assignee: 'Alex',   dueDate: '2026-07-10', priority: 'medium', rowNum: 8, published: true  },
]

// ─── UTILS ───────────────────────────────────────────────────────────────────
let logId = 0
const makeLog = (msg, type = 'info') => ({
  id: ++logId,
  time: new Date().toLocaleTimeString('en-US', { hour12: false }),
  msg,
  type,
})

const simulateApiCall = (desc, duration = 400) =>
  new Promise(resolve => setTimeout(() => resolve({ ok: true, desc }), duration))

// ─── LANG TOGGLE ─────────────────────────────────────────────────────────────
function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div style={{
      display: 'flex',
      border: `1px solid ${Z.border}`,
      borderRadius: 6,
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      {['en', 'ko'].map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '4px 9px',
            fontSize: 11, fontWeight: 700,
            border: 'none', cursor: 'pointer',
            background: lang === l ? Z.border : 'transparent',
            color: lang === l ? Z.text : Z.muted,
            transition: 'background .15s, color .15s',
            letterSpacing: 0.5,
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ children, color = Z.muted }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 7px', borderRadius: 4,
      fontSize: 11, fontWeight: 600,
      border: `1px solid ${color}33`, color, background: `${color}18`,
    }}>
      {children}
    </span>
  )
}

function PriorityBadge({ priorityKey }) {
  const { t } = useLang()
  const colors = { high: Z.red, medium: Z.amber, low: Z.muted }
  return (
    <Badge color={colors[priorityKey] || Z.muted}>
      {t(`priority.${priorityKey}`)}
    </Badge>
  )
}

// ─── BUTTON ──────────────────────────────────────────────────────────────────
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
    default: { background: Z.border, color: Z.text },
    primary: { background: Z.indigo, color: '#fff' },
    emerald: { background: Z.emerald, color: '#052e16' },
    ghost:   { background: 'transparent', color: Z.muted, padding: small ? '3px 6px' : '6px 10px' },
    danger:  { background: '#7f1d1d33', color: Z.red, border: `1px solid ${Z.red}33` },
  }
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

// ─── SELECT ──────────────────────────────────────────────────────────────────
function Select({ value, onChange, options, style }) {
  // options: array of { value, label } or plain strings
  const normalized = options.map(o => typeof o === 'string' ? { value: o, label: o } : o)
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      background: Z.surface, border: `1px solid ${Z.border}`,
      borderRadius: 6, color: Z.text, fontSize: 12, padding: '4px 8px',
      outline: 'none', cursor: 'pointer', ...style,
    }}>
      {normalized.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

// ─── TOGGLE ──────────────────────────────────────────────────────────────────
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

// ─── SIDE DRAWER ─────────────────────────────────────────────────────────────
function SideDrawer({ open, onClose, logs }) {
  const { t } = useLang()
  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 40,
        }} />
      )}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: Math.min(380, typeof window !== 'undefined' ? window.innerWidth : 380),
        height: '100vh', background: Z.surface, borderLeft: `1px solid ${Z.border}`,
        zIndex: 50,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${Z.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: Z.emerald, letterSpacing: 1 }}>
            {t('drawerTitle')}
          </span>
          <Btn variant="ghost" small onClick={onClose}>✕</Btn>
        </div>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '12px 16px',
          fontFamily: "'JetBrains Mono','Fira Code',monospace",
          fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {logs.length === 0 && (
            <div style={{ color: Z.muted, textAlign: 'center', marginTop: 40 }}>
              {t('drawerEmpty')}
            </div>
          )}
          {[...logs].reverse().map(l => (
            <div key={l.id} style={{
              display: 'flex', gap: 8, alignItems: 'flex-start',
              padding: '4px 0', borderBottom: `1px solid ${Z.border}`,
            }}>
              <span style={{ color: Z.muted, flexShrink: 0 }}>{l.time}</span>
              <span style={{
                color: l.type === 'success' ? Z.emerald : l.type === 'error' ? Z.red
                  : l.type === 'ai' ? Z.indigo : Z.muted,
              }}>
                {l.type === 'success' ? '✓' : l.type === 'error' ? '✗' : l.type === 'ai' ? '◆' : '›'}
              </span>
              <span style={{ color: Z.text, wordBreak: 'break-all' }}>{l.msg}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 16px', borderTop: `1px solid ${Z.border}`, color: Z.muted, fontSize: 10 }}>
          {t('drawerFooter')}
        </div>
      </div>
    </>
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
    await simulateApiCall('gemini', 600)

    const parsed = []
    const lines = text.split('\n').filter(l => l.trim())
    let nextId = Date.now()

    lines.forEach(line => {
      // Match both EN and KO patterns
      const titleMatch = line.match(/^\d+\.\s+(.+?)\s*[\(（]/)
      const assigneeMatch = line.match(/(?:assignee|담당)[:\s：]+([^\s,()]+)/i)
      const dueDateMatch  = line.match(/(?:due|마감)[:\s：]+([\d\-]+)/i)
      const priorityEnMatch = line.match(/priority[:\s：]+(high|medium|low)/i)
      const priorityKoMatch = line.match(/우선순위[:\s：]+(높음|보통|낮음)/)
      const stageEnMatch  = line.match(/(planning|design|publishing|dev)\s*stage/i)
      const stageKoMatch  = line.match(/(기획|디자인|퍼블|개발)\s*단계/)

      const priorityMap = { '높음': 'high', '보통': 'medium', '낮음': 'low' }
      const stageKoMap  = { '기획': 'planning', '디자인': 'design', '퍼블': 'publishing', '개발': 'dev' }

      const rawPriority = priorityEnMatch
        ? priorityEnMatch[1].toLowerCase()
        : priorityKoMatch ? priorityMap[priorityKoMatch[1]] : 'medium'

      const rawStage = stageEnMatch
        ? stageEnMatch[1].toLowerCase()
        : stageKoMatch ? stageKoMap[stageKoMatch[1]] : 'planning'

      if (titleMatch || (assigneeMatch && dueDateMatch)) {
        parsed.push({
          id: nextId++,
          title: titleMatch ? titleMatch[1].trim() : `Task #${parsed.length + 1}`,
          assignee: assigneeMatch ? assigneeMatch[1] : t('fallbackAssignee'),
          dueDate:  dueDateMatch  ? dueDateMatch[1]  : '',
          priority: rawPriority,
          stage:    rawStage,
          rowNum:   100 + parsed.length,
          published: false,
        })
      }
    })

    if (parsed.length === 0) {
      parsed.push({
        id: nextId,
        title:    t('fallbackTaskTitle'),
        assignee: t('fallbackAssignee'),
        dueDate:  '2026-07-31',
        priority: 'medium',
        stage:    'planning',
        rowNum:   100,
        published: false,
      })
    }

    setResults(parsed)
    addLog(t('aiParsedLog')(parsed.length), 'ai')
    setLoading(false)
  }

  const confirm = async () => {
    addLog(t('aiAppendLog')(results.length), 'info')
    await simulateApiCall('sheets_append', 500)
    addLog(t('aiAppendDoneLog')(results.length), 'success')
    onConfirm(results)
    setText('')
    setResults(null)
    onClose()
  }

  const close = () => { setText(''); setResults(null); onClose() }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)',
      zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 12,
        width: '100%', maxWidth: 640, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          padding: '18px 24px', borderBottom: `1px solid ${Z.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
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
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t('sampleMinutes')}
                rows={10}
                style={{
                  width: '100%', background: Z.bg, border: `1px solid ${Z.border}`,
                  borderRadius: 8, color: Z.text, fontSize: 12, padding: 12,
                  resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              <div style={{ marginTop: 12 }}>
                <Btn variant="ghost" small onClick={() => setText(t('sampleMinutes'))}>
                  {t('aiLoadSample')}
                </Btn>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 12, color: Z.muted, marginBottom: 12 }}>
                {t('aiExtracted')(results.length)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.map((task, i) => (
                  <div key={task.id} style={{
                    background: Z.bg, border: `1px solid ${Z.border}`,
                    borderRadius: 8, padding: '12px 14px',
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{i + 1}. {task.title}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, color: Z.muted }}>
                      <span>{t('aiStageLabel')}: <span style={{ color: Z.indigo }}>{t(`stage.${task.stage}`)}</span></span>
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

        <div style={{
          padding: '16px 24px', borderTop: `1px solid ${Z.border}`,
          display: 'flex', gap: 8, justifyContent: 'flex-end',
        }}>
          {!results ? (
            <>
              <Btn variant="ghost" onClick={close}>{t('aiCancel')}</Btn>
              <Btn variant="primary" onClick={parse} disabled={loading || !text.trim()}>
                {loading ? t('aiAnalyzing') : t('aiAnalyzeBtn')}
              </Btn>
            </>
          ) : (
            <>
              <Btn variant="ghost" onClick={() => setResults(null)}>{t('aiReEnter')}</Btn>
              <Btn variant="emerald" onClick={confirm}>{t('aiConfirm')}</Btn>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── TASK CARD ────────────────────────────────────────────────────────────────
function TaskCard({ task, isMobile, onStageChange, onPublish, addLog }) {
  const { t } = useLang()
  const stageIdx = STAGE_KEYS.indexOf(task.stage)

  const moveStage = async (dir) => {
    const newStageKey = STAGE_KEYS[stageIdx + dir]
    if (!newStageKey) return
    addLog(t('sheetReqLog')(task.rowNum, t(`stage.${newStageKey}`)), 'info')
    onStageChange(task.id, newStageKey)
    simulateApiCall('sheets_update', 350).then(() =>
      addLog(t('sheetDoneLog')(task.rowNum, t(`stage.${newStageKey}`)), 'success')
    )
  }

  return (
    <div style={{
      background: Z.surface, border: `1px solid ${Z.border}`,
      borderRadius: 8, padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4 }}>{task.title}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', fontSize: 11, color: Z.muted }}>
        <span>👤 {task.assignee}</span>
        <span>📅 {task.dueDate}</span>
        <PriorityBadge priorityKey={task.priority} />
        {task.published && <Badge color={Z.emerald}>{t('publishedBadge')}</Badge>}
      </div>
      {isMobile && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Btn variant="ghost" small onClick={() => moveStage(-1)} disabled={stageIdx === 0}
            style={{ flex: 1, justifyContent: 'center' }}>
            {t('prevStage')}
          </Btn>
          <span style={{ fontSize: 10, color: Z.muted, flexShrink: 0 }}>{t(`stage.${task.stage}`)}</span>
          <Btn variant="ghost" small onClick={() => moveStage(1)} disabled={stageIdx === STAGE_KEYS.length - 1}
            style={{ flex: 1, justifyContent: 'center' }}>
            {t('nextStage')}
          </Btn>
        </div>
      )}
      {task.stage === 'dev' && !task.published && (
        <Btn variant="emerald" small onClick={() => onPublish(task.id)}>
          {t('publishBtn')}
        </Btn>
      )}
    </div>
  )
}

// ─── KANBAN VIEW ─────────────────────────────────────────────────────────────
function KanbanView({ tasks, isMobile, onStageChange, onPublish, addLog }) {
  const { t } = useLang()
  const [activeStageIdx, setActiveStageIdx] = useState(0)
  const visibleStages = isMobile ? [STAGE_KEYS[activeStageIdx]] : STAGE_KEYS

  return (
    <div>
      {isMobile && (
        <div style={{
          display: 'flex', border: `1px solid ${Z.border}`,
          borderRadius: 8, overflow: 'hidden', marginBottom: 16,
        }}>
          {STAGE_KEYS.map((key, i) => (
            <button key={key} onClick={() => setActiveStageIdx(i)} style={{
              flex: 1, padding: '8px 4px', background: i === activeStageIdx ? Z.indigo + '33' : 'transparent',
              border: 'none', borderRight: i < STAGE_KEYS.length - 1 ? `1px solid ${Z.border}` : 'none',
              color: i === activeStageIdx ? Z.indigo : Z.muted,
              fontSize: 12, fontWeight: i === activeStageIdx ? 700 : 400, cursor: 'pointer',
            }}>
              {t(`stage.${key}`)}
            </button>
          ))}
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : `repeat(${STAGE_KEYS.length}, 1fr)`,
        gap: 12,
      }}>
        {visibleStages.map(stageKey => {
          const stageTasks = tasks.filter(task => task.stage === stageKey)
          return (
            <div key={stageKey}>
              {!isMobile && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${Z.border}`,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: Z.muted }}>{t(`stage.${stageKey}`)}</span>
                  <span style={{
                    fontSize: 10, background: Z.border,
                    borderRadius: 10, padding: '1px 7px', color: Z.muted,
                  }}>{stageTasks.length}</span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stageTasks.length === 0 && !isMobile && (
                  <div style={{
                    border: `1px dashed ${Z.border}`, borderRadius: 8,
                    padding: 20, textAlign: 'center', color: Z.muted, fontSize: 12,
                  }}>
                    {t('noTasks')}
                  </div>
                )}
                {stageTasks.map(task => (
                  <TaskCard key={task.id} task={task} isMobile={isMobile}
                    onStageChange={onStageChange} onPublish={onPublish} addLog={addLog} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── INLINE INPUT ────────────────────────────────────────────────────────────
function InlineInput({ value, onChange, type = 'text' }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  useEffect(() => { setVal(value) }, [value])
  const commit = () => { setEditing(false); if (val !== value) onChange(val) }

  if (editing) {
    return (
      <input autoFocus type={type} value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit() }}
        style={{
          background: Z.bg, border: `1px solid ${Z.indigo}`,
          borderRadius: 4, color: Z.text, fontSize: 12,
          padding: '3px 6px', outline: 'none', width: '100%',
        }}
      />
    )
  }
  return (
    <div onClick={() => setEditing(true)} style={{
      padding: '3px 6px', borderRadius: 4, cursor: 'text',
      fontSize: 12, minHeight: 22, border: '1px solid transparent', transition: 'border-color .1s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = Z.border}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
    >
      {value || <span style={{ color: Z.muted }}>—</span>}
    </div>
  )
}

// ─── SPREADSHEET VIEW ────────────────────────────────────────────────────────
function SpreadsheetView({ tasks, onUpdateTask, addLog }) {
  const { t } = useLang()
  const stageOptions  = STAGE_KEYS.map(k => ({ value: k, label: t(`stage.${k}`) }))
  const priorityOptions = PRIORITY_KEYS.map(k => ({ value: k, label: t(`priority.${k}`) }))

  const update = async (id, field, value) => {
    addLog(t('inlineEditLog')(id, field, value), 'info')
    onUpdateTask(id, field, value)
    simulateApiCall('sheets_update', 300).then(() =>
      addLog(t('sheetSyncLog')(id, field), 'success')
    )
  }

  const cols = [
    t('colNum'), t('colTitle'), t('colStage'),
    t('colAssignee'), t('colDueDate'), t('colPriority'),
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${Z.border}` }}>
            {cols.map(c => (
              <th key={c} style={{
                padding: '8px 10px', textAlign: 'left',
                color: Z.muted, fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap',
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <tr key={task.id}
              style={{ borderBottom: `1px solid ${Z.border}`, transition: 'background .1s' }}
              onMouseEnter={e => e.currentTarget.style.background = Z.surface}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '6px 10px', color: Z.muted }}>{i + 1}</td>
              <td style={{ padding: '4px 6px', minWidth: 180 }}>
                <InlineInput value={task.title} onChange={v => update(task.id, 'title', v)} />
              </td>
              <td style={{ padding: '4px 6px' }}>
                <Select value={task.stage} onChange={v => update(task.id, 'stage', v)} options={stageOptions} />
              </td>
              <td style={{ padding: '4px 6px', minWidth: 80 }}>
                <InlineInput value={task.assignee} onChange={v => update(task.id, 'assignee', v)} />
              </td>
              <td style={{ padding: '4px 6px', minWidth: 100 }}>
                <InlineInput value={task.dueDate} onChange={v => update(task.id, 'dueDate', v)} type="date" />
              </td>
              <td style={{ padding: '4px 6px' }}>
                <Select value={task.priority} onChange={v => update(task.id, 'priority', v)} options={priorityOptions} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── AUTOPRESS VIEW ──────────────────────────────────────────────────────────
function AutopressView({ tasks, addLog }) {
  const { t } = useLang()
  const [selected, setSelected] = useState(null)
  const [article, setArticle] = useState(null)
  const [generating, setGenerating] = useState(false)

  const published = tasks.filter(task => task.published)

  const genArticle = async (task) => {
    setSelected(task)
    setGenerating(true)
    setArticle(null)
    addLog(t('autopressLog')(task.title), 'ai')
    await simulateApiCall('autopress', 700)

    const slug = task.title.replace(/\s+/g, '-').toLowerCase()
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
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, marginBottom: 10, letterSpacing: 1 }}>
          {t('publishedTasks')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {published.length === 0 && (
            <div style={{ color: Z.muted, fontSize: 12 }}>{t('publishHint')}</div>
          )}
          {published.map(task => (
            <div key={task.id} onClick={() => genArticle(task)} style={{
              background: selected?.id === task.id ? `${Z.indigo}22` : Z.surface,
              border: `1px solid ${selected?.id === task.id ? Z.indigo : Z.border}`,
              borderRadius: 8, padding: '10px 12px', cursor: 'pointer', transition: 'border-color .15s',
            }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{task.title}</div>
              <div style={{ fontSize: 11, color: Z.muted, marginTop: 3 }}>{task.assignee} · {task.dueDate}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {generating && (
          <div style={{ color: Z.indigo, fontSize: 13, padding: 20 }}>{t('articleGenerating')}</div>
        )}
        {article && !generating && (
          <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: Z.emerald, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
              {t('articleLabel')}
            </div>
            <pre style={{ fontFamily: 'inherit', fontSize: 12, color: Z.text, whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.7 }}>
              {article}
            </pre>
          </div>
        )}
        {!article && !generating && (
          <div style={{
            border: `1px dashed ${Z.border}`, borderRadius: 8,
            padding: 40, textAlign: 'center', color: Z.muted, fontSize: 12,
          }}>
            {t('articleHint')}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SETTINGS VIEW ───────────────────────────────────────────────────────────
function SettingsView({ user }) {
  const { t } = useLang()
  const [isPublic, setIsPublic] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [autoSync, setAutoSync] = useState(true)

  const items = [
    { label: t('settingCrawlerLabel'), desc: t('settingCrawlerDesc'), value: isPublic,       set: setIsPublic },
    { label: t('settingSyncLabel'),    desc: t('settingSyncDesc'),    value: autoSync,        set: setAutoSync },
    { label: t('settingNotifLabel'),   desc: t('settingNotifDesc'),   value: notifications,   set: setNotifications },
  ]

  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.map((item, i) => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 0', borderBottom: i < items.length - 1 ? `1px solid ${Z.border}` : 'none',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: Z.muted, marginTop: 2 }}>{item.desc}</div>
            </div>
            <Toggle checked={item.value} onChange={item.set} />
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 24, background: Z.surface, border: `1px solid ${Z.border}`,
        borderRadius: 8, padding: '14px 16px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: Z.muted, marginBottom: 8, letterSpacing: 1 }}>
          {t('connectedAccount')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: Z.indigo + '44',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: Z.indigo,
          }}>
            {user?.name?.[0] ?? 'U'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name ?? 'User'}</div>
            <div style={{ fontSize: 11, color: Z.muted }}>{user?.email ?? ''}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Badge color={Z.emerald}>{t('driveConnected')}</Badge>
          </div>
        </div>
        <div style={{
          marginTop: 10, fontSize: 10, color: Z.muted,
          padding: '6px 8px', background: Z.bg, borderRadius: 4,
        }}>
          {t('scopeInfo')}
        </div>
      </div>
    </div>
  )
}

// ─── WORKSPACE ───────────────────────────────────────────────────────────────
function Workspace({ user, onSignOut, isMobile }) {
  const { t } = useLang()
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [activeTab, setActiveTab] = useState('kanban')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [aiModalOpen, setAIModalOpen] = useState(false)
  const [logs, setLogs] = useState(() => [
    makeLog(t('initLog1'), 'success'),
    makeLog(t('initLog2'), 'success'),
    makeLog(t('initLog3'), 'info'),
  ])
  const [newLogCount, setNewLogCount] = useState(0)
  const drawerOpenRef = useRef(false)

  useEffect(() => { drawerOpenRef.current = drawerOpen }, [drawerOpen])

  const addLog = useCallback((msg, type = 'info') => {
    setLogs(prev => [...prev, makeLog(msg, type)])
    if (!drawerOpenRef.current) setNewLogCount(n => n + 1)
  }, [])

  const openDrawer = () => { setDrawerOpen(true); setNewLogCount(0) }

  const onStageChange = (id, newStageKey) =>
    setTasks(prev => prev.map(task => task.id === id ? { ...task, stage: newStageKey } : task))

  const onUpdateTask = (id, field, value) =>
    setTasks(prev => prev.map(task => task.id === id ? { ...task, [field]: value } : task))

  const onPublish = async (id) => {
    const task = tasks.find(task => task.id === id)
    addLog(t('publishReqLog')(task.title), 'ai')
    setTasks(prev => prev.map(task => task.id === id ? { ...task, published: true } : task))
    await simulateApiCall('publish', 400)
    addLog(t('publishDoneLog')(task.title.replace(/\s+/g, '-').toLowerCase()), 'success')
  }

  const onAIConfirm = (newTasks) => setTasks(prev => [...prev, ...newTasks])

  const tabs = [
    { id: 'kanban',    label: t('tabKanban'),   icon: '⬡' },
    { id: 'sheet',     label: t('tabSheet'),    icon: '⊞' },
    { id: 'blog',      label: t('tabSEO'),      icon: '↑' },
    { id: 'settings',  label: t('tabSettings'), icon: '⚙' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{
        borderBottom: `1px solid ${Z.border}`,
        padding: isMobile ? '10px 16px' : '10px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 20, background: Z.bg,
      }}>
        <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.5 }}>
          Task<span style={{ color: Z.emerald }}>Flow</span>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, marginLeft: 8 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? Z.border : 'transparent',
                color: activeTab === tab.id ? Z.text : Z.muted,
                fontSize: 12, fontWeight: activeTab === tab.id ? 600 : 400,
                transition: 'all .15s',
              }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <LangToggle />
          <Btn variant="primary" small onClick={() => setAIModalOpen(true)}>
            {t('aiParserBtn')}
          </Btn>
          <button onClick={openDrawer} style={{
            position: 'relative', background: Z.surface, border: `1px solid ${Z.border}`,
            borderRadius: 6, padding: '5px 10px', cursor: 'pointer',
            color: Z.muted, fontSize: 11, fontWeight: 700,
          }}>
            {t('syncLogBtn')}
            {newLogCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: Z.emerald, color: '#052e16',
                borderRadius: 10, fontSize: 9, padding: '1px 5px', fontWeight: 800,
              }}>
                {newLogCount}
              </span>
            )}
          </button>
          {!isMobile && (
            <Btn variant="ghost" small onClick={onSignOut}>{t('signOut')}</Btn>
          )}
        </div>
      </header>

      <main style={{
        flex: 1, padding: isMobile ? '16px 16px 80px' : '24px',
        maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box',
      }}>
        {activeTab === 'kanban'   && <KanbanView tasks={tasks} isMobile={isMobile} onStageChange={onStageChange} onPublish={onPublish} addLog={addLog} />}
        {activeTab === 'sheet'    && <SpreadsheetView tasks={tasks} onUpdateTask={onUpdateTask} addLog={addLog} />}
        {activeTab === 'blog'     && <AutopressView tasks={tasks} addLog={addLog} />}
        {activeTab === 'settings' && <SettingsView user={user} />}
      </main>

      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: Z.surface, borderTop: `1px solid ${Z.border}`,
          display: 'flex', zIndex: 30,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '10px 4px 8px', border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: activeTab === tab.id ? Z.indigo : Z.muted, fontSize: 18,
            }}>
              <span>{tab.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600 }}>{tab.label}</span>
            </button>
          ))}
        </nav>
      )}

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} logs={logs} />
      <AIParserModal open={aiModalOpen} onClose={() => setAIModalOpen(false)} onConfirm={onAIConfirm} addLog={addLog} />
    </div>
  )
}

// ─── LANDING WIDGETS ─────────────────────────────────────────────────────────
function ROICalculator() {
  const { t, lang } = useLang()
  const [members, setMembers] = useState(5)
  const [projects, setProjects] = useState(3)
  const monthly = members * projects * 4200
  const adsense = Math.round(projects * 2.3 * 1000)
  const curr = lang === 'ko' ? `₩${monthly.toLocaleString()}` : `$${Math.round(monthly / 1300).toLocaleString()}`
  const currA = lang === 'ko' ? `₩${adsense.toLocaleString()}` : `$${Math.round(adsense / 1300).toLocaleString()}`

  return (
    <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 16 }}>
        {t('roiTitle')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: Z.muted, marginBottom: 6 }}>
            {t('roiMembers')}: <strong style={{ color: Z.text }}>{members}</strong>
          </div>
          <input type="range" min={1} max={50} value={members}
            onChange={e => setMembers(+e.target.value)}
            style={{ width: '100%', accentColor: Z.emerald }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: Z.muted, marginBottom: 6 }}>
            {t('roiProjects')}: <strong style={{ color: Z.text }}>{projects}</strong>
          </div>
          <input type="range" min={1} max={20} value={projects}
            onChange={e => setProjects(+e.target.value)}
            style={{ width: '100%', accentColor: Z.indigo }} />
        </div>
        <div style={{ background: Z.bg, borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: Z.muted }}>{t('roiMonthlySave')}</span>
            <span style={{ fontWeight: 800, color: Z.emerald, fontSize: 16 }}>{curr}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: Z.muted }}>{t('roiAdsense')}</span>
            <span style={{ fontWeight: 800, color: Z.indigo, fontSize: 16 }}>{currA}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SyncShowcase() {
  const { t } = useLang()
  const [stages, setStages] = useState([0, 1, 3])
  const [activeCell, setActiveCell] = useState(null)
  const [apiLogs, setApiLogs] = useState([])

  const demoCards = [
    { id: 1, titleKey: 'Planning Doc' },
    { id: 2, titleKey: 'UI Design' },
    { id: 3, titleKey: 'Frontend Dev' },
  ]

  const clickCard = (i) => {
    const next = (stages[i] + 1) % 4
    const nextLabel = t(`stage.${STAGE_KEYS[next]}`)
    setStages(prev => { const a = [...prev]; a[i] = next; return a })
    setActiveCell(i)
    setApiLogs(prev => [
      { id: Date.now(), msg: `PUT /v4/spreadsheets row${i + 2} col C → "${nextLabel}" 200 OK` },
      ...prev.slice(0, 3),
    ])
    setTimeout(() => setActiveCell(null), 600)
  }

  return (
    <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 16 }}>
        {t('syncTitle')}
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 130 }}>
          <div style={{ fontSize: 10, color: Z.muted, marginBottom: 8 }}>{t('syncKanban')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {demoCards.map((c, i) => (
              <div key={c.id} onClick={() => clickCard(i)} style={{
                background: Z.bg, border: `1px solid ${Z.border}`,
                borderRadius: 6, padding: '8px 10px', cursor: 'pointer', fontSize: 12,
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = Z.emerald}
                onMouseLeave={e => e.currentTarget.style.borderColor = Z.border}
              >
                <div style={{ fontWeight: 600 }}>{c.titleKey}</div>
                <div style={{ fontSize: 10, color: Z.emerald, marginTop: 2 }}>
                  {t(`stage.${STAGE_KEYS[stages[i]]}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 130 }}>
          <div style={{ fontSize: 10, color: Z.muted, marginBottom: 8 }}>{t('syncSheet')}</div>
          <table style={{ fontSize: 11, borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ color: Z.muted, textAlign: 'left', padding: '3px 6px', fontWeight: 600 }}>{t('syncColTitle')}</th>
                <th style={{ color: Z.muted, textAlign: 'left', padding: '3px 6px', fontWeight: 600 }}>{t('syncColStage')}</th>
              </tr>
            </thead>
            <tbody>
              {demoCards.map((c, i) => (
                <tr key={c.id} style={{ background: activeCell === i ? `${Z.emerald}22` : 'transparent', transition: 'background .3s' }}>
                  <td style={{ padding: '4px 6px', borderBottom: `1px solid ${Z.border}` }}>{c.titleKey}</td>
                  <td style={{
                    padding: '4px 6px', borderBottom: `1px solid ${Z.border}`,
                    color: activeCell === i ? Z.emerald : Z.text,
                    fontWeight: activeCell === i ? 700 : 400, transition: 'color .3s',
                  }}>
                    {t(`stage.${STAGE_KEYS[stages[i]]}`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {apiLogs.length > 0 && (
        <div style={{
          marginTop: 12, background: Z.bg, borderRadius: 6, padding: '8px 10px',
          fontFamily: 'monospace', fontSize: 10, color: Z.emerald,
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {apiLogs.map(l => <div key={l.id}>› {l.msg}</div>)}
        </div>
      )}
    </div>
  )
}

function AIDemo() {
  const { t } = useLang()
  const [text, setText] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    await simulateApiCall('demo', 800)
    setResults([
      { title: 'Notification System Refactor', stage: 'planning', priority: 'high' },
      { title: 'Dark Mode Toggle',             stage: 'design',   priority: 'medium' },
    ])
    setLoading(false)
  }

  return (
    <div style={{ background: Z.surface, border: `1px solid ${Z.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: Z.muted, letterSpacing: 1, marginBottom: 12 }}>
        {t('aiDemoTitle')}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder={t('aiDemoPlaceholder')} rows={4}
        style={{
          width: '100%', background: Z.bg, border: `1px solid ${Z.border}`,
          borderRadius: 6, color: Z.text, fontSize: 12, padding: 10,
          resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Btn variant="ghost" small onClick={() => { setText(t('sampleMinutes')); setResults(null) }}>
          {t('aiSample')}
        </Btn>
        <Btn variant="primary" small onClick={run} disabled={loading}>
          {loading ? t('aiAnalyzing') : t('aiAnalyze')}
        </Btn>
      </div>
      {results && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map((r, i) => (
            <div key={i} style={{
              background: Z.bg, border: `1px solid ${Z.indigo}44`,
              borderRadius: 6, padding: '8px 10px', fontSize: 11,
            }}>
              <span style={{ fontWeight: 700, color: Z.indigo }}>◆</span>{' '}
              {r.title} · {t(`stage.${r.stage}`)} · <PriorityBadge priorityKey={r.priority} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function Landing({ onSignIn }) {
  const { t } = useLang()
  const [signingIn, setSigningIn] = useState(false)

  const handleSignIn = async () => {
    setSigningIn(true)
    await simulateApiCall('oauth', 900)
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
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 0', borderBottom: `1px solid ${Z.border}`, marginBottom: 64,
        gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>
          Task<span style={{ color: Z.emerald }}>Flow</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <LangToggle />
          <Btn variant="emerald" onClick={handleSignIn} disabled={signingIn}>
            {signingIn ? t('signingIn') : t('signInGoogle')}
          </Btn>
        </div>
      </nav>

      <div style={{ textAlign: 'center', marginBottom: 72 }}>
        <div style={{
          display: 'inline-block',
          background: `${Z.indigo}22`, border: `1px solid ${Z.indigo}44`,
          borderRadius: 20, padding: '4px 14px',
          fontSize: 11, color: Z.indigo, fontWeight: 700,
          marginBottom: 20, letterSpacing: 1,
        }}>
          {t('heroPill')}
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, margin: '0 0 20px',
        }}>
          {t('heroTitle1')}<br />
          <span style={{ color: Z.emerald }}>{t('heroTitle2')}</span>
        </h1>
        <p style={{ fontSize: 15, color: Z.muted, maxWidth: 480, margin: '0 auto 32px' }}>
          {t('heroBody')}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn variant="emerald" onClick={handleSignIn} disabled={signingIn}
            style={{ fontSize: 14, padding: '10px 24px' }}>
            {signingIn ? t('signingIn') : t('ctaStart')}
          </Btn>
          <Btn variant="ghost" style={{ fontSize: 14 }}>{t('ctaDemo')}</Btn>
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: Z.muted }}>{t('scopeNote')}</div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16, marginBottom: 60,
      }}>
        <ROICalculator />
        <SyncShowcase />
        <AIDemo />
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12,
      }}>
        {features.map(f => (
          <div key={f.title} style={{
            background: Z.surface, border: `1px solid ${Z.border}`,
            borderRadius: 10, padding: '18px 20px',
          }}>
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
  const [lang, setLang] = useState('en')
  const [scene, setScene] = useState('landing')
  const [user, setUser] = useState(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // t() resolves a key against the current language, falling back to 'en'
  const t = useCallback((key) => {
    const dict = TRANSLATIONS[lang] ?? TRANSLATIONS.en
    return dict[key] ?? TRANSLATIONS.en[key] ?? key
  }, [lang])

  const langValue = { lang, setLang, t }

  const handleSignIn = async (userData) => {
    setUser(userData)
    setTransitioning(true)
    await simulateApiCall('transition', 300)
    setScene('workspace')
    setTransitioning(false)
  }

  const handleSignOut = () => { setScene('landing'); setUser(null) }

  return (
    <LangContext.Provider value={langValue}>
      <div style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: Z.bg, color: Z.text, minHeight: '100vh',
        fontSize: 14, lineHeight: 1.5,
        opacity: transitioning ? 0 : 1,
        transition: 'opacity .3s',
      }}>
        {scene === 'landing' && <Landing onSignIn={handleSignIn} />}
        {scene === 'workspace' && (
          <Workspace user={user} onSignOut={handleSignOut} isMobile={isMobile} />
        )}
      </div>
    </LangContext.Provider>
  )
}
