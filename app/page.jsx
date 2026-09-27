import HomeLanding from '../components/gallery/HomeLanding'
import { apps } from '../data/apps'

export const metadata = {
  title: '바이브코딩 — 프랜차이즈 · 소상공인 홈페이지 & 블로그 파트너',
  description: '저비용 초기 제작과 합리적인 월 유지보수로, 프랜차이즈와 소상공인의 홈페이지 제작 · 블로그 제작 및 작성을 함께 맡아드립니다.',
}

export default function Home() {
  return <HomeLanding apps={apps} />
}
