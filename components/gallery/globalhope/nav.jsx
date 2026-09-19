'use client'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

export const GH_BASE = '/apps/globalhope'

function resolveClassName(className, isActive) {
  if (typeof className === 'function') return className({ isActive })
  return className
}

// Drop-in replacement for react-router-dom's <Link to="...">, prefixed to live under GH_BASE.
export function GLink({ to, children, className, onClick, ...rest }) {
  return (
    <NextLink href={`${GH_BASE}${to}`} className={resolveClassName(className, false)} onClick={onClick} {...rest}>
      {children}
    </NextLink>
  )
}

// Drop-in replacement for react-router-dom's <NavLink>, computing isActive from the current pathname.
export function GNavLink({ to, end, children, className, onClick, ...rest }) {
  const pathname = usePathname()
  const target = `${GH_BASE}${to}`
  const isActive = end ? pathname === target : pathname === target || pathname?.startsWith(`${target}/`)
  return (
    <NextLink href={target} className={resolveClassName(className, isActive)} onClick={onClick} {...rest}>
      {children}
    </NextLink>
  )
}
