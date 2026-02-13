import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { designId, designName, twitchUsername, email, size, textile, redemptionCode } = body

    // Validate required fields
    if (!designId || !twitchUsername || !email || !size || !textile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If redemption code is provided, validate it
    if (redemptionCode) {
      const { data: codeData, error: codeError } = await supabase
        .from('redemption_codes')
        .select('*')
        .eq('code', redemptionCode.toUpperCase())
        .single()

      if (codeError || !codeData) {
        return NextResponse.json(
          { error: 'Invalid redemption code' },
          { status: 400 }
        )
      }

      if (codeData.is_used) {
        return NextResponse.json(
          { error: 'This code has already been used' },
          { status: 400 }
        )
      }

      // Check expiration
      if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
        return NextResponse.json(
          { error: 'This code has expired' },
          { status: 400 }
        )
      }

      // Mark code as used
      await supabase
        .from('redemption_codes')
        .update({ is_used: true, used_by: twitchUsername })
        .eq('id', codeData.id)
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        design_id: designId,
        design_name: designName,
        twitch_username: twitchUsername,
        email: email,
        size: size,
        textile_type: textile,
        redemption_code: redemptionCode || null,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: `Failed to create order: ${orderError.message}`, details: orderError },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin auth (simplified - you'd want proper auth here)
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
