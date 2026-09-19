import PageHeader from '../PageHeader.jsx'

const HISTORY = [
  { year: '1999', text: '사단법인 글로벌호프 설립' },
  { year: '2004', text: '해외 아동결연 사업 개시 (3개국)' },
  { year: '2011', text: '국내 취약계층 아동 자립 지원 사업 시작' },
  { year: '2015', text: '긴급구호팀 신설, 재난 대응 체계 구축' },
  { year: '2020', text: '후원자 30만 명 돌파' },
  { year: '2026', text: '38개국 아동 12만 8천여 명 지원 중' },
]

export default function About() {
  return (
    <div>
      <PageHeader title="단체소개" breadcrumb="홈 > 소개 > 단체소개" />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">MISSION</span>
            <h2>모든 아이가 존엄하게 성장할 권리를 지킵니다</h2>
            <p>
              글로벌호프는 아동의 생존과 보호, 발달과 참여의 권리를 실현하기 위해 활동하는 비영리
              국제구호개발 NGO입니다. 국내외 취약계층 아동에게 교육, 보건, 식수위생, 자립 지원 등
              다양한 프로그램을 제공하며, 재난과 위기 상황에서는 긴급구호 활동을 펼칩니다.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card category-card">
              <div className="icon-badge">🎯</div>
              <h3>비전</h3>
              <p>모든 아동이 안전하고 건강하게, 자신의 잠재력을 온전히 발휘하며 성장하는 세상</p>
            </div>
            <div className="card category-card">
              <div className="icon-badge">🤝</div>
              <h3>핵심가치</h3>
              <p>투명성, 책무성, 지역사회 참여를 바탕으로 지속가능한 변화를 만듭니다</p>
            </div>
            <div className="card category-card">
              <div className="icon-badge">🌱</div>
              <h3>활동방식</h3>
              <p>단기 지원이 아닌 지역사회 역량 강화를 통한 자립 기반 마련에 집중합니다</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">HISTORY</span>
            <h2>연혁</h2>
          </div>
          <div className="timeline" style={{ maxWidth: 640, margin: '0 auto' }}>
            {HISTORY.map((h) => (
              <div key={h.year} className="timeline-item">
                <strong>{h.year}</strong>
                {h.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">TRANSPARENCY</span>
            <h2>투명하고 책임있는 운영</h2>
            <p>
              글로벌호프는 외부 회계법인의 정기 감사를 받고 있으며, 후원금 사용 내역을 매년
              홈페이지와 후원자 보고서를 통해 투명하게 공개합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
