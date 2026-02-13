import { NextRequest, NextResponse } from 'next/server'
import { TWITCH_CLIENT_ID, TWITCH_REDIRECT_URI, getTwitchUser } from '@/lib/twitch'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: TWITCH_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info
    const user = await getTwitchUser(accessToken)
    if (!user) {
      throw new Error('Failed to get user info')
    }

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/', request.url))

    // Store user info in a cookie (simplified - you'd want proper session management)
    response.cookies.set('twitch_user', JSON.stringify({
      id: user.id,
      login: user.login,
      display_name: user.display_name,
      email: user.email,
      profile_image_url: user.profile_image_url,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return response
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }
}
