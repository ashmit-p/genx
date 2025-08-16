/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get('__session')?.value
    
    let token: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // removing bearer prefix dont forget
      token = authHeader.substring(7) 
    } else if (cookieToken) {
      token = cookieToken
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 })
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    
    const roomsSnapshot = await adminDb
      .collection('chat_rooms')
      .orderBy('created_at', 'asc')
      .get()

    const rooms = roomsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate()?.toISOString() || new Date().toISOString(),
    }))

    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('Error fetching chat rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat rooms' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()
    
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 })
    }

    const authHeader = req.headers.get('Authorization')
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get('__session')?.value
    
    let token: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7) 
    //   removing bearer prefix again
    } else if (cookieToken) {
      token = cookieToken
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 })
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    
    const userRecord = await adminAuth.getUser(decodedToken.uid)
    
    const roomData = {
      name: name.trim(),
      created_by: decodedToken.uid,
      created_by_name: userRecord.displayName || userRecord.email || 'Anonymous',
      created_at: new Date(),
      last_message: null,
      last_message_at: null,
    }

    const docRef = await adminDb.collection('chat_rooms').add(roomData)
    
    return NextResponse.json({ 
      id: docRef.id,
      ...roomData,
      created_at: roomData.created_at.toISOString()
    })
  } catch (error) {
    console.error('Error creating chat room:', error)
    return NextResponse.json(
      { error: 'Failed to create chat room' },
      { status: 500 }
    )
  }
}
