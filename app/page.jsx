import HomeLanding from '../components/gallery/HomeLanding'
import { apps } from '../data/apps'

export const metadata = {
  title: '바이브코딩 — 아이디어를 실제 서비스로 만들어 드립니다',
  description: 'AI와 함께하는 바이브 코딩으로 홈페이지와 웹 앱을 빠르게 만들어 드리는 서비스입니다. 지금까지 만든 프로젝트를 포트폴리오에서 바로 체험해보세요.',
}

export default function Home() {
  return <HomeLanding apps={apps} />
}
