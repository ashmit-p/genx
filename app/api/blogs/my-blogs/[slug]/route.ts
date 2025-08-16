import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const blogsSnapshot = await adminDb
      .collection('blogs')
      .where('written_by', '==', slug)
      .orderBy('created_at', 'desc')
      .get();

    const blogs = blogsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate()?.toISOString() || null,
    }));

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
