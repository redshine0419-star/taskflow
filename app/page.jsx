import PortfolioGallery from '../components/gallery/PortfolioGallery'
import { apps } from '../data/apps'

export const metadata = {
  title: '포트폴리오 갤러리 — 바이브 코딩',
  description: '바이브 코딩으로 만든 앱들을 모아보는 포트폴리오 갤러리입니다.',
}

export default function Home() {
  return <PortfolioGallery apps={apps} />
}
