// Keywords for daily auto-posting
// Each keyword will become one blog post
export const BLOG_KEYWORDS = [
  // 연말정산/세금
  { keyword: '근로소득세 계산기 엑셀 무료', category: '무료서식', lang: 'ko', slug: '근로소득세-계산기-엑셀' },
  { keyword: '4대보험 계산기 엑셀 2026', category: '무료서식', lang: 'ko', slug: '4대보험-계산기-엑셀' },
  { keyword: '퇴직금 계산기 엑셀 무료', category: '무료서식', lang: 'ko', slug: '퇴직금-계산기-엑셀' },
  { keyword: '급여명세서 양식 엑셀 무료', category: '무료서식', lang: 'ko', slug: '급여명세서-양식-엑셀' },

  // 업무서식
  { keyword: '품의서 양식 엑셀 무료', category: '무료서식', lang: 'ko', slug: '품의서-양식-엑셀' },
  { keyword: '출장보고서 양식 무료 다운로드', category: '무료서식', lang: 'ko', slug: '출장보고서-양식' },
  { keyword: '업무인수인계서 양식 무료', category: '무료서식', lang: 'ko', slug: '업무인수인계서-양식' },
  { keyword: '주간업무보고 양식 엑셀', category: '무료서식', lang: 'ko', slug: '주간업무보고-양식-엑셀' },
  { keyword: '프로젝트 일정표 엑셀 무료', category: '무료서식', lang: 'ko', slug: '프로젝트-일정표-엑셀' },
  { keyword: '업무협조전 양식 무료', category: '무료서식', lang: 'ko', slug: '업무협조전-양식' },
  { keyword: '견적서 양식 엑셀 무료', category: '무료서식', lang: 'ko', slug: '견적서-양식-엑셀' },
  { keyword: '거래명세서 양식 엑셀', category: '무료서식', lang: 'ko', slug: '거래명세서-양식-엑셀' },
  { keyword: '재직증명서 양식 무료', category: '무료서식', lang: 'ko', slug: '재직증명서-양식' },
  { keyword: '경력증명서 양식 무료 다운로드', category: '무료서식', lang: 'ko', slug: '경력증명서-양식' },
  { keyword: '재고관리 엑셀 양식 무료', category: '무료서식', lang: 'ko', slug: '재고관리-엑셀-양식' },

  // 프로젝트/업무관리
  { keyword: '칸반보드 엑셀 무료 템플릿', category: '무료템플릿', lang: 'ko', slug: '칸반보드-엑셀-템플릿' },
  { keyword: '간트차트 엑셀 무료 다운로드', category: '무료템플릿', lang: 'ko', slug: '간트차트-엑셀-무료' },
  { keyword: '업무분장표 양식 엑셀', category: '무료서식', lang: 'ko', slug: '업무분장표-양식-엑셀' },
  { keyword: 'WBS 작업분류체계 엑셀 무료', category: '무료템플릿', lang: 'ko', slug: 'wbs-엑셀-무료' },
  { keyword: '주간회의 보고서 양식 무료', category: '무료서식', lang: 'ko', slug: '주간회의-보고서-양식' },
  { keyword: '스프린트 계획 템플릿 무료', category: '무료템플릿', lang: 'ko', slug: '스프린트-계획-템플릿' },
  { keyword: '업무 우선순위 매트릭스 엑셀', category: '무료템플릿', lang: 'ko', slug: '업무-우선순위-매트릭스' },

  // 노션 템플릿
  { keyword: '노션 회의록 템플릿 무료 복사', category: '무료템플릿', lang: 'ko', slug: '노션-회의록-템플릿' },
  { keyword: '노션 업무일지 템플릿 무료', category: '무료템플릿', lang: 'ko', slug: '노션-업무일지-템플릿' },
  { keyword: '노션 OKR 템플릿 무료', category: '무료템플릿', lang: 'ko', slug: '노션-okr-템플릿' },
  { keyword: '노션 주간보고 템플릿 무료', category: '무료템플릿', lang: 'ko', slug: '노션-주간보고-템플릿' },
  { keyword: '노션 데이터베이스 사용법', category: '툴소개', lang: 'ko', slug: '노션-데이터베이스-사용법' },

  // 인사/HR
  { keyword: '근태관리 엑셀 양식 무료', category: '무료서식', lang: 'ko', slug: '근태관리-엑셀-양식' },
  { keyword: '연차관리 엑셀 무료 다운로드', category: '무료서식', lang: 'ko', slug: '연차관리-엑셀' },
  { keyword: '인사평가 양식 엑셀 무료', category: '무료서식', lang: 'ko', slug: '인사평가-양식-엑셀' },
  { keyword: '채용공고 양식 무료', category: '무료서식', lang: 'ko', slug: '채용공고-양식' },
  { keyword: '면접평가표 양식 무료', category: '무료서식', lang: 'ko', slug: '면접평가표-양식' },

  // 마케팅/기획
  { keyword: '마케팅 기획서 양식 무료 ppt', category: '무료서식', lang: 'ko', slug: '마케팅-기획서-양식' },
  { keyword: 'SNS 콘텐츠 캘린더 엑셀 무료', category: '무료템플릿', lang: 'ko', slug: 'sns-콘텐츠-캘린더-엑셀' },
  { keyword: '사업계획서 양식 무료 다운로드', category: '무료서식', lang: 'ko', slug: '사업계획서-양식' },
  { keyword: '광고 효율 분석 엑셀 무료', category: '무료템플릿', lang: 'ko', slug: '광고-효율-분석-엑셀' },

  // 툴 비교/소개
  { keyword: '무료 프로젝트 관리 툴 비교', category: '툴소개', lang: 'ko', slug: '무료-프로젝트-관리-툴-비교' },
  { keyword: '구글 스프레드시트 업무 활용법', category: '툴소개', lang: 'ko', slug: '구글-스프레드시트-업무-활용' },
  { keyword: '트렐로 무료 사용법', category: '툴소개', lang: 'ko', slug: '트렐로-무료-사용법' },
  { keyword: '지라 vs 노션 비교', category: '툴소개', lang: 'ko', slug: '지라-노션-비교' },
  { keyword: '소규모 팀 협업 툴 추천', category: '툴소개', lang: 'ko', slug: '소규모팀-협업툴-추천' },

  // 생산성
  { keyword: '포모도로 타이머 엑셀 무료', category: '무료서식', lang: 'ko', slug: '포모도로-타이머-엑셀' },
  { keyword: '개인 OKR 설정 방법 템플릿', category: '무료템플릿', lang: 'ko', slug: '개인-okr-설정-방법' },
  { keyword: '시간관리 엑셀 양식 무료', category: '무료서식', lang: 'ko', slug: '시간관리-엑셀-양식' },
  { keyword: '업무 체크리스트 엑셀 무료', category: '무료서식', lang: 'ko', slug: '업무-체크리스트-엑셀' },
  { keyword: '회의 효율화 방법 체크리스트', category: '툴소개', lang: 'ko', slug: '회의-효율화-방법' },

  // 재무
  { keyword: '예산관리 엑셀 양식 무료', category: '무료서식', lang: 'ko', slug: '예산관리-엑셀-양식' },
  { keyword: '손익계산서 엑셀 무료 양식', category: '무료서식', lang: 'ko', slug: '손익계산서-엑셀' },
  { keyword: '법인카드 사용내역 엑셀 양식', category: '무료서식', lang: 'ko', slug: '법인카드-사용내역-엑셀' },

  // English keywords
  { keyword: 'free kanban board for small teams', category: 'tools', lang: 'en' },
  { keyword: 'google sheets project management template', category: 'templates', lang: 'en' },
  { keyword: 'free task management tool 2026', category: 'tools', lang: 'en' },
  { keyword: 'asana alternative free', category: 'tools', lang: 'en' },
  { keyword: 'trello alternative 2026', category: 'tools', lang: 'en' },
  { keyword: 'project management excel template free download', category: 'templates', lang: 'en' },
  { keyword: 'weekly task planner template free', category: 'templates', lang: 'en' },
  { keyword: 'team workload tracking spreadsheet', category: 'templates', lang: 'en' },
  { keyword: 'free work schedule template excel', category: 'templates', lang: 'en' },
  { keyword: 'remote team collaboration tools free', category: 'tools', lang: 'en' },
]

// Track which keywords have been used (by slug)
// This file is updated by the GitHub Action after each post is published
export const USED_SLUGS = []
