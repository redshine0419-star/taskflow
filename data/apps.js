/**
 * Portfolio gallery app registry.
 * Add a new app by appending an entry here — no component changes needed.
 *
 * @typedef {Object} PortfolioApp
 * @property {string} id - Unique slug, also used as the React key.
 * @property {string} name - Display name shown on the card.
 * @property {string} description - One-line summary shown on the card.
 * @property {string[]} tags - Tag badges; also drives the tag filter bar.
 * @property {"live"|"coming-soon"} status - "live" enables the demo button.
 * @property {string} demoPath - Internal route to the live demo.
 * @property {string} guidePath - Internal route to the usage guide.
 */

/** @type {PortfolioApp[]} */
export const apps = [
  {
    id: 'taskflow',
    name: 'TaskFlow',
    description: '구글 시트 기반의 서버리스 칸반 보드로 팀 작업을 관리해요.',
    tags: ['생산성', '칸반', '협업'],
    status: 'live',
    demoPath: '/apps/taskflow',
    guidePath: '/guides/taskflow',
  },
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    description: '뽀모도로 사이클로 집중 시간과 휴식을 자동으로 관리해줘요.',
    tags: ['생산성', '타이머'],
    status: 'live',
    demoPath: '/apps/focus-timer',
    guidePath: '/guides/focus-timer',
  },
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    description: '카테고리별 지출을 기록하고 월별 소비 패턴을 한눈에 봐요.',
    tags: ['가계부', '데이터'],
    status: 'live',
    demoPath: '/apps/expense-tracker',
    guidePath: '/guides/expense-tracker',
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: '매일의 습관을 체크하고 연속 기록(스트릭)으로 동기부여해요.',
    tags: ['생산성', '습관'],
    status: 'live',
    demoPath: '/apps/habit-tracker',
    guidePath: '/guides/habit-tracker',
  },
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracker',
    description: '6개월 PPL 스플릿 운동 플랜과 인바디 기록을 관리해요.',
    tags: ['피트니스', '헬스', '플래너'],
    status: 'live',
    demoPath: '/apps/fitness-tracker',
    guidePath: '/guides/fitness-tracker',
  },
  {
    id: 'chatbot',
    name: 'Chatbot',
    description: '멀티 모델 선택이 가능한 AI 챗봇 UI를 체험해봐요.',
    tags: ['AI', '챗봇'],
    status: 'live',
    demoPath: '/apps/chatbot',
    guidePath: '/guides/chatbot',
  },
  {
    id: 'service-dashboard',
    name: 'Service Dashboard',
    description: '여러 서비스의 현황·비용·AI 플랜을 한 화면에서 관리해요.',
    tags: ['운영', '대시보드', 'AI'],
    status: 'live',
    demoPath: '/apps/service-dashboard',
    guidePath: '/guides/service-dashboard',
  },
  {
    id: 'flavorsync',
    name: 'FlavorSync',
    description: '레시피 위키와 2구 요리 모드, 냉장고 관리를 한 번에 해봐요.',
    tags: ['레시피', '요리', '블로그'],
    status: 'live',
    demoPath: '/apps/flavorsync',
    guidePath: '/guides/flavorsync',
  },
  {
    id: 'globalhope',
    name: '글로벌호프 (GlobalHope)',
    description: 'NGO 후원단체 홈페이지와 배너·사업·소식·문의를 관리하는 CMS를 함께 체험해요.',
    tags: ['NGO', 'CMS', '공공'],
    status: 'live',
    demoPath: '/apps/globalhope',
    guidePath: '/guides/globalhope',
  },
  {
    id: 'marketerops-diagnosis',
    name: 'MarketerOps 진단·AI 어드바이저',
    description: 'URL 하나로 성능·SEO·GEO 점수와 AI 개선 전략을 받아봐요.',
    tags: ['마케팅', 'AI', '진단'],
    status: 'live',
    demoPath: '/apps/marketerops-diagnosis',
    guidePath: '/guides/marketerops-diagnosis',
  },
  {
    id: 'marketerops-channels',
    name: 'MarketerOps 채널 분석',
    description: 'GA4·GSC 연동부터 AI 언급률(SOV), 경쟁사 비교까지 한 번에 봐요.',
    tags: ['마케팅', 'AI', '분석'],
    status: 'live',
    demoPath: '/apps/marketerops-channels',
    guidePath: '/guides/marketerops-channels',
  },
  {
    id: 'marketerops-blogsite',
    name: 'MarketerOps 블로그·사이트 관리',
    description: 'AI 블로그 CMS와 사이트 편집기, 뉴스레터 구독까지 관리해요.',
    tags: ['마케팅', 'AI', 'CMS'],
    status: 'live',
    demoPath: '/apps/marketerops-blogsite',
    guidePath: '/guides/marketerops-blogsite',
  },
  {
    id: 'marketerops-content',
    name: 'MarketerOps 콘텐츠·키워드',
    description: '주제 하나로 블로그·SNS·뉴스레터·광고카피를 한 번에 생성해요.',
    tags: ['마케팅', 'AI', '콘텐츠'],
    status: 'live',
    demoPath: '/apps/marketerops-content',
    guidePath: '/guides/marketerops-content',
  },
]
