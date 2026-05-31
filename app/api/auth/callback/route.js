export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  if (error || !code) {
    return Response.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(error || 'missing_code')}`)
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${baseUrl}/api/auth/callback`,
      }),
    })

    const tokenData = await tokenRes.json()
    if (tokenData.error) {
      return Response.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(tokenData.error_description || tokenData.error)}`)
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    if (!profileRes.ok) {
      return Response.redirect(`${baseUrl}/?auth_error=profile_fetch_failed`)
    }
    const profile = await profileRes.json()

    // Store token + profile in a short-lived HttpOnly session cookie
    const payload = JSON.stringify({
      token: tokenData.access_token,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
    })

    const redirectResponse = Response.redirect(`${baseUrl}/?auth_pending=1`)
    redirectResponse.headers.set(
      'Set-Cookie',
      `tf_auth=${encodeURIComponent(payload)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=300`
    )
    return redirectResponse
  } catch (e) {
    return Response.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(e.message)}`)
  }
}
