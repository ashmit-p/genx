import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    const authHeader = req.headers.get('Authorization')
    
    let token: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7) 
    //   remove bearer prefix
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 })
    }

    const roomDoc = await adminDb.collection('chat_rooms').doc(roomId).get()

    if (!roomDoc.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const roomData = {
      id: roomDoc.id,
      ...roomDoc.data(),
      created_at: roomDoc.data()?.created_at?.toDate()?.toISOString() || new Date().toISOString(),
    }

    return NextResponse.json({ room: roomData })
  } catch (error) {
    console.error('Error fetching chat room:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat room' },
      { status: 500 }
    )
  }
}
