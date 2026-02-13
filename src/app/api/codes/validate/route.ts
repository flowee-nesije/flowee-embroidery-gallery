import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'No code provided' },
        { status: 400 }
      )
    }

    const { data: codeData, error } = await supabase
      .from('redemption_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (error || !codeData) {
      return NextResponse.json({ valid: false })
    }

    if (codeData.is_used) {
      return NextResponse.json({ valid: false, used: true })
    }

    // Check expiration
    if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, expired: true })
    }

    return NextResponse.json({
      valid: true,
      description: codeData.description,
    })
  } catch {
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
