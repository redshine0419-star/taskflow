import Link from 'next/link'
import { PRETENDARD_CSS_URL } from './edmTheme'

const FEATURED_IDS = ['cafe-landing', 'lawfirm-landing', 'wedding-landing', 'shop-landing', 'salon-landing', 'realestate-landing']

const SAMPLE_IMAGES = {
  'cafe-landing': { src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80', alt: '카페 홈페이지 샘플' },
  'lawfirm-landing': { src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80', alt: '법률사무소 홈페이지 샘플' },
  'wedding-landing': { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', alt: '웨딩 홈페이지 샘플' },
  'shop-landing': { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80', alt: '쇼핑몰 홈페이지 샘플' },
  'salon-landing': { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80', alt: '헤어살롱 홈페이지 샘플' },
  'realestate-landing': { src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80', alt: '부동산 홈페이지 샘플' },
}

const NAV_ITEMS = [
  { href: '/', label: '회사소개' },
  { href: '/business', label: '사업영역' },
  { href: '/portfolio', label: '샘플' },
  { href: '/blog', label: '블로그' },
]

const SERVICES = [
  {
    icon: '◈',
    title: '홈페이지 제작',
    desc: '템플릿 선택과 인테이크 폼을 기반으로 미팅 부담을 줄이고 빠르게 완성합니다. 저비용 초기 제작 + 월 유지보수 구조로 운영 부담을 낮춥니다.',
    href: '/business#homepage',
  },
  {
    icon: '✎',
    title: '블로그 제작 및 작성',
    desc: 'SEO·GEO를 고려한 블로그와 SNS 콘텐츠를 정기적으로 제작·발행해 브랜드가 검색과 콘텐츠에서 꾸준히 노출되도록 돕습니다.',
    href: '/business#blog',
  },
]

const WHY_US = [
  { num: '01', title: '프랜차이즈 특화', desc: '본사 하나, 지점은 여러 곳. 일관된 홈페이지와 콘텐츠를 지점 수에 맞춰 빠르게 확장할 수 있습니다.' },
  { num: '02', title: '저비용 시작 + 구독형 유지보수', desc: '초기 제작비는 낮추고 이후 관리는 월 구독으로 연결해 소상공인도 부담을 나누어 시작할 수 있습니다.' },
  { num: '03', title: '홈페이지 + 블로그, 한 곳에서', desc: '만드는 곳과 운영하는 곳이 달라지는 번거로움을 줄이고 홈페이지와 콘텐츠를 한 흐름으로 관리합니다.' },
]

const STYLE = `
.tg-home{
  --ink:#171316;--muted:#71696d;--line:#e9e1e4;--wine:#8d1839;--wine2:#b12b50;
  --rose:#fff3f6;--cream:#fffaf8;--white:#fff;--shadow:0 18px 50px rgba(60,20,35,.10);
  color:var(--ink);font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--cream);
}
.tg-home *{box-sizing:border-box}
.tg-home a{text-decoration:none;color:inherit}
.tg-home .container{max-width:1160px;margin:auto;padding:0 24px}
.tg-home nav{position:sticky;top:0;z-index:50;background:rgba(255,250,248,.88);backdrop-filter:blur(16px);border-bottom:1px solid rgba(233,225,228,.9)}
.tg-home .navin{height:72px;display:flex;align-items:center;justify-content:space-between}
.tg-home .logo{font-size:20px;font-weight:900;letter-spacing:-.7px}.tg-home .logo span{color:var(--wine)}
.tg-home .navlinks{display:flex;align-items:center;gap:27px;font-size:14px;font-weight:600;color:#645d60}
.tg-home .navlinks .active{color:var(--ink)}.tg-home .navcta{background:var(--wine);color:white;padding:11px 17px;border-radius:999px}
.tg-home .hero{position:relative;overflow:hidden;padding:86px 0 90px;background:
 radial-gradient(circle at 78% 22%,rgba(177,43,80,.16),transparent 27%),
 radial-gradient(circle at 12% 70%,rgba(255,214,224,.7),transparent 25%),
 linear-gradient(135deg,#fffaf8 0%,#fff4f6 100%)}
.tg-home .hero:after{content:"";position:absolute;width:430px;height:430px;border-radius:50%;right:-180px;bottom:-240px;background:rgba(141,24,57,.07)}
.tg-home .hero-grid{display:grid;grid-template-columns:1.02fr .98fr;gap:54px;align-items:center;position:relative;z-index:1}
.tg-home .eyebrow{display:inline-flex;align-items:center;gap:8px;padding:8px 13px;border:1px solid #efc3cf;background:#fff7f9;color:#75142f;border-radius:999px;font-size:13px;font-weight:800}
.tg-home .eyebrow i{width:7px;height:7px;border-radius:50%;background:var(--wine)}
.tg-home h1{font-size:clamp(38px,5vw,66px);line-height:1.13;letter-spacing:-.055em;margin:22px 0 20px;font-weight:900}
.tg-home .hero-copy{font-size:17px;line-height:1.8;color:var(--muted);max-width:600px}
.tg-home .actions{display:flex;gap:11px;flex-wrap:wrap;margin-top:30px}.tg-home .btn{padding:14px 23px;border-radius:12px;font-weight:800;font-size:14px}
.tg-home .btn.primary{background:var(--wine);color:#fff;box-shadow:0 10px 25px rgba(141,24,57,.22)}.tg-home .btn.secondary{background:#fff;border:1px solid var(--line)}
.tg-home .hero-visual{position:relative}.tg-home .hero-photo{height:490px;border-radius:28px;overflow:hidden;box-shadow:var(--shadow);position:relative}
.tg-home .hero-photo img{width:100%;height:100%;object-fit:cover}.tg-home .hero-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(30,7,15,.42))}
.tg-home .floating{position:absolute;z-index:2;background:#fff;border:1px solid rgba(255,255,255,.8);box-shadow:0 15px 35px rgba(40,10,20,.14);border-radius:16px;padding:16px 18px}
.tg-home .float-a{left:-28px;bottom:34px}.tg-home .float-b{right:-22px;top:32px}
.tg-home .float-num{font-size:23px;font-weight:900}.tg-home .float-label{font-size:12px;color:var(--muted);margin-top:3px}
.tg-home .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:52px;background:#eadfe3;border:1px solid #eadfe3;border-radius:18px;overflow:hidden}
.tg-home .stat{background:rgba(255,255,255,.68);padding:19px;text-align:center}.tg-home .stat strong{display:block;font-size:23px}.tg-home .stat span{font-size:12px;color:var(--muted)}
.tg-home section{padding:92px 0}.tg-home .section-head{text-align:center;max-width:700px;margin:0 auto 42px}.tg-home .kicker{font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--wine)}.tg-home h2{font-size:36px;letter-spacing:-.045em;margin:8px 0 12px}.tg-home .lead{color:var(--muted);line-height:1.75;margin:0}
.tg-home .services{display:grid;grid-template-columns:repeat(2,1fr);gap:22px}.tg-home .service{position:relative;overflow:hidden;min-height:310px;border-radius:24px;background:#fff;border:1px solid var(--line);padding:34px;box-shadow:0 10px 35px rgba(50,25,30,.05)}
.tg-home .service:after{content:"";position:absolute;width:190px;height:190px;border-radius:50%;right:-60px;bottom:-80px;background:#fff0f3}
.tg-home .service-icon{width:54px;height:54px;border-radius:16px;display:grid;place-items:center;background:var(--rose);font-size:25px;margin-bottom:30px}
.tg-home .service h3{font-size:23px;margin:0 0 10px;letter-spacing:-.03em}.tg-home .service p{max-width:470px;color:var(--muted);line-height:1.75;margin:0}.tg-home .arrow{display:inline-block;margin-top:25px;color:var(--wine);font-weight:800;font-size:14px}
.tg-home .why{background:#21161a;color:#fff}.tg-home .why .lead{color:#cfc1c5}.tg-home .why-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.tg-home .why-card{padding:30px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.055);border-radius:20px}.tg-home .why-card .num{font-size:12px;color:#e6a5b6;font-weight:800}.tg-home .why-card h3{font-size:18px;margin:15px 0 9px}.tg-home .why-card p{font-size:14px;line-height:1.75;color:#cfc1c5;margin:0}
.tg-home .portfolio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.tg-home .project{display:block;border-radius:20px;background:#fff;border:1px solid var(--line);overflow:hidden;transition:.25s;box-shadow:0 8px 30px rgba(40,20,25,.05)}.tg-home .project:hover{transform:translateY(-5px);box-shadow:0 18px 45px rgba(40,20,25,.12)}
.tg-home .project-img{height:205px;overflow:hidden;background:#eee}.tg-home .project-img img{width:100%;height:100%;object-fit:cover;transition:.45s}.tg-home .project:hover img{transform:scale(1.05)}
.tg-home .project-body{padding:22px}.tg-home .tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:13px}.tg-home .tag{font-size:11px;font-weight:800;padding:5px 8px;border-radius:999px;background:#f9edf1;color:var(--wine)}.tg-home .project h3{font-size:17px;margin:0 0 7px}.tg-home .project p{font-size:13px;color:var(--muted);line-height:1.65;margin:0}.tg-home .demo{display:block;margin-top:17px;color:var(--wine);font-size:13px;font-weight:800}
.tg-home .cta{padding:88px 24px;background:linear-gradient(135deg,#fce9ef,#fff6f4);text-align:center}.tg-home .cta h2{font-size:34px}.tg-home .cta p{color:var(--muted)}.tg-home .cta .btn{display:inline-block;margin-top:22px}
.tg-home footer{background:#fff;border-top:1px solid var(--line)}.tg-home .footerin{padding:32px 0;display:flex;justify-content:space-between;gap:20px;align-items:center}.tg-home .footlinks{display:flex;gap:20px;color:var(--muted);font-size:13px}
@media(max-width:850px){.tg-home .hero-grid{grid-template-columns:1fr}.tg-home .hero{padding-top:58px}.tg-home .hero-photo{height:390px}.tg-home .float-a{left:12px}.tg-home .float-b{right:12px}.tg-home .portfolio-grid{grid-template-columns:repeat(2,1fr)}.tg-home .why-grid{grid-template-columns:1fr}.tg-home .navlinks a:not(.navcta){display:none}}
@media(max-width:560px){.tg-home .container{padding:0 18px}.tg-home .navin{height:64px}.tg-home .navcta{padding:9px 13px}.tg-home .hero-grid{gap:30px}.tg-home .hero-photo{height:330px;border-radius:20px}.tg-home h1{font-size:42px}.tg-home .stats{grid-template-columns:1fr}.tg-home .services,.tg-home .portfolio-grid{grid-template-columns:1fr}.tg-home section{padding:68px 0}.tg-home .footerin{align-items:flex-start;flex-direction:column}.tg-home .footlinks{flex-wrap:wrap}}
`

export default function HomeLanding({ apps }) {
  const featured = FEATURED_IDS.map((id) => apps.find((a) => a.id === id)).filter(Boolean)

  return (
    <div className="tg-home">
      <link rel="stylesheet" href={PRETENDARD_CSS_URL} />
      <style>{STYLE}</style>

      <nav>
        <div className="container navin">
          <Link className="logo" href="/">Task<span>Grid</span></Link>
          <div className="navlinks">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} className={item.href === '/' ? 'active' : ''} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="navcta" href="/portfolio">샘플 보기</Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow"><i></i> 프랜차이즈 · 소상공인을 위한 홈페이지 & 블로그 파트너</div>
            <h1>가게의 첫인상을<br /><span style={{ color: 'var(--wine)' }}>온라인에서도</span> 제대로.</h1>
            <p className="hero-copy">가맹점이 늘어날수록 홈페이지도 블로그도 꾸준히 관리할 손이 필요해요. TaskGrid는 저렴한 초기 제작과 합리적인 월 유지보수로 본사와 사장님의 온라인 운영을 함께합니다.</p>
            <div className="actions">
              <Link className="btn primary" href="/business">사업영역 보기 →</Link>
              <Link className="btn secondary" href="/portfolio">샘플 바로 보기</Link>
            </div>
            <div className="stats">
              <div className="stat"><strong>{apps.length}+</strong><span>만든 프로젝트</span></div>
              <div className="stat"><strong>100%</strong><span>로그인 없이 체험</span></div>
              <div className="stat"><strong>13+</strong><span>업종별 샘플</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85" alt="세련된 소상공인 매장과 온라인 비즈니스 이미지" />
            </div>
            <div className="floating float-a"><div className="float-num">{apps.length}+</div><div className="float-label">실제 제작 샘플</div></div>
            <div className="floating float-b"><div className="float-num">SEO · GEO</div><div className="float-label">콘텐츠까지 함께</div></div>
          </div>
        </div>
      </header>

      <section>
        <div className="container">
          <div className="section-head">
            <div className="kicker">What we do</div>
            <h2>홈페이지와 콘텐츠를<br />한 번에 관리하세요</h2>
            <p className="lead">처음 만드는 것보다 중요한 건 계속 운영되는 것입니다. 제작부터 콘텐츠까지 하나의 흐름으로 연결합니다.</p>
          </div>
          <div className="services">
            {SERVICES.map((s) => (
              <Link key={s.title} className="service" href={s.href}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="arrow">자세히 보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="why">
        <div className="container">
          <div className="section-head">
            <div className="kicker">Why TaskGrid</div>
            <h2>작게 시작하고, 오래 운영할 수 있게</h2>
            <p className="lead">프랜차이즈와 소상공인이 실제로 필요한 운영 구조에 집중합니다.</p>
          </div>
          <div className="why-grid">
            {WHY_US.map((w) => (
              <div key={w.num} className="why-card">
                <div className="num">{w.num}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head" style={{ textAlign: 'left', maxWidth: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20 }}>
            <div>
              <div className="kicker">Selected work</div>
              <h2>대표 샘플</h2>
              <p className="lead">업종에 따라 달라지는 디자인과 기능을 직접 확인해보세요.</p>
            </div>
            <Link className="arrow" href="/portfolio">전체 {apps.length}개 샘플 보기 →</Link>
          </div>
          <div className="portfolio-grid">
            {featured.map((app) => {
              const img = SAMPLE_IMAGES[app.id]
              return (
                <Link key={app.id} className="project" href={app.demoPath}>
                  {img && (
                    <div className="project-img">
                      <img src={img.src} alt={img.alt} />
                    </div>
                  )}
                  <div className="project-body">
                    <div className="tags">
                      {app.tags.slice(0, 2).map((tag) => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                    <h3>{app.name}</h3>
                    <p>{app.description}</p>
                    <span className="demo">데모 보기 →</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>샘플을 직접 눌러보고 결정하세요</h2>
        <p>로그인 없이 업종별 홈페이지 샘플을 바로 확인할 수 있습니다.</p>
        <Link className="btn primary" href="/portfolio">샘플 보러가기 →</Link>
      </section>

      <footer>
        <div className="container footerin">
          <div className="logo">Task<span>Grid</span></div>
          <div className="footlinks">
            <Link href="/">회사소개</Link>
            <Link href="/business">사업영역</Link>
            <Link href="/portfolio">샘플</Link>
            <Link href="/blog">블로그</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
