'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function PublicShell({ children }) {
  const pathname = usePathname()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
