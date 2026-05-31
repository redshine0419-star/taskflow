import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const tfAuth = cookieStore.get('tf_auth')

  if (!tfAuth) {
    return Response.json({ error: 'No session' }, { status: 401 })
  }

  let payload
  try {
    payload = JSON.parse(decodeURIComponent(tfAuth.value))
  } catch {
    return Response.json({ error: 'Invalid session' }, { status: 400 })
  }

  // Clear the cookie after reading
  const res = Response.json(payload)
  res.headers.set('Set-Cookie', 'tf_auth=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0')
  return res
}
