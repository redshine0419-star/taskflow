'use client'
import { usePathname } from 'next/navigation'
import AdminShell from '../../../../components/gallery/globalhope/AdminShell.jsx'

export default function GlobalHopeAdminLayout({ children }) {
  const pathname = usePathname()
  if (pathname?.endsWith('/admin/login')) return children
  return <AdminShell>{children}</AdminShell>
}
