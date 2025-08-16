import { NextResponse } from 'next/server'
import { adminDb, adminAuth } from "@/lib/firebase-admin"

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

    // Check if user already liked this blog
    const likesRef = adminDb.collection('blog_likes')
    const querySnapshot = await likesRef
      .where('blog_id', '==', blogId)
      .where('user_id', '==', userId)
      .get()

    if (!querySnapshot.empty) {
      // Unlike: delete the like document
      const likeDoc = querySnapshot.docs[0]
      await likeDoc.ref.delete()
      return NextResponse.json({ liked: false })
    } else {
      // Like: create a new like document
      const likeId = `${userId}_${blogId}`
      await likesRef.doc(likeId).set({
        blog_id: blogId,
        user_id: userId,
        created_at: new Date().toISOString()
      })
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Like/unlike error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
