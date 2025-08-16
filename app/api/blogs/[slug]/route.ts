import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    let userId: string | null = null;
    if (token) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
      } catch {
        // User not authenticated, continue without user info
      }
    }

    // Get blog by slug
    const blogsRef = adminDb.collection('blogs');
    const querySnapshot = await blogsRef.where('slug', '==', slug).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const blogDoc = querySnapshot.docs[0];
    const blog = { id: blogDoc.id, ...blogDoc.data() };

    let liked = false;
    if (userId) {
      const likeId = `${userId}_${blog.id}`;
      const likeDoc = await adminDb.collection('blog_likes').doc(likeId).get();
      liked = likeDoc.exists;
    }

    return NextResponse.json({ blog, liked });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
