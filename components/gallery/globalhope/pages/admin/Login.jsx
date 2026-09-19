'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GH_BASE } from '../../nav.jsx'
import { api, getToken, setToken } from '../../api.js'

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [alreadyIn, setAlreadyIn] = useState(false)

  useEffect(() => {
    if (getToken()) {
      setAlreadyIn(true)
      router.replace(`${GH_BASE}/admin`)
    }
  }, [router])

  if (alreadyIn) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await api.login(username, password)
      setToken(token)
      router.push(`${GH_BASE}/admin`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <h1>글로벌호프</h1>
        <p className="sub">관리자 로그인</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="username">아이디</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
          </div>
          <div className="form-row">
            <label htmlFor="password">비밀번호</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className="hint-box">
          관리자 계정: <strong>admin</strong> / <strong>admin1234</strong><br />
          (포트폴리오 데모 — 브라우저에만 저장되는 데모 모드로 동작합니다.)
        </div>
      </div>
    </div>
  )
}
