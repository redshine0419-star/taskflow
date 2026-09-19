import { GLink as Link } from './nav.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-org">
            <p><strong>사단법인 글로벌호프</strong></p>
            <p>서울특별시 영등포구 희망로 123 글로벌호프빌딩 | 대표: 홍길동</p>
            <p>고유번호 123-45-67890 | 후원계좌 국민은행 123456-04-123456 (예금주: 글로벌호프)</p>
            <p>대표전화 1588-0000 | 이메일 help@example.org</p>
          </div>
          <div className="social-links">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="Youtube">yt</a>
            <a href="#" aria-label="Blog">bl</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-links">
            <Link to="/about">단체소개</Link>
            <Link to="/programs">사업소개</Link>
            <Link to="/news">소식</Link>
            <Link to="/donate">후원안내</Link>
            <Link to="/contact">이용약관</Link>
            <Link to="/contact">개인정보처리방침</Link>
          </div>
          <span>© 2026 GlobalHope. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
