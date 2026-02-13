import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Design {
  id: string
  name: string
  description: string
  image_url: string
  category: string
  available_sizes: string[]
  available_textiles: string[]
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  design_id: string
  design_name: string
  twitch_username: string
  email: string
  textile_type: string
  size: string
  redemption_code: string | null
  status: 'pending' | 'confirmed' | 'completed'
  created_at: string
}

export interface RedemptionCode {
  id: string
  code: string
  description: string
  is_used: boolean
  used_by: string | null
  expires_at: string | null
  created_at: string
}

// Helper function for real-time subscriptions (for stream overlay)
export function subscribeToOrders(callback: (order: Order) => void) {
  return supabase
    .channel('orders')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        callback(payload.new as Order)
      }
    )
    .subscribe()
}
