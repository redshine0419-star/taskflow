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
]
