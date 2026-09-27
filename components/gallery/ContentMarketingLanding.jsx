import Link from 'next/link'
import SiteNav from './SiteNav'
import { EDM, PRETENDARD_CSS_URL } from './edmTheme'

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

const PROCESS = [
  { step: '01', title: '키워드 · 주제 선정', desc: '업종·지역·경쟁 상황을 분석해 핵심 키워드와 발행 주제를 제안해요.' },
  { step: '02', title: '일정표 전달', desc: '키워드·주제·발행 채널·예정일을 정리한 일정표를 보내드려요. 직접 확인하고 수정할 수 있어요.' },
  { step: '03', title: '콘텐츠 제작', desc: '일정표가 확정되면 SEO·GEO 기준에 맞춰 블로그·카드뉴스를 제작해요.' },
  { step: '04', title: '검수 & 발행', desc: '완성된 콘텐츠를 확인해주시면, 채널별 형식에 맞춰 직접 발행까지 진행해요.' },
]

const PRICING = [
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
    tagline: '4채널 · 월 16회 발행',
    features: ['블로그 + 인스타 + 틱톡 + 홈페이지', 'SEO + GEO 이중 최적화', '채널별 맞춤 재가공', '브랜드 노출을 본격적으로 확대하고 싶은 분께'],
  },
]

export default function ContentMarketingLanding() {
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
          SEO · GEO 이중 최적화 콘텐츠 구독
        </span>
        <h1 style={{
          margin: 0, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.35, color: EDM.text1,
        }}>
          광고비 대신, 검색에 쌓이는<br />
          콘텐츠 자산을 만들어요
        </h1>
        <p style={{
          marginTop: EDM.space[6], fontSize: 17, color: EDM.text3, lineHeight: 1.7,
          maxWidth: 620, marginLeft: 'auto', marginRight: 'auto',
        }}>
          검색엔진뿐 아니라 ChatGPT·Perplexity 같은 AI 답변에도 인용될 수 있도록,
          블로그·인스타그램·틱톡·홈페이지에 정기적으로 콘텐츠를 발행해 드려요.
        </p>
        <div style={{ marginTop: EDM.space[8], display: 'flex', gap: EDM.space[3], justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#pricing" style={{
            fontSize: 15, fontWeight: 700, textDecoration: 'none', color: '#fff',
            background: EDM.green[500], borderRadius: EDM.radius.control, padding: '14px 28px',
          }}>
            요금제 보기 →
          </a>
          <a href="#process" style={{
            fontSize: 15, fontWeight: 700, textDecoration: 'none', color: EDM.text1,
            border: `1px solid ${EDM.border}`, borderRadius: EDM.radius.control, padding: '14px 28px',
          }}>
            진행 방식 보기
          </a>
        </div>
      </section>

      {/* Why content, not ads */}
      <section style={{ background: EDM.bgAlt, padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
            왜 광고 대신 콘텐츠인가요
          </h2>
          <div style={{
            marginTop: EDM.space[8],
            border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card,
            boxShadow: EDM.shadowBlue01, padding: EDM.space[6], background: EDM.bg,
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: EDM.space[6],
          }}>
            {[WHY_CONTENT.ads, WHY_CONTENT.content].map((col, i) => (
              <div key={col.label}>
                <div style={{
                  fontSize: 13, fontWeight: 700, marginBottom: EDM.space[3],
                  color: i === 1 ? EDM.green[700] : EDM.text3,
                }}>
                  {col.label}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: EDM.space[2] }}>
                  {col.rows.map((r) => (
                    <li key={r} style={{ fontSize: 13.5, color: EDM.text2, lineHeight: 1.6, display: 'flex', gap: 8 }}>
                      <span style={{ color: i === 1 ? EDM.green[600] : EDM.text3 }}>{i === 1 ? '✓' : '·'}</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
          발행 채널 4개, 하나의 메시지로
        </h2>
        <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3, textAlign: 'center' }}>
          하나의 주제를 기획한 뒤, 각 채널의 성격에 맞게 가공해서 발행해요.
        </p>
        <div style={{
          marginTop: EDM.space[8], display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: EDM.space[5],
        }}>
          {CHANNELS.map((c) => (
            <div key={c.title} style={{
              border: `1px solid ${EDM.borderLight}`, borderRadius: EDM.radius.card,
              boxShadow: EDM.shadowBlue01, padding: EDM.space[6], background: EDM.bg,
            }}>
              <div style={{ fontSize: 28, marginBottom: EDM.space[3] }}>{c.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: EDM.text1, marginBottom: EDM.space[2] }}>{c.title}</div>
              <p style={{ margin: 0, fontSize: 14, color: EDM.text3, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" style={{ background: EDM.bgAlt, padding: '64px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
            이렇게 진행돼요
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

      {/* Pricing */}
      <section id="pricing" style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: EDM.text1, textAlign: 'center', letterSpacing: '-0.01em' }}>
            요금제
          </h2>
          <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3, textAlign: 'center' }}>
            약정 없이 월 단위로 진행돼요. 첫 발행 주제 제안은 무료예요.
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
                <div style={{ fontSize: 26, fontWeight: 800, color: EDM.text1, marginBottom: EDM.space[5] }}>{tier.price}</div>
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
          홈페이지도, 그 홈페이지를 채울 콘텐츠도 — 한 곳에서
        </h2>
        <p style={{ margin: `${EDM.space[3]}px 0 0`, fontSize: 15, color: EDM.text3 }}>
          홈페이지 제작과 콘텐츠 마케팅을 함께 맡기면 관리가 훨씬 편해져요.
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
            <Link href="/content-marketing" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>콘텐츠 마케팅</Link>
            <Link href="/blog" style={{ fontSize: 13, color: EDM.text3, textDecoration: 'none' }}>블로그</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
