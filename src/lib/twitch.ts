// Twitch OAuth configuration
export const TWITCH_CLIENT_ID = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!
export const TWITCH_REDIRECT_URI = process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'

export function getTwitchAuthUrl() {
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    redirect_uri: TWITCH_REDIRECT_URI,
    response_type: 'code',
    scope: 'user:read:email',
  })
  
  return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
}

export interface TwitchUser {
  id: string
  login: string
  display_name: string
  email?: string
  profile_image_url: string
}

export async function getTwitchUser(accessToken: string): Promise<TwitchUser | null> {
  try {
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
      },
    })
    
    if (!response.ok) return null
    
    const data = await response.json()
    return data.data[0] || null
  } catch {
    return null
  }
}
