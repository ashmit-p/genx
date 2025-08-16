import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  const { userId, avatarUrl } = await req.json()

  if (!userId || !avatarUrl) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  }

  try {
    await adminDb.collection('users').doc(userId).update({
      avatar_url: avatarUrl
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update avatar:', error)
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 })
  }
}
