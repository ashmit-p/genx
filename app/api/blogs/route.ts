import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.trim() || '';

  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    let userId: string | null = null;
    if (token) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
      } catch {
        // continue w/o user info
      }
    }

    // Get blogs 
    const blogsRef = adminDb.collection('blogs');
    const query = blogsRef.orderBy('likes', 'desc').orderBy('created_at', 'desc');

    const snapshot = await query.get();
    
    let blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{
      id: string;
      title?: string;
      description?: string;
      likes?: number;
      created_at?: string;
      slug?: string;
      content?: string;
      user_id?: string;
    }>;

    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      blogs = blogs.filter(blog => 
        blog.title?.toLowerCase().includes(searchLower) ||
        blog.description?.toLowerCase().includes(searchLower)
      );
    }

    // Get liked blog IDs for the user
    let likedIds: string[] = [];
    if (userId) {
      const likesSnapshot = await adminDb.collection('blog_likes')
        .where('user_id', '==', userId)
        .get();
      
      likedIds = likesSnapshot.docs.map(doc => doc.data().blog_id);
    }

    return NextResponse.json({ blogs, likedIds });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ blogs: [], likedIds: [], error: 'Internal server error' }, { status: 500 });
  }
}
