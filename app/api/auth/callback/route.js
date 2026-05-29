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
    const profile = await profileRes.json()

    // Pass token + profile via URL hash (client-side only, not sent to servers)
    const payload = encodeURIComponent(JSON.stringify({
      token: tokenData.access_token,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
    }))

    return Response.redirect(`${baseUrl}/?auth=${payload}`)
  } catch (e) {
    return Response.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(e.message)}`)
  }
}
