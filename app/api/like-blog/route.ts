import { NextResponse } from 'next/server'
import { adminDb, adminAuth } from "@/lib/firebase-admin"
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    const userId = decodedToken.uid

    const { blogId } = await req.json()

    const likesRef = adminDb.collection('blog_likes')
    const querySnapshot = await likesRef
      .where('blog_id', '==', blogId)
      .where('user_id', '==', userId)
      .get()

    const blogRef = adminDb.collection('blogs').doc(blogId)

    if (!querySnapshot.empty) {
      const likeDoc = querySnapshot.docs[0]
      
      // Use a batch to ensure both operations succeed or fail together
      const batch = adminDb.batch()
      batch.delete(likeDoc.ref)
      batch.update(blogRef, {
        likes: FieldValue.increment(-1)
      })
      
      await batch.commit()
      return NextResponse.json({ liked: false })
    } else {
      const likeId = `${userId}_${blogId}`
      
      const batch = adminDb.batch()
      batch.set(likesRef.doc(likeId), {
        blog_id: blogId,
        user_id: userId,
        created_at: new Date().toISOString()
      })
      batch.update(blogRef, {
        likes: FieldValue.increment(1)
      })
      
      await batch.commit()
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Like/unlike error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
