/**
 * Portfolio gallery app registry.
 * Add a new app by appending an entry here — no component changes needed.
 *
 * @typedef {Object} PortfolioAppGuide
 * @property {string[]} stack - Tech stack / techniques used.
 * @property {string} summary - One-paragraph summary of how it's built.
 * @property {string[]} keyPoints - Notable implementation details.
 * @property {string[]} steps - Rough steps to build something similar.
 * @property {string[]} files - Key source files to look at.
 *
 * @typedef {Object} PortfolioApp
 * @property {string} id - Unique slug, also used as the React key.
 * @property {string} name - Display name shown on the card.
 * @property {string} description - One-line summary shown on the card.
 * @property {string[]} tags - Tag badges; also drives the tag filter bar.
 * @property {"live"|"coming-soon"} status - "live" enables the demo button.
 * @property {string} demoPath - Internal route to the live demo.
 * @property {string} guidePath - Internal route to the usage guide.
 * @property {PortfolioAppGuide} [guide] - Development guide shown on the guide page.
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
    guide: {
      stack: ['Next.js 15 (App Router)', 'React 19', 'localStorage'],
      summary: '실제 TaskGrid 제품과 동일한 화면·인터랙션을, 구글 시트 연동 없이 브라우저 안에서 재현한 데모예요.',
      keyPoints: [
        '칸반 · 간트 · 테이블 3가지 보기 모드가 같은 상태(state)를 공유해서, 뷰만 바꿔도 데이터는 그대로예요.',
        '드래그 앤 드롭은 외부 라이브러리 없이 HTML5 dataTransfer API만으로 구현했어요.',
        'Excel 가져오기/내보내기는 서버 없이 브라우저에서 직접 CSV를 만들고 파싱해요.',
        '프로젝트·태스크 전체를 하나의 localStorage 키에 JSON으로 저장해요.',
      ],
      steps: [
        '프로젝트/태스크/서브태스크의 데이터 모델(shape)을 먼저 설계해요.',
        '칸반 컬럼은 태스크 배열을 status 값으로 필터링해서 그려요.',
        '드래그 시작 시 태스크 id를 dataTransfer에 담고, 드롭 위치의 컬럼 status로 갱신해요.',
        '간트·테이블 뷰는 같은 배열을 다른 레이아웃으로 그리기만 하면 완성이에요.',
      ],
      files: ['components/gallery/TaskflowDemo.jsx', 'app/apps/taskflow/page.jsx'],
    },
  },
  {
    id: 'focus-timer',
    name: 'Focus Timer',
    description: '뽀모도로 사이클로 집중 시간과 휴식을 자동으로 관리해줘요.',
    tags: ['생산성', '타이머'],
    status: 'live',
    demoPath: '/apps/focus-timer',
    guidePath: '/guides/focus-timer',
    guide: {
      stack: ['Next.js', 'React', 'Web Audio API'],
      summary: '집중 → 휴식을 반복하는 뽀모도로 타이머를 정확한 시각 계산과 브라우저 알림음으로 구현했어요.',
      keyPoints: [
        '집중/짧은휴식/긴휴식을 하나의 phase 상태 머신으로 관리해요.',
        'setInterval의 누적 오차를 피하려고 "시작 시각 + 총 시간 − 현재 시각"으로 남은 시간을 매번 다시 계산해요.',
        '알림음은 별도 오디오 파일 없이 Web Audio API로 직접 생성해요.',
      ],
      steps: [
        'phase와 남은 시간(remaining) state를 설계해요.',
        'useEffect 안의 setInterval에서 remaining을 시각 차이로 재계산해요.',
        'phase가 끝나면 다음 phase로 전환하고 사이클 카운트를 올려요.',
      ],
      files: ['components/gallery/FocusTimerDemo.jsx'],
    },
  },
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    description: '카테고리별 지출을 기록하고 월별 소비 패턴을 한눈에 봐요.',
    tags: ['가계부', '데이터'],
    status: 'live',
    demoPath: '/apps/expense-tracker',
    guidePath: '/guides/expense-tracker',
    guide: {
      stack: ['Next.js', 'React', 'localStorage'],
      summary: '지출 내역을 카테고리별로 기록하고, 차트 라이브러리 없이 직접 그린 막대 그래프로 월별 소비를 보여줘요.',
      keyPoints: [
        '카테고리별 색상 매핑 객체 하나로 뱃지 색과 차트 색을 항상 통일해요.',
        '월별 합계는 날짜 문자열을 슬라이스해서 그룹핑해요 (별도 날짜 라이브러리 불필요).',
        '막대 차트는 퍼센트 너비의 div로 직접 그려요.',
      ],
      steps: [
        '지출 입력 폼 → localStorage 배열에 항목을 추가해요.',
        '월(YYYY-MM) 기준으로 reduce해서 카테고리별 합계를 구해요.',
        '합계를 퍼센트로 환산해 막대 길이에 반영해요.',
      ],
      files: ['components/gallery/ExpenseTrackerDemo.jsx'],
    },
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: '매일의 습관을 체크하고 연속 기록(스트릭)으로 동기부여해요.',
    tags: ['생산성', '습관'],
    status: 'live',
    demoPath: '/apps/habit-tracker',
    guidePath: '/guides/habit-tracker',
    guide: {
      stack: ['Next.js', 'React', 'localStorage'],
      summary: '습관별 체크 현황을 날짜 맵으로 저장하고, 오늘부터 거꾸로 훑어 연속 기록을 계산해요.',
      keyPoints: [
        '체크 여부를 { habitId: { "YYYY-MM-DD": true } } 형태로 저장해 스트릭 계산이 쉬워요.',
        '스트릭은 오늘부터 하루씩 거슬러 올라가며 끊기는 지점까지 카운트해요.',
      ],
      steps: [
        '습관 목록 CRUD를 먼저 만들어요.',
        '오늘 날짜 체크 토글 기능을 붙여요.',
        '체크 맵을 순회하는 스트릭 계산 함수를 작성해요.',
      ],
      files: ['components/gallery/HabitTrackerDemo.jsx'],
    },
  },
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracker',
    description: '6개월 PPL 스플릿 운동 플랜과 인바디 기록을 관리해요.',
    tags: ['피트니스', '헬스', '플래너'],
    status: 'live',
    demoPath: '/apps/fitness-tracker',
    guidePath: '/guides/fitness-tracker',
    guide: {
      stack: ['Next.js', 'React', '원본 디자인 그대로 이식'],
      summary: '실제 운영 중인 fitness-tracker 저장소의 화면과 데이터 구조를 그대로 가져오고, 저장 방식만 localStorage로 바꿨어요.',
      keyPoints: [
        '원본의 UI 컴포넌트와 CSS를 거의 그대로 옮겨와 디자인을 100% 재현했어요.',
        '6개월 PPL(푸시/풀/다리) 스플릿을 요일별 고정 배열로 정의하고 날짜만 매핑해요.',
        '인바디 기록은 날짜순 배열에 누적해서 추이를 보여줘요.',
      ],
      steps: [
        '원본 저장소를 클론해서 실제 컴포넌트 구조를 확인해요.',
        '디자인은 그대로 유지하면서 포트폴리오에 필요한 화면만 선별해 이식해요.',
        '서버/DB 저장 로직만 localStorage 기반으로 교체해요.',
      ],
      files: ['components/gallery/FitnessTrackerDemo.jsx'],
    },
  },
  {
    id: 'chatbot',
    name: 'Chatbot',
    description: '멀티 모델 선택이 가능한 AI 챗봇 UI를 체험해봐요.',
    tags: ['AI', '챗봇'],
    status: 'live',
    demoPath: '/apps/chatbot',
    guidePath: '/guides/chatbot',
    guide: {
      stack: ['Next.js', 'React', 'localStorage'],
      summary: '실제 AI 호출 없이, 키워드 매칭으로 그럴듯한 답변을 만들어주는 챗봇 UI 데모예요.',
      keyPoints: [
        '입력 문장에서 키워드를 찾아 미리 준비된 답변 중 하나를 고르는 makeReply() 함수로 응답을 생성해요.',
        '모델 선택 드롭다운은 UI만 있는 코스메틱 요소이고, 실제로 모델을 바꾸지는 않아요.',
        '대화 기록은 localStorage에 그대로 저장돼 새로고침해도 유지돼요.',
      ],
      steps: [
        '메시지 배열 state를 설계해요 (역할, 내용, 시각).',
        '사용자 입력을 push하고 setTimeout으로 "생각 중" 딜레이를 흉내내요.',
        '키워드 매칭 함수로 canned reply를 골라 push해요.',
      ],
      files: ['components/gallery/ChatbotDemo.jsx'],
    },
  },
  {
    id: 'service-dashboard',
    name: 'Service Dashboard',
    description: '여러 서비스의 현황·비용·AI 플랜을 한 화면에서 관리해요.',
    tags: ['운영', '대시보드', 'AI'],
    status: 'live',
    demoPath: '/apps/service-dashboard',
    guidePath: '/guides/service-dashboard',
    guide: {
      stack: ['Next.js', 'React', 'localStorage'],
      summary: '이 포트폴리오 갤러리 자체의 앱 목록을 "관리 대상 서비스"로 삼는, 자기 참조형 운영 대시보드예요.',
      keyPoints: [
        'data/apps.js에 등록된 실제 앱 목록을 그대로 import해서 서비스 카드를 자동 생성해요.',
        '탭마다 독립적인 하위 상태를 갖되, 전체를 하나의 STORAGE_KEY로 저장해요.',
        'AI PM·모닝 브리핑 등은 미리 써둔 문장 뱅크(PLAN_BANK)에서 무작위로 골라 조합해 "생성된 것처럼" 보여줘요.',
      ],
      steps: [
        '앱 레지스트리를 import해서 서비스 목록을 만들어요.',
        '현황/자동화/AI PM/아이디어/비용/모닝브리핑/피드백 탭을 구성해요.',
        '샘플 문장 뱅크로 AI 생성 결과를 흉내내요.',
      ],
      files: ['components/gallery/ServiceDashboardDemo.jsx', 'data/apps.js'],
    },
  },
  {
    id: 'flavorsync',
    name: 'FlavorSync',
    description: '레시피 위키와 2구 요리 모드, 냉장고 관리를 한 번에 해봐요.',
    tags: ['레시피', '요리', '블로그'],
    status: 'live',
    demoPath: '/apps/flavorsync',
    guidePath: '/guides/flavorsync',
    guide: {
      stack: ['Next.js', 'React', '원본 색상·레이아웃 이식'],
      summary: '원본 레시피 앱의 실제 색상 토큰과 레이아웃을 그대로 가져와 디자인 동일성을 확보한 데모예요.',
      keyPoints: [
        '원본의 테라코타(#C94B2A) 등 실제 색상 토큰을 그대로 옮겨왔어요.',
        '재료 매칭률은 보유 재료와 레시피 재료명을 정규화(공백 제거·소문자화)해서 비교해요.',
        '2구 동시 조리 시간은 병렬로 처리 가능한 스텝을 버너별로 나눠 최댓값으로 계산해요.',
      ],
      steps: [
        '원본 mockRecipes/mockBlogPosts(TypeScript)를 JS로 변환해요.',
        '재료 이름 정규화 + 매칭 알고리즘을 작성해요.',
        '냉장고 · 레시피 · 블로그 3개 탭으로 화면을 구성해요.',
      ],
      files: ['components/gallery/FlavorSyncDemo.jsx', 'data/flavorsyncRecipes.js', 'data/flavorsyncBlog.js'],
    },
  },
  {
    id: 'globalhope',
    name: '홈페이지',
    description: 'NGO 후원단체 홈페이지와 배너·사업·소식·문의를 관리하는 CMS를 함께 체험해요.',
    tags: ['NGO', 'CMS', '공공'],
    status: 'live',
    demoPath: '/apps/globalhope',
    guidePath: '/guides/globalhope',
    guide: {
      stack: ['Next.js (App Router)', 'React', 'localStorage', '(원본은 React Router + Vite)'],
      summary: 'React Router 기반 SPA로 만들어진 실제 NGO 홈페이지 + 관리자 CMS를 Next.js App Router 구조로 그대로 이식했어요.',
      keyPoints: [
        '원본이 이미 갖고 있던 localStorage 기반 mockApi.js를 그대로 재사용하고, 실제 백엔드를 호출하던 계층만 제거했어요.',
        'react-router-dom의 Link/NavLink와 이름이 같은 자체 컴포넌트(GLink/GNavLink)를 만들어 각 페이지의 JSX는 거의 그대로 두고 import만 바꿨어요.',
        '원본 CSS(847줄)를 postcss로 파싱해 모든 셀렉터 앞에 .gh-scope를 자동으로 붙여서, 다른 데모 페이지와 스타일이 섞이지 않게 했어요.',
        '관리자 레이아웃은 현재 pathname을 확인해서 /admin/login만 사이드바 없이 렌더링해요.',
      ],
      steps: [
        '원본 페이지·컴포넌트 구조와 라우트 목록을 파악해요.',
        'react-router 전용 API(Link, useNavigate, useParams)를 대체할 얇은 래퍼를 만들어요.',
        'CSS는 스코프 프리픽스를 자동으로 붙이는 스크립트로 일괄 변환해요.',
        'App Router의 폴더 구조(page.jsx, layout.jsx, 동적 세그먼트)로 라우트를 옮겨요.',
      ],
      files: ['components/gallery/globalhope/', 'app/apps/globalhope/'],
    },
  },
  {
    id: 'marketerops-diagnosis',
    name: 'MarketerOps 진단·AI 어드바이저',
    description: 'URL 하나로 성능·SEO·GEO 점수와 AI 개선 전략을 받아봐요.',
    tags: ['마케팅', 'AI', '진단'],
    status: 'live',
    demoPath: '/apps/marketerops-diagnosis',
    guidePath: '/guides/marketerops-diagnosis',
    guide: {
      stack: ['Next.js', 'React', '해시 기반 샘플 데이터 생성'],
      summary: '실제 PageSpeed·AI 호출 없이, 입력한 URL을 해시로 변환해 항상 같은 URL이면 같은 점수가 나오게 만든 진단 데모예요.',
      keyPoints: [
        '문자열 해시값으로 점수·등급·이슈 목록을 결정해서, 매번 다르지만 URL마다 일관된 "가짜" 결과를 만들어요.',
        '부호 있는 비트 시프트(>>) 대신 부호 없는 시프트(>>>)를 써서 큰 해시값에서 음수가 나오는 버그를 피했어요.',
        '진단 결과를 history 배열에 계속 누적해서 "진단 이력" 탭에서 추이 차트로 보여줘요.',
      ],
      steps: [
        '문자열을 정수 해시로 바꾸는 hash() 함수를 만들어요.',
        '해시값을 % 연산해 점수·등급·불리언 플래그를 뽑아내요.',
        '결과를 history 배열에 저장하고, 최근 N개로 추이를 그려요.',
      ],
      files: ['components/gallery/MarketerOpsDiagnosisDemo.jsx'],
    },
  },
  {
    id: 'marketerops-channels',
    name: 'MarketerOps 채널 분석',
    description: 'GA4·GSC 연동부터 AI 언급률(SOV), 경쟁사 비교까지 한 번에 봐요.',
    tags: ['마케팅', 'AI', '분석'],
    status: 'live',
    demoPath: '/apps/marketerops-channels',
    guidePath: '/guides/marketerops-channels',
    guide: {
      stack: ['Next.js', 'React', '해시 기반 샘플 데이터 생성'],
      summary: 'GA4·Search Console의 실제 OAuth 연동 없이, "연결하기" 버튼 한 번으로 연결된 것처럼 보이게 만든 데모예요.',
      keyPoints: [
        '"연동하기" 버튼은 실제 OAuth 대신 로컬 state를 connected: true로 바꾸는 것뿐이에요.',
        'GA4/GSC/SOV/경쟁사 비교가 모두 같은 해시 기반 샘플 데이터 생성 패턴을 재사용해요.',
        '채널별 색상 매핑 객체 하나로 막대 그래프 색을 항상 통일해요.',
      ],
      steps: [
        '연동 버튼 클릭 → 가짜 connected 상태와 계정 정보를 채워요.',
        '"데이터 불러오기" 버튼 → 해시 기반 샘플 데이터를 생성해요.',
        '탭별로 KPI 카드·막대그래프·리스트를 연결해요.',
      ],
      files: ['components/gallery/MarketerOpsChannelsDemo.jsx'],
    },
  },
  {
    id: 'marketerops-blogsite',
    name: 'MarketerOps 블로그·사이트 관리',
    description: 'AI 블로그 CMS와 사이트 편집기, 뉴스레터 구독까지 관리해요.',
    tags: ['마케팅', 'AI', 'CMS'],
    status: 'live',
    demoPath: '/apps/marketerops-blogsite',
    guidePath: '/guides/marketerops-blogsite',
    guide: {
      stack: ['Next.js', 'React', 'localStorage', '직접 구현한 line diff'],
      summary: 'AI 사이트 편집기의 변경 미리보기(diff)를, 실제 AI 없이 직접 구현한 줄 단위 비교 알고리즘으로 보여주는 데모예요.',
      keyPoints: [
        'diff 뷰는 두 문자열을 줄 단위로 비교하는 직접 구현 알고리즘이라, 별도 라이브러리가 없어요.',
        '"승인 & 커밋" 버튼은 실제 GitHub API 대신 가짜 커밋 URL을 만들어 커밋 이력 배열에 저장해요.',
        '블로그 포스트·뉴스레터 구독자는 모두 localStorage 배열에 대한 CRUD로 구현했어요.',
      ],
      steps: [
        '가짜 파일 트리(경로 → 내용 맵)를 정의해요.',
        '프롬프트를 입력받아 간단한 문자열 치환으로 "수정본"을 만들어요.',
        '원본과 수정본을 줄 단위로 비교해서 +/- 표시로 그려요.',
        '커밋 버튼에 지연 후 가짜 커밋 URL을 반환하는 함수를 붙여요.',
      ],
      files: ['components/gallery/MarketerOpsBlogSiteDemo.jsx'],
    },
  },
  {
    id: 'marketerops-content',
    name: 'MarketerOps 콘텐츠·키워드',
    description: '주제 하나로 블로그·SNS·뉴스레터·광고카피를 한 번에 생성해요.',
    tags: ['마케팅', 'AI', '콘텐츠'],
    status: 'live',
    demoPath: '/apps/marketerops-content',
    guidePath: '/guides/marketerops-content',
    guide: {
      stack: ['Next.js', 'React', '템플릿 기반 텍스트 생성'],
      summary: '실제 AI 호출 없이, 채널별 템플릿 함수에 주제만 끼워 넣어 콘텐츠를 생성하는 데모예요.',
      keyPoints: [
        '블로그/SNS/뉴스레터/광고 채널마다 별도 템플릿 함수를 두고, 입력한 주제·톤 문자열만 끼워 넣어요.',
        '키워드 분석은 해시값으로 검색의도·경쟁도·연관키워드를 결정해서, 입력마다 다르지만 일관된 결과를 보여줘요.',
        '키워드 클러스터링은 각 키워드를 의도별로 그룹핑하고, 그룹의 첫 키워드를 대표 키워드(pillar)로 자동 선정해요.',
      ],
      steps: [
        '채널별 템플릿 함수(genBlog, genSocial 등)를 작성해요.',
        '주제·톤 입력을 템플릿에 끼워 넣어 결과를 조합해요.',
        '키워드 해시로 의도·경쟁도·연관어를 뽑는 함수를 작성해요.',
      ],
      files: ['components/gallery/MarketerOpsContentDemo.jsx'],
    },
  },
  {
    id: 'cafe-landing',
    name: '카페 홈페이지',
    description: '카페 소슬 — 메뉴·소개·오시는 길을 담은 1페이지 홈페이지예요.',
    tags: ['홈페이지', '랜딩페이지', '소상공인'],
    status: 'live',
    demoPath: '/apps/cafe-landing',
    guidePath: '/guides/cafe-landing',
    guide: {
      stack: ['Next.js', 'React', '인라인 스타일'],
      summary: '소상공인 카페를 위한 1페이지 홈페이지예요. 메뉴·소개·오시는 길·예약 문의를 한 페이지 안에서 앵커 링크로 이동하도록 구성했어요.',
      keyPoints: [
        '섹션마다 고유 id를 주고 네비게이션은 앵커 링크(#menu 등)로만 이동해서, 별도 라우팅 없이 한 페이지로 완성돼요.',
        '색상·폰트를 카페 컨셉(따뜻한 브라운·골드 톤)에 맞춘 테마 객체 하나로 관리해요.',
        '예약 문의 폼은 실제 전송 없이 로컬 state로 "제출 완료" 화면을 보여주는 데모예요.',
      ],
      steps: [
        '업종에 맞는 색상 팔레트와 카피(문구)를 먼저 정해요.',
        '히어로 → 소개 → 메뉴/서비스 → 오시는 길 → 문의 순서로 섹션을 배치해요.',
        '상단 네비게이션에 각 섹션으로 이동하는 앵커 링크를 연결해요.',
        '문의 폼은 제출 시 로컬 state만 바꿔 완료 화면을 보여줘요.',
      ],
      files: ['components/gallery/CafeLandingDemo.jsx'],
    },
  },
  {
    id: 'clinic-landing',
    name: '병원 홈페이지',
    description: '정다운의원 — 진료과목·의료진 소개·예약 문의를 담은 홈페이지예요.',
    tags: ['홈페이지', '랜딩페이지', '의료'],
    status: 'live',
    demoPath: '/apps/clinic-landing',
    guidePath: '/guides/clinic-landing',
    guide: {
      stack: ['Next.js', 'React', '인라인 스타일'],
      summary: '동네 의원을 위한 신뢰감 있는 홈페이지 데모예요. 진료과목·의료진 소개·진료시간·예약 신청 폼으로 구성했어요.',
      keyPoints: [
        '진료과목 배열 하나로 카드 그리드를 자동 생성해서, 과목이 늘어도 컴포넌트 수정 없이 배열만 추가하면 돼요.',
        '신뢰감을 주는 파란색 계열 팔레트와 여백을 넉넉히 써서 의료기관다운 톤을 만들었어요.',
        '예약 폼의 진료과목 select는 진료과목 배열을 그대로 재사용해요.',
      ],
      steps: [
        '진료과목·의료진 데이터를 배열로 정의해요.',
        '배열을 map으로 순회해 카드 그리드를 렌더링해요.',
        '예약 폼 select의 옵션도 같은 배열에서 가져와 데이터 중복을 없애요.',
      ],
      files: ['components/gallery/ClinicLandingDemo.jsx'],
    },
  },
  {
    id: 'lawfirm-landing',
    name: '법률사무소 홈페이지',
    description: '이현 법률사무소 — 전문분야·상담절차·상담신청을 담은 홈페이지예요.',
    tags: ['홈페이지', '랜딩페이지', '전문직'],
    status: 'live',
    demoPath: '/apps/lawfirm-landing',
    guidePath: '/guides/lawfirm-landing',
    guide: {
      stack: ['Next.js', 'React', '인라인 스타일'],
      summary: '법률사무소처럼 신뢰와 권위가 중요한 업종을 위한 다크 네이비 + 골드 톤 홈페이지 데모예요.',
      keyPoints: [
        '히어로 영역만 다크 네이비 배경으로 분리해서 첫인상에 무게감을 주고, 이후 섹션은 밝은 배경으로 전환해 가독성을 높였어요.',
        '상담 절차를 01~03 번호가 붙은 단계별 카드로 시각화했어요.',
        '전문분야 카드에 작은 골드 점(bullet)만 넣어 장식 요소를 최소화했어요.',
      ],
      steps: [
        '업종 톤에 맞는 다크+골드 색상 조합을 정해요.',
        '히어로만 어두운 배경으로 분리하고 나머지 섹션은 밝게 구성해요.',
        '상담 절차를 번호가 붙은 단계 카드 배열로 표현해요.',
      ],
      files: ['components/gallery/LawFirmLandingDemo.jsx'],
    },
  },
  {
    id: 'startup-landing',
    name: '스타트업 홈페이지',
    description: '런치패드 — 제품 소개와 얼리 액세스 신청을 담은 다크 테마 랜딩페이지예요.',
    tags: ['홈페이지', '랜딩페이지', '스타트업'],
    status: 'live',
    demoPath: '/apps/startup-landing',
    guidePath: '/guides/startup-landing',
    guide: {
      stack: ['Next.js', 'React', 'CSS 그라디언트'],
      summary: 'SaaS 스타트업 제품을 알리는 다크 테마 랜딩페이지 데모예요. 얼리 액세스 이메일 폼을 히어로와 하단 두 곳에 배치했어요.',
      keyPoints: [
        'CSS의 background + WebkitBackgroundClip: text로 타이틀에 그라디언트 텍스트 효과를 줬어요.',
        '이메일 정규식 검증 후에만 "신청 완료" 상태로 전환해요.',
        '같은 WaitlistForm 컴포넌트를 히어로와 하단 CTA 두 군데에서 재사용해요.',
      ],
      steps: [
        '이메일 형식을 정규식으로 검증하는 폼 컴포넌트를 만들어요.',
        '그라디언트 텍스트 효과로 타이틀에 포인트를 줘요.',
        '같은 폼 컴포넌트를 필요한 위치마다 재사용해요.',
      ],
      files: ['components/gallery/StartupLandingDemo.jsx'],
    },
  },
  {
    id: 'realestate-landing',
    name: '부동산 홈페이지',
    description: '한강 공인중개사 — 주요매물·서비스 안내·매물 문의를 담은 홈페이지예요.',
    tags: ['홈페이지', '랜딩페이지', '부동산'],
    status: 'live',
    demoPath: '/apps/realestate-landing',
    guidePath: '/guides/realestate-landing',
    guide: {
      stack: ['Next.js', 'React', '인라인 스타일'],
      summary: '공인중개사 사무소를 위한 홈페이지 데모예요. 매물 카드 리스트와 문의 폼의 관심 매물 select가 같은 데이터를 공유해요.',
      keyPoints: [
        '매물 타입(매매/전세/월세)마다 다른 배지 색을 주는 대신, 하나의 그린 톤 배지 스타일로 통일해 톤을 정리했어요.',
        '매물 배열을 문의 폼의 select 옵션으로도 그대로 재사용해요.',
        '가격은 골드 색상으로 강조해 시선이 먼저 가도록 배치했어요.',
      ],
      steps: [
        '매물 데이터를 타입·이름·평수·가격 필드로 정의해요.',
        '매물 카드 그리드와 문의 폼 select에 같은 배열을 재사용해요.',
        '가격처럼 강조할 정보는 별도 색상으로 시각적 위계를 줘요.',
      ],
      files: ['components/gallery/RealEstateLandingDemo.jsx'],
    },
  },
  {
    id: 'wedding-landing',
    name: '웨딩업체 홈페이지',
    description: 'Eden Wedding — 웨딩 갤러리·패키지 안내·상담 예약을 담은 홈페이지예요.',
    tags: ['홈페이지', '랜딩페이지', '웨딩'],
    status: 'live',
    demoPath: '/apps/wedding-landing',
    guidePath: '/guides/wedding-landing',
    guide: {
      stack: ['Next.js', 'React', 'CSS (스코프 클래스)', 'Google Fonts'],
      summary: '웨딩 스튜디오를 위한 골드·아이보리 톤 홈페이지 데모예요. Cormorant Garamond 세리프 폰트와 실제 Unsplash 사진으로 청첩장 같은 감성을 살렸어요.',
      keyPoints: [
        '순수 HTML/CSS로 받은 디자인 시안을 컴포넌트 CSS 파일(edenWedding.css)로 옮기면서, 모든 선택자 앞에 .eden-scope를 붙여 다른 데모 페이지 스타일과 절대 섞이지 않게 했어요.',
        ':root 변수는 문서 전체에 적용되는 전역 선택자라 그대로 쓰면 다른 페이지에도 영향을 주기 때문에, .eden-scope 클래스 자체에 CSS 변수를 정의해 스코프를 지켰어요.',
        '제목은 Cormorant Garamond(구글 폰트), 본문은 프로젝트 전체에서 쓰는 Pretendard(jsDelivr CDN)로 두 서체를 함께 로드해요.',
        '갤러리·예약 섹션 배경은 실제 Unsplash 사진 URL을 사용해요 — 다른 데모의 블로그 썸네일과 같은 패턴이에요.',
      ],
      steps: [
        '순수 HTML/CSS 시안을 받으면, 태그 선택자(nav, section, footer 등)를 전부 부모 스코프 클래스의 자손 선택자로 바꿔요.',
        ':root에 있던 CSS 변수는 스코프 클래스 자체로 옮겨서 전역 오염을 막아요.',
        'HTML 마크업을 JSX로 옮기면서 반복되는 부분(갤러리 이미지, 패키지 카드)은 배열 + map()으로 바꿔요.',
        '문의 폼은 React state로 감싸서 제출 시 로컬에서만 "접수완료" 화면을 보여줘요.',
      ],
      files: ['components/gallery/WeddingLandingDemo.jsx', 'components/gallery/edenWedding.css'],
    },
  },
]
