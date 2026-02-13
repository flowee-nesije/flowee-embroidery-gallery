import { NextResponse } from 'next/server'
import { getTwitchAuthUrl } from '@/lib/twitch'

export async function GET() {
  const authUrl = getTwitchAuthUrl()
  return NextResponse.redirect(authUrl)
}
