import Link from 'next/link'
import SiteNav from './SiteNav'
import { EDM, PRETENDARD_CSS_URL } from './edmTheme'

const BUSINESS_AREAS = [
  {
    icon: '🌐',
    title: '홈페이지 제작',
    desc: '템플릿 선택 + 인테이크 폼만으로 미팅 없이 완성해요. 저비용 초기 제작 + 월 유지보수 구조예요.',
    href: '/business#homepage',
  },
  {
    icon: '📝',
    title: '블로그 제작 및 작성',
    desc: 'SEO·GEO를 함께 반영한 블로그·SNS 콘텐츠를 매달 정기적으로 제작·발행해 드려요.',
    href: '/business#blog',
  },
]

const WHY_US = [
  { title: '프랜차이즈 특화', desc: '본사 하나, 지점은 여러 곳 — 일관된 홈페이지·블로그를 지점 수만큼 빠르게 확장할 수 있어요.' },
  { title: '저비용 시작 + 구독형 유지보수', desc: '초기 제작비는 낮추고, 이후 관리는 월 구독으로 — 소상공인도 부담 없이 시작할 수 있어요.' },
  { title: '홈페이지 + 블로그, 한 곳에서', desc: '만드는 곳과 운영하는 곳이 다르면 관리가 번거로워요. 저희는 두 가지를 함께 맡아드려요.' },
]

const FEATURED_IDS = ['cafe-landing', 'lawfirm-landing', 'wedding-landing', 'shop-landing', 'salon-landing', 'realestate-landing']

export default function HomeLanding({ apps }) {
  const featured = FEATURED_IDS.map((id) => apps.find((a) => a.id === id)).filter(Boolean)

  return (
    <div style={{ background: EDM.bg, minHeight: '100vh', fontFamily: EDM.font, color: EDM.text1 }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <SiteNav />

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '96px 24px 64px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', fontSize: 13, fontWeight: 700, color: EDM.wine[700],
          background: EDM.wine[50], border: `1px solid ${EDM.wine[200]}`,
          padding: '6px 14px', borderRadius: EDM.radius.full, marginBottom: EDM.space[6],
        }}>
          프랜차이즈 · 소상공인을 위한 홈페이지 & 블로그 파트너
        </span>
        <h1 style={{
          margin: 0, fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.3, color: EDM.text1,
        }}>
          프랜차이즈 본사도 믿고 맡기는<br />
          홈페이지 & 블로그
        </h1>
        <p style={{
          marginTop: EDM.space[6], fontSize: 17, color: EDM.text3, lineHeight: 1.7,
          maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
        }}>
          가맹점이 늘어날수록 홈페이지도 블로그도 꾸준히 관리할 손이 필요해요.
          바이브코딩은 저렴한 초기 제작비와 합리적인 월 유지보수로, 본사와 사장님이 부담 없이 온라인을 운영하도록 도와드려요.
        </p>
        <div style={{ marginTop: EDM.space[8], display: 'flex', gap: EDM.space[3], justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/business" style={{
            fontSize: 15, fontWeight: 700, textDecoration: 'none', color: '#fff',
            background: EDM.wine[500], borderRadius: EDM.radius.control, padding: '14px 28px',
          }}>
            사업영역 보기 →
          </Link>
          <Link href="/portfolio" style={{
            fontSize: 15, fontWeight: 700, textDecoration: 'none', color: EDM.text1,
            border: `1px solid ${EDM.border}`, borderRadius: EDM.radius.control, padding: '14px 28px',
          }}>
            샘플 보기
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          marginTop: EDM.space[15], display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: EDM.space[4], maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
        }}>
          {[
            { value: `${apps.length}개`, label: '만든 프로젝트' },
            { value: '100%', label: '로그인 없이 바로 체험' },
            { value: '13개+', label: '업종별 홈페이지 샘플' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 26, fontWeight: 800, color: EDM.text1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: EDM.text3, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Business areas */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
          두 가지 사업영역
        </h2>
        <div style={{
          marginTop: EDM.space[8], display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: EDM.space[5],
        }}>
          {BUSINESS_AREAS.map((b) => (
            <Link key={b.title} href={b.href} style={{
              display: 'block', textDecoration: 'none', color: 'inherit',
              border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card,
              boxShadow: EDM.shadowBlue01, padding: EDM.space[7], background: EDM.bg,
            }}>
              <div style={{ fontSize: 32, marginBottom: EDM.space[4] }}>{b.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[2] }}>{b.title}</div>
              <p style={{ margin: 0, fontSize: 14, color: EDM.text3, lineHeight: 1.6 }}>{b.desc}</p>
              <div style={{ marginTop: EDM.space[5], fontSize: 13, fontWeight: 700, color: EDM.wine[600] }}>자세히 보기 →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section style={{ background: EDM.bgAlt, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
            왜 바이브코딩인가요
          </h2>
          <div style={{
            marginTop: EDM.space[8], display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: EDM.space[5],
          }}>
            {WHY_US.map((w) => (
              <div key={w.title} style={{
                border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card,
                padding: EDM.space[6], background: EDM.bg,
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[2] }}>{w.title}</div>
                <p style={{ margin: 0, fontSize: 14, color: EDM.text3, lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured samples */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: EDM.space[8] }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.01em' }}>
            대표 샘플
          </h2>
          <Link href="/portfolio" style={{ fontSize: 14, fontWeight: 600, color: EDM.wine[600], textDecoration: 'none' }}>
            전체 {apps.length}개 샘플 보기 →
          </Link>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: EDM.space[5],
        }}>
          {featured.map((app) => (
            <Link key={app.id} href={app.demoPath} style={{
              display: 'block', textDecoration: 'none', color: 'inherit',
              border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card,
              boxShadow: EDM.shadowBlue01, padding: EDM.space[6], background: EDM.bg,
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: EDM.space[3] }}>
                {app.tags.slice(0, 2).map((tag) => (
                  <span key={tag} style={{
                    fontSize: 12, fontWeight: 600, color: EDM.blue[600],
                    border: `1px solid ${EDM.blue[500]}`, borderRadius: EDM.radius.badge, padding: '2px 8px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[2] }}>{app.name}</div>
              <p style={{ margin: 0, fontSize: 14, color: EDM.text3, lineHeight: 1.6 }}>{app.description}</p>
              <div style={{ marginTop: EDM.space[4], fontSize: 13, fontWeight: 700, color: EDM.wine[600] }}>데모 보기 →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: EDM.wine[50], padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.01em' }}>
          지금 샘플에서 직접 체험해보세요
        </h2>
        <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3 }}>
          로그인 없이, 모든 샘플을 바로 눌러볼 수 있어요.
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
