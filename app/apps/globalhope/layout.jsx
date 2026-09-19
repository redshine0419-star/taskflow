import '../../../components/gallery/globalhope/globalhope.css'

export const metadata = {
  title: '글로벌호프 — 포트폴리오 갤러리',
  description: 'NGO 후원단체 홈페이지 + 관리자 CMS 데모입니다.',
}

export default function GlobalHopeRootLayout({ children }) {
  return <div className="gh-scope">{children}</div>
}
