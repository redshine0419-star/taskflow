import Link from 'next/link'
import SiteNav from './SiteNav'
import { EDM, PRETENDARD_CSS_URL } from './edmTheme'

const SERVICES = [
  {
    icon: '🗂️',
    title: '업무용 SaaS 웹앱',
    desc: '칸반 보드, 운영 대시보드처럼 팀이 매일 쓰는 웹 서비스를 만들어요.',
  },
  {
    icon: '🤖',
    title: 'AI 기능 연동',
    desc: '진단, 콘텐츠 생성, 챗봇처럼 AI가 실제로 일하는 기능을 앱에 붙여요.',
  },
  {
    icon: '🌐',
    title: '홈페이지 · 랜딩페이지',
    desc: '단체·서비스 소개 홈페이지부터 관리자 CMS까지 한 번에 만들어요.',
  },
  {
    icon: '📊',
    title: '운영 대시보드',
    desc: '여러 서비스의 현황·비용·데이터를 한 화면에서 관리하게 해줘요.',
  },
]

const PROCESS = [
  { step: '01', title: '요구사항 정리', desc: '어떤 서비스가 필요한지 짧은 대화로 정리해요.' },
  { step: '02', title: '바이브 코딩 프로토타입', desc: 'AI와 함께 실제로 동작하는 화면을 빠르게 만들어요.' },
  { step: '03', title: '반복 개선', desc: '실사용 흐름을 테스트하면서 다듬어요.' },
  { step: '04', title: '배포 & 전달', desc: '바로 쓸 수 있는 상태로 배포해서 전달해요.' },
]

const FEATURED_IDS = ['cafe-landing', 'lawfirm-landing', 'wedding-landing', 'taskflow', 'marketerops-diagnosis', 'realestate-landing']

const PRICING = [
  {
    name: '랜딩페이지',
    price: '50만원~',
    tagline: '소개 홈페이지 · 랜딩페이지',
    features: ['1페이지 반응형 디자인', '핵심 섹션 3~5개 구성', '문의 폼 연동', '평균 제작 기간 1주'],
  },
  {
    name: '비즈니스 홈페이지',
    price: '150만원~',
    tagline: '기업 · 단체 홈페이지 + 관리자 CMS',
    features: ['5페이지 내외 구성', '콘텐츠 관리자 CMS 포함', '반응형 디자인', '평균 제작 기간 2~3주'],
    highlighted: true,
  },
  {
    name: '맞춤 웹 서비스',
    price: '300만원~',
    tagline: '칸반 툴 · 대시보드 · AI 기능 연동',
    features: ['커스텀 기능 개발', 'AI 기능 연동 옵션', '데이터 저장 구조 설계', '규모는 별도 협의'],
  },
]

export default function HomeLanding({ apps }) {
  const featured = FEATURED_IDS.map((id) => apps.find((a) => a.id === id)).filter(Boolean)

  return (
    <div style={{ background: EDM.bg, minHeight: '100vh', fontFamily: EDM.font, color: EDM.text1 }}>
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <SiteNav />

      {/* Hero */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '96px 24px 64px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block', fontSize: 13, fontWeight: 700, color: EDM.green[700],
          background: EDM.green[50], border: `1px solid ${EDM.green[200]}`,
          padding: '6px 14px', borderRadius: EDM.radius.full, marginBottom: EDM.space[6],
        }}>
          바이브 코딩으로 만드는 실전 웹 서비스
        </span>
        <h1 style={{
          margin: 0, fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.3, color: EDM.text1,
        }}>
          말로 설명한 아이디어가,<br />
          며칠 만에 실제로 쓰는 앱이 됩니다
        </h1>
        <p style={{
          marginTop: EDM.space[6], fontSize: 17, color: EDM.text3, lineHeight: 1.7,
          maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
        }}>
          기획서 대신 프롬프트로 시작해서, AI와 함께 빠르게 프로토타입을 만들고 다듬어 실제 서비스로 완성해 드려요.
          칸반 툴부터 AI 마케팅 대시보드, 단체 홈페이지까지 — 직접 만든 결과물로 증명합니다.
        </p>
        <div style={{ marginTop: EDM.space[8], display: 'flex', gap: EDM.space[3], justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/portfolio" style={{
            fontSize: 15, fontWeight: 700, textDecoration: 'none', color: '#fff',
            background: EDM.green[500], borderRadius: EDM.radius.control, padding: '14px 28px',
          }}>
            포트폴리오 둘러보기 →
          </Link>
          <a href="#process" style={{
            fontSize: 15, fontWeight: 700, textDecoration: 'none', color: EDM.text1,
            border: `1px solid ${EDM.border}`, borderRadius: EDM.radius.control, padding: '14px 28px',
          }}>
            만드는 과정 보기
          </a>
        </div>

        {/* Stats */}
        <div style={{
          marginTop: EDM.space[15], display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: EDM.space[4], maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
        }}>
          {[
            { value: `${apps.length}개`, label: '만든 프로젝트' },
            { value: '100%', label: '로그인 없이 바로 체험' },
            { value: '4가지', label: '제작 가능한 서비스 유형' },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 26, fontWeight: 800, color: EDM.text1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: EDM.text3, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
          무엇을 만들어 드리나요
        </h2>
        <div style={{
          marginTop: EDM.space[8], display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: EDM.space[5],
        }}>
          {SERVICES.map((s) => (
            <div key={s.title} style={{
              border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card,
              boxShadow: EDM.shadowBlue01, padding: EDM.space[6], background: EDM.bg,
            }}>
              <div style={{ fontSize: 28, marginBottom: EDM.space[3] }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[2] }}>{s.title}</div>
              <p style={{ margin: 0, fontSize: 14, color: EDM.text3, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" style={{ background: EDM.bgAlt, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
            이렇게 만들어드려요
          </h2>
          <div style={{
            marginTop: EDM.space[8], display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: EDM.space[5],
          }}>
            {PROCESS.map((p) => (
              <div key={p.step} style={{
                border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card,
                padding: EDM.space[6], background: EDM.bg,
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: EDM.green[600], marginBottom: EDM.space[2] }}>{p.step}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[2] }}>{p.title}</div>
                <p style={{ margin: 0, fontSize: 14, color: EDM.text3, lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: EDM.space[8] }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.01em' }}>
            대표 작업물
          </h2>
          <Link href="/portfolio" style={{ fontSize: 14, fontWeight: 600, color: EDM.green[600], textDecoration: 'none' }}>
            전체 {apps.length}개 프로젝트 보기 →
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
              <div style={{ marginTop: EDM.space[4], fontSize: 13, fontWeight: 700, color: EDM.green[600] }}>데모 보기 →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: EDM.bgAlt, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
            가격 안내
          </h2>
          <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3, textAlign: 'center' }}>
            프로젝트 범위에 따라 달라질 수 있는 참고용 가격이에요. 정확한 견적은 문의 후 안내해드려요.
          </p>
          <div style={{
            marginTop: EDM.space[8], display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: EDM.space[5],
          }}>
            {PRICING.map((tier) => (
              <div key={tier.name} style={{
                position: 'relative',
                border: tier.highlighted ? `2px solid ${EDM.green[500]}` : `1px solid ${EDM.borderLight}`,
                borderRadius: EDM.radius.card, boxShadow: EDM.shadowBlue01,
                padding: EDM.space[6], background: EDM.bg,
              }}>
                {tier.highlighted && (
                  <span style={{
                    position: 'absolute', top: -12, left: EDM.space[6],
                    fontSize: 12, fontWeight: 700, color: '#fff',
                    background: EDM.green[500], borderRadius: EDM.radius.full, padding: '3px 12px',
                  }}>
                    가장 많이 찾는 패키지
                  </span>
                )}
                <div style={{ fontSize: 13, fontWeight: 600, color: EDM.text3, marginBottom: EDM.space[2] }}>{tier.tagline}</div>
                <div style={{ fontSize: 19, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[1] }}>{tier.name}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: EDM.text1, marginBottom: EDM.space[5] }}>{tier.price}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: EDM.space[2], marginBottom: EDM.space[6] }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ fontSize: 13.5, color: EDM.text2, display: 'flex', gap: 8 }}>
                      <span style={{ color: EDM.green[600] }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/portfolio" style={{
                  display: 'block', textAlign: 'center', textDecoration: 'none',
                  fontSize: 14, fontWeight: 700,
                  color: tier.highlighted ? '#fff' : EDM.text1,
                  background: tier.highlighted ? EDM.green[500] : EDM.neutral[50],
                  borderRadius: EDM.radius.control, padding: '11px 0',
                }}>
                  문의하기
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: EDM.green[50], padding: '72px 24px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: EDM.text1, letterSpacing: '-0.01em' }}>
          지금 포트폴리오에서 직접 체험해보세요
        </h2>
        <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3 }}>
          로그인 없이, 모든 데모를 바로 눌러볼 수 있어요.
        </p>
        <Link href="/portfolio" style={{
          display: 'inline-block', marginTop: EDM.space[6],
          fontSize: 15, fontWeight: 700, textDecoration: 'none', color: '#fff',
          background: EDM.green[500], borderRadius: EDM.radius.control, padding: '14px 32px',
        }}>
          포트폴리오 보러가기 →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${EDM.borderLight}` }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto', padding: '32px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: EDM.text1 }}>
            바이브<span style={{ color: EDM.green[600] }}>코딩</span>
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>메인</Link>
            <Link href="/portfolio" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>포트폴리오</Link>
            <Link href="/blog" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>블로그</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
