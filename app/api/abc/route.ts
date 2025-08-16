import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { publicUrl } = body

    const cookieStore = await cookies()
    const token = cookieStore.get('__session')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    // Update user's avatar URL in Firestore
    await adminDb.collection('users').doc(userId).update({
      avatar_url: publicUrl,
      updated_at: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating avatar:', error)
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 })
  }
}
