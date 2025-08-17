import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import slugify from 'slugify';

export async function POST(req: Request) {
  const { title, content, desc } = await req.json();
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDoc = await adminDb.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const username = userData?.username;

    if (!username) {
      return NextResponse.json({ error: 'Username not found' }, { status: 404 });
    }

    let slug = slugify(title, { lower: true, strict: true });

    const submissionsRef = adminDb.collection('blog_submissions');
    const existingSubmission = await submissionsRef.where('slug', '==', slug).get();

    if (!existingSubmission.empty) {
      const timestamp = Date.now().toString().slice(-5);
      slug = `${slug}-${timestamp}`;
    }

    // Create blog submission
    await submissionsRef.add({
      user_id: userId,
      username: username,
      title,
      content,
      description: desc,
      slug,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Blog submission error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
