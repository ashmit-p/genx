/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('roomId')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const lastMessageId = searchParams.get('lastMessageId') // For cursor-based pagination
    const lastTimestamp = searchParams.get('lastTimestamp') // For cursor-based pagination

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    const authHeader = req.headers.get('Authorization')
    
    let token: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7) 
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 })
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    
    const isAIChat = roomId.startsWith('ai-')
    const table = isAIChat ? 'ai_messages' : 'chat_messages'
    
    if (isAIChat) {
      const expectedRoomId = `ai-${decodedToken.uid}`
      if (roomId !== expectedRoomId) {
        return NextResponse.json({ error: 'Access denied to this AI chat' }, { status: 403 })
      }
    }

    // Build query based on whether this is the first load or pagination
    
    if (lastTimestamp && lastMessageId) {
      // For pagination, get messages older than the last message
      // We'll fetch all messages where room_id matches, then filter and sort in memory
      // This avoids the composite index requirement
      const allMessagesSnapshot = await adminDb
        .collection(table)
        .where('room_id', '==', roomId)
        .get()

      const allData = allMessagesSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))

      // Sort by timestamp descending and filter messages older than lastTimestamp
      const sortedData = allData.sort((a: any, b: any) => {
        const aTime = a.inserted_at?.toDate?.() || new Date(a.inserted_at || 0)
        const bTime = b.inserted_at?.toDate?.() || new Date(b.inserted_at || 0)
        return bTime.getTime() - aTime.getTime()
      })

      // Find the index of the last message and get the next batch
      const lastIndex = sortedData.findIndex((msg: any) => msg.id === lastMessageId)
      const startIndex = lastIndex > -1 ? lastIndex + 1 : 0
      const data = sortedData.slice(startIndex, startIndex + pageSize)

      const hasMore = startIndex + pageSize < sortedData.length

      const normalized = data.map((msg: any) => ({
        id: msg.id,
        user_id: msg.user_id,
        username: isAIChat ? (msg.role === 'assistant' ? 'TherapistBot' : 'You') : msg.username,
        content: msg.content,
        avatar_url: msg.avatar_url ?? undefined,
        inserted_at: msg.inserted_at?.toDate?.() ? msg.inserted_at.toDate().toISOString() : msg.inserted_at,
      }))

      return NextResponse.json({ 
        messages: normalized.reverse(), // Return in chronological order
        hasMore,
        lastMessageId: data.length > 0 ? data[data.length - 1].id : null,
        lastTimestamp: data.length > 0 ? (data[data.length - 1] as any).inserted_at : null
      })
    } else {
      // Initial load - get the most recent messages
      const messagesSnapshot = await adminDb
        .collection(table)
        .where('room_id', '==', roomId)
        .get()

      const allData = messagesSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))

      // Sort by timestamp descending and take the most recent messages
      const sortedData = allData.sort((a: any, b: any) => {
        const aTime = a.inserted_at?.toDate?.() || new Date(a.inserted_at || 0)
        const bTime = b.inserted_at?.toDate?.() || new Date(b.inserted_at || 0)
        return bTime.getTime() - aTime.getTime()
      })

      const data = sortedData.slice(0, pageSize)
      const hasMore = sortedData.length > pageSize

      const normalized = data.map((msg: any) => ({
        id: msg.id,
        user_id: msg.user_id,
        username: isAIChat ? (msg.role === 'assistant' ? 'TherapistBot' : 'You') : msg.username,
        content: msg.content,
        avatar_url: msg.avatar_url ?? undefined,
        inserted_at: msg.inserted_at?.toDate?.() ? msg.inserted_at.toDate().toISOString() : msg.inserted_at,
      }))

      return NextResponse.json({ 
        messages: normalized.reverse(), // Return in chronological order
        hasMore,
        lastMessageId: data.length > 0 ? data[data.length - 1].id : null,
        lastTimestamp: data.length > 0 ? (data[data.length - 1] as any).inserted_at : null
      })
    }
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}
