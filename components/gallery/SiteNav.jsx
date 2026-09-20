'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { EDM } from './edmTheme'

const NAV_ITEMS = [
  { href: '/', label: '메인' },
  { href: '/portfolio', label: '포트폴리오' },
  { href: '/blog', label: '블로그' },
]

export default function SiteNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${EDM.borderLight}`,
    }}>
      <div style={{
        maxWidth: 1160, margin: '0 auto', padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{
          fontWeight: 800, fontSize: 17, textDecoration: 'none',
          color: EDM.text1, letterSpacing: -0.5,
        }}>
          바이브<span style={{ color: EDM.green[600] }}>코딩</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  color: active ? EDM.text1 : EDM.text3,
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/portfolio"
            style={{
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              background: EDM.green[500], color: '#fff',
              padding: '9px 16px', borderRadius: EDM.radius.control, whiteSpace: 'nowrap',
            }}
          >
            포트폴리오 보기
          </Link>
        </div>
      </div>
    </nav>
  )
}
