import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { userId, avatarUrl } = await req.json()

  if (!userId || !avatarUrl) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
