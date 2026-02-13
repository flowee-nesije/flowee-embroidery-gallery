import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Generate a random code like "BIRD-7X9K-2024"
function generateCode(): string {
  const prefixes = ['GIFT', 'WIN', 'PRIZE', 'LUCKY', 'STREAM']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars
  let middle = ''
  for (let i = 0; i < 4; i++) {
    middle += chars[Math.floor(Math.random() * chars.length)]
  }
  const suffix = new Date().getFullYear().toString().slice(-2) + 
                 (Math.floor(Math.random() * 90) + 10).toString()
  return `${prefix}-${middle}-${suffix}`
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin auth
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { description, expiresIn } = body // expiresIn in hours

    // Generate unique code
    let code = generateCode()
    let attempts = 0
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('redemption_codes')
        .select('code')
        .eq('code', code)
        .single()
      
      if (!existing) break
      code = generateCode()
      attempts++
    }

    // Calculate expiration
    let expiresAt = null
    if (expiresIn) {
      expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString()
    }

    // Create the code
    const { data: newCode, error } = await supabase
      .from('redemption_codes')
      .insert({
        code,
        description: description || 'Stream giveaway prize',
        expires_at: expiresAt,
        is_used: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Code generation error:', error)
      return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 })
    }

    return NextResponse.json({ success: true, code: newCode })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin auth
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: codes, error } = await supabase
      .from('redemption_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch codes' }, { status: 500 })
    }

    return NextResponse.json({ codes })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
