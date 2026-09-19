'use client'
import { useState } from 'react'
import { GNavLink as NavLink } from './nav.jsx'

const NAV_ITEMS = [
  { to: '/about', label: '소개' },
  { to: '/programs', label: '사업소개' },
  { to: '/news', label: '소식' },
  { to: '/donate', label: '후원안내' },
  { to: '/contact', label: '문의하기' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="container">
          <NavLink to="/admin/login">관리자</NavLink>
        </div>
      </div>
      <div className="container main-nav">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" />
          글로벌호프
        </NavLink>

        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <NavLink to="/donate" className="btn btn-primary btn-sm">
            후원하기
          </NavLink>
          <button className="nav-toggle" onClick={() => setOpen((v) => !v)} aria-label="메뉴 열기">
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
