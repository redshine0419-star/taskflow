// Keywords for daily auto-posting — each has a cluster for balanced selection
export const BLOG_KEYWORDS = [
  // 재무급여
  { keyword: '근로소득세 계산기 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '재무급여' },
  { keyword: '4대보험 계산기 엑셀 2026', category: '무료서식', lang: 'ko', cluster: '재무급여' },
  { keyword: '퇴직금 계산기 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '재무급여' },
  { keyword: '급여명세서 양식 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '재무급여' },
  { keyword: '예산관리 엑셀 양식 무료', category: '무료서식', lang: 'ko', cluster: '재무급여' },
  { keyword: '손익계산서 엑셀 무료 양식', category: '무료서식', lang: 'ko', cluster: '재무급여' },
  { keyword: '법인카드 사용내역 엑셀 양식', category: '무료서식', lang: 'ko', cluster: '재무급여' },

  // 업무서식
  { keyword: '품의서 양식 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '출장보고서 양식 무료 다운로드', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '업무인수인계서 양식 무료', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '주간업무보고 양식 엑셀', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '업무협조전 양식 무료', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '견적서 양식 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '거래명세서 양식 엑셀', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '재직증명서 양식 무료', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '경력증명서 양식 무료 다운로드', category: '무료서식', lang: 'ko', cluster: '업무서식' },
  { keyword: '재고관리 엑셀 양식 무료', category: '무료서식', lang: 'ko', cluster: '업무서식' },

  // 프로젝트관리
  { keyword: '칸반보드 엑셀 무료 템플릿', category: '무료템플릿', lang: 'ko', cluster: '프로젝트관리' },
  { keyword: '간트차트 엑셀 무료 다운로드', category: '무료템플릿', lang: 'ko', cluster: '프로젝트관리' },
  { keyword: '업무분장표 양식 엑셀', category: '무료서식', lang: 'ko', cluster: '프로젝트관리' },
  { keyword: 'WBS 작업분류체계 엑셀 무료', category: '무료템플릿', lang: 'ko', cluster: '프로젝트관리' },
  { keyword: '주간회의 보고서 양식 무료', category: '무료서식', lang: 'ko', cluster: '프로젝트관리' },
  { keyword: '스프린트 계획 템플릿 무료', category: '무료템플릿', lang: 'ko', cluster: '프로젝트관리' },
  { keyword: '업무 우선순위 매트릭스 엑셀', category: '무료템플릿', lang: 'ko', cluster: '프로젝트관리' },
  { keyword: '프로젝트 일정표 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '프로젝트관리' },

  // 노션활용
  { keyword: '노션 회의록 템플릿 무료 복사', category: '무료템플릿', lang: 'ko', cluster: '노션활용' },
  { keyword: '노션 업무일지 템플릿 무료', category: '무료템플릿', lang: 'ko', cluster: '노션활용' },
  { keyword: '노션 OKR 템플릿 무료', category: '무료템플릿', lang: 'ko', cluster: '노션활용' },
  { keyword: '노션 주간보고 템플릿 무료', category: '무료템플릿', lang: 'ko', cluster: '노션활용' },
  { keyword: '노션 데이터베이스 사용법', category: '툴소개', lang: 'ko', cluster: '노션활용' },

  // 인사HR
  { keyword: '근태관리 엑셀 양식 무료', category: '무료서식', lang: 'ko', cluster: '인사HR' },
  { keyword: '연차관리 엑셀 무료 다운로드', category: '무료서식', lang: 'ko', cluster: '인사HR' },
  { keyword: '인사평가 양식 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '인사HR' },
  { keyword: '채용공고 양식 무료', category: '무료서식', lang: 'ko', cluster: '인사HR' },
  { keyword: '면접평가표 양식 무료', category: '무료서식', lang: 'ko', cluster: '인사HR' },

  // 마케팅기획
  { keyword: '마케팅 기획서 양식 무료 ppt', category: '무료서식', lang: 'ko', cluster: '마케팅기획' },
  { keyword: 'SNS 콘텐츠 캘린더 엑셀 무료', category: '무료템플릿', lang: 'ko', cluster: '마케팅기획' },
  { keyword: '사업계획서 양식 무료 다운로드', category: '무료서식', lang: 'ko', cluster: '마케팅기획' },
  { keyword: '광고 효율 분석 엑셀 무료', category: '무료템플릿', lang: 'ko', cluster: '마케팅기획' },

  // 툴비교
  { keyword: '무료 프로젝트 관리 툴 비교', category: '툴소개', lang: 'ko', cluster: '툴비교' },
  { keyword: '구글 스프레드시트 업무 활용법', category: '툴소개', lang: 'ko', cluster: '툴비교' },
  { keyword: '트렐로 무료 사용법', category: '툴소개', lang: 'ko', cluster: '툴비교' },
  { keyword: '지라 vs 노션 비교', category: '툴소개', lang: 'ko', cluster: '툴비교' },
  { keyword: '소규모 팀 협업 툴 추천', category: '툴소개', lang: 'ko', cluster: '툴비교' },

  // 생산성
  { keyword: '포모도로 타이머 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '생산성' },
  { keyword: '개인 OKR 설정 방법 템플릿', category: '무료템플릿', lang: 'ko', cluster: '생산성' },
  { keyword: '시간관리 엑셀 양식 무료', category: '무료서식', lang: 'ko', cluster: '생산성' },
  { keyword: '업무 체크리스트 엑셀 무료', category: '무료서식', lang: 'ko', cluster: '생산성' },
  { keyword: '회의 효율화 방법 체크리스트', category: '툴소개', lang: 'ko', cluster: '생산성' },

  // EN tools
  { keyword: 'free kanban board for small teams', category: 'tools', lang: 'en', cluster: 'en-tools' },
  { keyword: 'free task management tool 2026', category: 'tools', lang: 'en', cluster: 'en-tools' },
  { keyword: 'asana alternative free', category: 'tools', lang: 'en', cluster: 'en-tools' },
  { keyword: 'trello alternative 2026', category: 'tools', lang: 'en', cluster: 'en-tools' },
  { keyword: 'remote team collaboration tools free', category: 'tools', lang: 'en', cluster: 'en-tools' },

  // EN templates
  { keyword: 'google sheets project management template', category: 'templates', lang: 'en', cluster: 'en-templates' },
  { keyword: 'project management excel template free download', category: 'templates', lang: 'en', cluster: 'en-templates' },
  { keyword: 'weekly task planner template free', category: 'templates', lang: 'en', cluster: 'en-templates' },
  { keyword: 'team workload tracking spreadsheet', category: 'templates', lang: 'en', cluster: 'en-templates' },
  { keyword: 'free work schedule template excel', category: 'templates', lang: 'en', cluster: 'en-templates' },
]

export const USED_SLUGS = []
