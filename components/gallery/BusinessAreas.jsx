import Link from 'next/link'
import SiteNav from './SiteNav'
import { EDM, PRETENDARD_CSS_URL } from './edmTheme'

// ── 01. 홈페이지 제작 ─────────────────────────────
const SITE_PROCESS = [
  { step: '01', title: '템플릿 선택', desc: '샘플 갤러리에서 원하는 디자인을 고르세요. 미팅 없이 바로 진행돼요.' },
  { step: '02', title: '인테이크 폼 작성', desc: '업체명·연락처·사진·문구를 폼 하나에 담아 보내주시면 끝이에요.' },
  { step: '03', title: 'AI 자동 제작', desc: '입력하신 내용을 AI가 선택한 템플릿에 자동으로 채워 넣어요.' },
  { step: '04', title: '미리보기 & 전달', desc: '미리보기 링크로 확인 후, 비동기 수정요청 1회 반영하고 전달해요.' },
]

const SITE_COMPARISON = {
  them: {
    label: '아임웹 등 템플릿 빌더',
    rows: ['제작 대행비 15만~500만원 + 월 구독료 16,000~40,000원 (직접 관리)', '콘텐츠 수정도 직접 하거나 별도 대행비 발생', '템플릿 안에서만 커스터마이징 가능', '플랫폼 종속 — 코드 소유권 없음'],
  },
  us: {
    label: '바이브코딩',
    rows: ['파격적으로 낮은 초기 제작비로 시작', '인테이크 폼 1회로 진행 · 미팅 없이 비동기로 완성', '월 유지보수에 콘텐츠 수정 · 보안 업데이트 포함 (요청 후 3영업일 내 처리)', '완전 커스텀 코드로 자유롭게 제작 · 코드 100% 소유'],
  },
}

const SITE_PRICING = [
  {
    name: '랜딩페이지',
    price: '9만원~',
    maintenance: '월 4.9만원~',
    tagline: '소개 홈페이지 · 랜딩페이지',
    features: ['1페이지 반응형 디자인', '핵심 섹션 3~5개 구성', '인테이크 폼 1회로 진행 (미팅 없음)', '유지보수: 콘텐츠 수정 · 보안 업데이트 (요청 후 3영업일 내 처리)', '평균 제작 기간 1주'],
  },
  {
    name: '비즈니스 홈페이지',
    price: '29만원~',
    maintenance: '월 9.9만원~',
    tagline: '기업 · 단체 · 프랜차이즈 지점 홈페이지 + 관리자 CMS',
    features: ['5페이지 내외 구성', '콘텐츠 관리자 CMS 포함', '인테이크 폼 1회로 진행 (미팅 없음)', '유지보수: 콘텐츠 수정 · 보안 업데이트 (요청 후 3영업일 내 처리)', '완전한 코드 소유권 (플랫폼 종속 없음)'],
    highlighted: true,
  },
]

// ── 02. 블로그 제작 및 작성 ─────────────────────────
const WHY_CONTENT = {
  ads: {
    label: '광고',
    rows: ['비용을 멈추면 노출도 바로 끊겨요', '예산을 쓰는 동안만 반짝 효과가 나요', '멈추는 순간 남는 자산이 없어요'],
  },
  content: {
    label: '콘텐츠',
    rows: ['발행 후에도 검색·AI 답변에서 계속 발견돼요', '쌓일수록 검색 노출과 신뢰가 함께 늘어요', '중단해도 이미 쌓인 콘텐츠는 자산으로 남아요'],
  },
}

const CHANNELS = [
  { icon: '🔍', title: '포털 블로그', desc: '국내 검색 기반 고객 접점의 핵심. 키워드 기반 정보성 글을 꾸준히 쌓아요.' },
  { icon: '📸', title: '인스타그램', desc: '브랜드 분위기를 시각적으로 보여주는 채널. 카드뉴스로 재가공해 발행해요.' },
  { icon: '🎵', title: '틱톡', desc: '짧고 강한 카드뉴스형 콘텐츠로 신규 도달과 확산을 노려요.' },
  { icon: '🌐', title: '홈페이지', desc: '우리가 소유한 채널. 블로그·SNS와 달리 검색·AI 노출에서 가장 오래 남아요.' },
]

const BLOG_PROCESS = [
  { step: '01', title: '키워드 · 주제 선정', desc: '업종·지역·경쟁 상황을 분석해 핵심 키워드와 발행 주제를 제안해요.' },
  { step: '02', title: '일정표 전달', desc: '키워드·주제·발행 채널·예정일을 정리한 일정표를 보내드려요. 직접 확인하고 수정할 수 있어요.' },
  { step: '03', title: '콘텐츠 제작', desc: '일정표가 확정되면 SEO·GEO 기준에 맞춰 블로그·카드뉴스를 제작해요.' },
  { step: '04', title: '검수 & 발행', desc: '완성된 콘텐츠를 확인해주시면, 채널별 형식에 맞춰 직접 발행까지 진행해요.' },
]

const BLOG_PRICING = [
  {
    name: '스타터',
    price: '월 8만원~',
    tagline: '1채널 · 월 4회 발행',
    features: ['포털 블로그 1채널', '키워드 기반 SEO 콘텐츠', '월 1회 일정표 조율', '소규모로 콘텐츠 운영을 시작하고 싶은 분께'],
  },
  {
    name: '그로스',
    price: '월 15만원~',
    tagline: '2채널 · 월 8회 발행',
    features: ['블로그 + 인스타그램', 'SEO + GEO 이중 최적화', '카드뉴스 제작 포함', '꾸준한 발행으로 채널을 함께 키우고 싶은 분께'],
    highlighted: true,
  },
  {
    name: '스케일',
    price: '월 28만원~',
    tagline: '4채널 · 월 16회 발행 · 프랜차이즈 전 지점 대응',
    features: ['블로그 + 인스타 + 틱톡 + 홈페이지', 'SEO + GEO 이중 최적화', '채널별 맞춤 재가공', '브랜드 노출을 본격적으로 확대하고 싶은 분께'],
  },
]

function ComparisonBox({ them, us }) {
  return (
    <div style={{
      marginTop: EDM.space[8], maxWidth: 760, marginLeft: 'auto', marginRight: 'auto',
      border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card,
      boxShadow: EDM.shadowBlue01, padding: EDM.space[6], background: EDM.bg,
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: EDM.space[6],
    }}>
      {[them, us].map((col, i) => (
        <div key={col.label}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: EDM.space[3], color: i === 1 ? EDM.wine[700] : EDM.text3 }}>
            {col.label}
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: EDM.space[2] }}>
            {col.rows.map((r) => (
              <li key={r} style={{ fontSize: 13.5, color: EDM.text2, lineHeight: 1.6, display: 'flex', gap: 8 }}>
                <span style={{ color: i === 1 ? EDM.wine[600] : EDM.text3 }}>{i === 1 ? '✓' : '·'}</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function ProcessGrid({ items }) {
  return (
    <div style={{ marginTop: EDM.space[8], display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: EDM.space[5] }}>
      {items.map((p) => (
        <div key={p.step} style={{ border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card, padding: EDM.space[6], background: EDM.bg }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: EDM.wine[600], marginBottom: EDM.space[2] }}>{p.step}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[2] }}>{p.title}</div>
          <p style={{ margin: 0, fontSize: 14, color: EDM.text3, lineHeight: 1.6 }}>{p.desc}</p>
        </div>
      ))}
    </div>
  )
}

function PricingGrid({ tiers, showMaintenance }) {
  return (
    <div style={{ marginTop: EDM.space[8], display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: EDM.space[5] }}>
      {tiers.map((tier) => (
        <div key={tier.name} style={{
          position: 'relative',
          border: tier.highlighted ? `2px solid ${EDM.wine[500]}` : `1px solid ${EDM.borderLight}`,
          borderRadius: EDM.radius.card, boxShadow: EDM.shadowBlue01,
          padding: EDM.space[6], background: EDM.bg,
        }}>
          {tier.highlighted && (
            <span style={{
              position: 'absolute', top: -12, left: EDM.space[6],
              fontSize: 12, fontWeight: 700, color: '#fff',
              background: EDM.wine[500], borderRadius: EDM.radius.full, padding: '3px 12px',
            }}>
              가장 많이 찾는 패키지
            </span>
          )}
          <div style={{ fontSize: 13, fontWeight: 600, color: EDM.text3, marginBottom: EDM.space[2] }}>{tier.tagline}</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[1] }}>{tier.name}</div>
          {showMaintenance ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: EDM.space[1] }}>
                <span style={{ fontSize: 13, color: EDM.text3 }}>제작비</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: EDM.text1 }}>{tier.price}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: EDM.space[5] }}>
                <span style={{ fontSize: 13, color: EDM.text3 }}>유지보수</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: EDM.wine[700] }}>{tier.maintenance}</span>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 26, fontWeight: 800, color: EDM.text1, marginBottom: EDM.space[5] }}>{tier.price}</div>
          )}
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: EDM.space[2], marginBottom: EDM.space[6] }}>
            {tier.features.map((f) => (
              <li key={f} style={{ fontSize: 13.5, color: EDM.text2, display: 'flex', gap: 8 }}>
                <span style={{ color: EDM.wine[600] }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/portfolio" style={{
            display: 'block', textAlign: 'center', textDecoration: 'none',
            fontSize: 14, fontWeight: 700,
            color: tier.highlighted ? '#fff' : EDM.text1,
            background: tier.highlighted ? EDM.wine[500] : EDM.neutral[50],
            borderRadius: EDM.radius.control, padding: '11px 0',
          }}>
            문의하기
          </Link>
        </div>
      ))}
    </div>
  )
}

export default function BusinessAreas() {
  return (
    <div style={{ background: EDM.bg, minHeight: '100vh', fontFamily: EDM.font, color: EDM.text1 }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <SiteNav />

      {/* Header */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '80px 24px 48px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', fontSize: 13, fontWeight: 700, color: EDM.wine[700],
          background: EDM.wine[50], border: `1px solid ${EDM.wine[200]}`,
          padding: '6px 14px', borderRadius: EDM.radius.full, marginBottom: EDM.space[6],
        }}>
          프랜차이즈 · 소상공인을 위한 두 가지 사업영역
        </span>
        <h1 style={{ margin: 0, fontSize: 'clamp(26px, 4.5vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.35 }}>
          홈페이지 제작과 블로그 운영,<br />두 곳에서 따로 맡기지 마세요
        </h1>
        <p style={{ marginTop: EDM.space[5], fontSize: 16, color: EDM.text3, lineHeight: 1.7 }}>
          가맹점이 늘어날수록 홈페이지도 블로그도 꾸준히 관리할 손이 필요해요.
          저비용 초기 제작 + 합리적인 월 구독으로, 본사와 각 지점이 부담 없이 온라인을 운영하도록 도와드려요.
        </p>
        <div style={{ marginTop: EDM.space[7], display: 'flex', gap: EDM.space[3], justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#homepage" style={{
            fontSize: 14, fontWeight: 700, textDecoration: 'none', color: '#fff',
            background: EDM.wine[500], borderRadius: EDM.radius.control, padding: '11px 22px',
          }}>
            01. 홈페이지 제작
          </a>
          <a href="#blog" style={{
            fontSize: 14, fontWeight: 700, textDecoration: 'none', color: EDM.text1,
            border: `1px solid ${EDM.border}`, borderRadius: EDM.radius.control, padding: '11px 22px',
          }}>
            02. 블로그 제작 및 작성
          </a>
        </div>
      </section>

      {/* 01. 홈페이지 제작 */}
      <section id="homepage" style={{ background: EDM.bgAlt, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: EDM.wine[600], textAlign: 'center', marginBottom: 8 }}>01</div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
            홈페이지 제작
          </h2>
          <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3, textAlign: 'center' }}>
            템플릿 선택 → 인테이크 폼 → AI 자동 제작. 미팅 없이 비동기로 완성해 드려요.
          </p>

          <ProcessGrid items={SITE_PROCESS} />
          <ComparisonBox them={SITE_COMPARISON.them} us={SITE_COMPARISON.us} />
          <PricingGrid tiers={SITE_PRICING} showMaintenance />
        </div>
      </section>

      {/* 02. 블로그 제작 및 작성 */}
      <section id="blog" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: EDM.wine[600], textAlign: 'center', marginBottom: 8 }}>02</div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
            블로그 제작 및 작성
          </h2>
          <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3, textAlign: 'center' }}>
            검색엔진과 AI 답변 모두에 노출되도록, 매달 정기적으로 콘텐츠를 발행해 드려요.
          </p>

          <div style={{ marginTop: EDM.space[10] }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: EDM.text1, textAlign: 'center' }}>왜 광고 대신 콘텐츠인가요</h3>
            <ComparisonBox them={WHY_CONTENT.ads} us={WHY_CONTENT.content} />
          </div>

          <div style={{ marginTop: EDM.space[10] }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: EDM.text1, textAlign: 'center' }}>발행 채널 4개, 하나의 메시지로</h3>
            <div style={{ marginTop: EDM.space[7], display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: EDM.space[5] }}>
              {CHANNELS.map((c) => (
                <div key={c.title} style={{ border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card, boxShadow: EDM.shadowBlue01, padding: EDM.space[6], background: EDM.bg }}>
                  <div style={{ fontSize: 26, marginBottom: EDM.space[2] }}>{c.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[2] }}>{c.title}</div>
                  <p style={{ margin: 0, fontSize: 13.5, color: EDM.text3, lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: EDM.space[10] }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: EDM.text1, textAlign: 'center' }}>이렇게 진행돼요</h3>
            <ProcessGrid items={BLOG_PROCESS} />
          </div>

          <div style={{ marginTop: EDM.space[10] }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: EDM.text1, textAlign: 'center' }}>요금제</h3>
            <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 14, color: EDM.text3, textAlign: 'center' }}>
              약정 없이 월 단위로 진행돼요. 첫 발행 주제 제안은 무료예요.
            </p>
            <PricingGrid tiers={BLOG_PRICING} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: EDM.wine[50], padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.01em' }}>
          홈페이지도, 블로그도 — 한 곳에서 맡기세요
        </h2>
        <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3 }}>
          직접 만든 샘플을 로그인 없이 바로 체험해보실 수 있어요.
        </p>
        <Link href="/portfolio" style={{
          display: 'inline-block', marginTop: EDM.space[6],
          fontSize: 15, fontWeight: 700, textDecoration: 'none', color: '#fff',
          background: EDM.wine[500], borderRadius: EDM.radius.control, padding: '14px 32px',
        }}>
          샘플 보러가기 →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${EDM.borderLight}` }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto', padding: '32px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: EDM.text1 }}>
            바이브<span style={{ color: EDM.wine[600] }}>코딩</span>
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>회사소개</Link>
            <Link href="/business" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>사업영역</Link>
            <Link href="/portfolio" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>샘플</Link>
            <Link href="/blog" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>블로그</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
