# TaskGrid 서비스 관리 문서

## 서비스 개요

**TaskGrid** — Google Sheets를 데이터베이스로 사용하는 무료 칸반 프로젝트 관리 툴.  
사용자가 Google 계정으로 로그인하면 자신의 Google Drive에 스프레드시트가 생성되고, 그 위에 칸반 보드 UI를 제공한다.

- **프로덕션 URL**: https://www.taskgrid.my
- **GitHub**: redshine0419-star/taskflow
- **개발 브랜치**: `claude/sharp-wozniak-mPQwe`
- **배포**: Vercel (GitHub 연동 자동 배포)
- **DB**: Neon (Postgres) — 블로그 포스트 전용. 사용자 데이터는 각자의 Google Sheets에 저장.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 |
| DB | Neon (PostgreSQL via `@neondatabase/serverless`) |
| 인증 | Google OAuth 2.0 |
| 사용자 데이터 | Google Sheets API v4 |
| 배포 | Vercel |
| AI (블로그) | Gemini 2.5 Flash API |

---

## 환경변수 (Vercel에 설정됨)

```
DATABASE_URL                  # Neon PostgreSQL 연결 문자열
NEXT_PUBLIC_GEMINI_API_KEY    # Gemini API 키 (블로그 자동 생성용)
GOOGLE_CLIENT_ID              # Google OAuth 클라이언트 ID
GOOGLE_CLIENT_SECRET          # Google OAuth 클라이언트 시크릿
CRON_SECRET                   # /api/db-init 인증용 (기본값: 'init')
NEXT_PUBLIC_BASE_URL          # https://www.taskgrid.my
```

---

## 주요 파일 구조

```
app/
  page.jsx                    # 메인 앱 페이지 (로그인 → App.jsx 렌더링)
  layout.jsx                  # 루트 레이아웃
  api/
    auth/
      callback/route.js       # Google OAuth 콜백 처리
      session/route.js        # 세션 확인
    blog-list/route.js        # 블로그 포스트 목록 API (Neon)
    blog-post/route.js        # 블로그 포스트 수정/삭제 API
    blog-keywords/route.js    # 키워드 관리 API (관리자 전용)
    blog-generate/route.js    # 단일 포스트 AI 생성
    blog-save/route.js        # 포스트 저장
    cron/blog/route.js        # 자동 블로그 생성 크론 (Vercel Cron)
    db-init/route.js          # DB 테이블 초기화 (Bearer 인증 필요)
    seed-posts/
      route.js                # 37개 시드 포스트 DB 삽입 엔드포인트
      data.js                 # EN 5개 + KO 5개 (10개)
      data2.js                # EN 13개
      data3.js                # KO 14개
  blog/
    page.jsx                  # 블로그 목록 페이지 (SSR, revalidate=0)
    BlogFilter.jsx            # 언어/카테고리 필터 (클라이언트 컴포넌트)
    [slug]/page.jsx           # 블로그 상세 페이지

components/
  App.jsx                     # 메인 앱 컴포넌트 (칸반 보드, 탭 네비게이션)

lib/
  db.js                       # Neon DB 연결 및 블로그 CRUD 함수
  gapi.js                     # Google Sheets API 래퍼
  blog-images.js              # 카테고리별 Unsplash 이미지 URL
  blog-posts.js               # 정적 블로그 포스트 (현재 빈 배열 [])
  aipm.js                     # AI PM 기능
```

---

## DB 스키마

### blog_posts 테이블
```sql
CREATE TABLE blog_posts (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  title        TEXT NOT NULL,
  date         TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',  -- 주의: 'desc'가 아닌 'description' (예약어 회피)
  keywords     TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  used_keyword TEXT NOT NULL DEFAULT '',
  lang         TEXT NOT NULL DEFAULT 'ko',
  image_url    TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### blog_keywords 테이블
```sql
CREATE TABLE blog_keywords (
  id        SERIAL PRIMARY KEY,
  keyword   TEXT NOT NULL,
  category  TEXT NOT NULL DEFAULT '',
  lang      TEXT NOT NULL DEFAULT 'ko',
  used      BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 블로그 카테고리 구조

| 영문 (lang='en') | 한국어 (lang='ko') | 이미지 테마 |
|-----------------|-------------------|------------|
| alternatives | 툴비교 | 비즈니스/노트북 |
| google-workspace | 구글활용 | 오피스/회의 |
| ai-tools | AI활용 | AI/기술 |
| productivity | 협업팁 | 협업/팀 |

---

## 관리자 기능

**관리자 이메일**: `redshine0419@gmail.com`

관리자만 볼 수 있는 기능:
- App.jsx의 **Publish 탭** (블로그 관리 UI)
  - 키워드 등록/삭제
  - 등록된 블로그 포스트 수정/삭제
  - 블로그 자동 생성 트리거

관리자 체크 코드 (`components/App.jsx`):
```js
const ADMIN_EMAIL = 'redshine0419@gmail.com'
const isAdmin = user?.email === ADMIN_EMAIL
```

---

## 인증 흐름

1. 사용자가 "Google로 시작" 클릭
2. `/api/auth/callback` → Google OAuth 처리
3. 토큰을 `sessionStorage['tf_session']`에 저장: `{ token, user, expires }`
4. `user.email`로 관리자 여부 판단
5. Google Sheets API는 이 토큰으로 사용자의 Drive에 접근

---

## 블로그 운영

### 현재 포스트 현황
- 총 37개 포스트 정의 (data.js + data2.js + data3.js)
- `/api/seed-posts` 접속 시 DB에 삽입 (중복 방지: `ON CONFLICT DO NOTHING`)
- EN 18개: alternatives(6), google-workspace(4), ai-tools(3), productivity(5)
- KO 19개: 툴비교(6), 구글활용(4), AI활용(4), 협업팁(5)

### 블로그 포스트 삽입/재삽입
```
GET https://www.taskgrid.my/api/seed-posts
→ {"ok":true,"inserted":N,"failed":[],"total":37}
```

### 새 포스트 AI 자동 생성 (크론)
- Vercel Cron이 `/api/cron/blog`를 주기적으로 호출
- `blog_keywords` 테이블에서 미사용 키워드를 가져와 Gemini로 포스트 생성
- 생성 후 `revalidatePath('/blog')` 호출로 캐시 갱신

### 블로그 캐시
- `app/blog/page.jsx`: `export const revalidate = 0` (캐시 없음, 항상 최신)
- `app/api/blog-list/route.js`: `export const revalidate = 0` (캐시 없음)

---

## DB 초기화 (신규 환경 설정 시)

```bash
# Authorization 헤더 필요 (CRON_SECRET 또는 'init')
curl -H "Authorization: Bearer init" https://www.taskgrid.my/api/db-init
→ {"ok":true,"message":"tables ready: blog_posts, blog_keywords"}

# 그 다음 포스트 삽입
GET https://www.taskgrid.my/api/seed-posts
```

---

## 주요 lib/db.js 함수

```js
getDb()                          // Neon 연결 싱글톤
initBlogTable()                  // blog_posts 테이블 생성
initKeywordsTable()              // blog_keywords 테이블 생성
insertBlogPost(post)             // 포스트 삽입 (slug 충돌 시 무시)
getAllBlogPosts({ lang })         // 전체 포스트 조회 (lang 필터 선택)
getBlogPostBySlug(slug)          // 단일 포스트 조회
updateBlogPost(slug, fields)     // 포스트 수정 (fields.description 사용)
deleteBlogPost(slug)             // 포스트 삭제
insertKeyword(keyword, category, lang)  // 키워드 등록
getAllKeywords()                  // 전체 키워드 조회
deleteKeyword(id)                // 키워드 삭제
getUnusedKeywords()              // 미사용 키워드 조회
```

**주의사항**: DB 컬럼명은 `description` (프론트엔드에서 `desc`로 매핑)

---

## 자주 하는 작업

### 블로그 포스트 전체 삭제 후 재삽입
1. Neon 콘솔 또는 쿼리로 `DELETE FROM blog_posts`
2. `GET https://www.taskgrid.my/api/seed-posts` 접속

### 새 키워드 추가 (관리자 UI)
- 로그인 후 Publish 탭 → 키워드 관리 섹션에서 추가

### 블로그 포스트 내용 수정
- 관리자 UI에서 직접 수정
- 또는 `PUT /api/blog-post` API 사용: `{ slug, title, description, content, ... }`

### ESLint 규칙 주의사항
- 빌드 시 ESLint 엄격 모드 적용
- 미사용 변수(`no-unused-vars`)는 빌드 실패 원인
- catch 블록 변수 미사용 시: `catch { }` (변수 없이) 사용
- import한 것은 반드시 사용하거나 삭제

---

## Google Sheets API 주의사항

`lib/gapi.js`의 append URL 형식:
```
올바른 형식: /values/시트명!A:L/append?...
잘못된 형식: /values/시트명!A:L:append?...  ← 과거 버그, 수정 완료
```

---

## 배포 흐름

1. `claude/sharp-wozniak-mPQwe` 브랜치에 push
2. Vercel이 자동으로 빌드 및 배포
3. 빌드 실패 시 Vercel 대시보드에서 로그 확인
4. ESLint 오류가 가장 흔한 빌드 실패 원인
