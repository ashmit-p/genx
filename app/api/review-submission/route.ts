// app/api/review-submission/route.ts
import { NextResponse } from 'next/server';

// TODO: Import Firebase Admin SDK
// import { initializeApp, cert } from 'firebase-admin/app';
// import { getFirestore } from 'firebase-admin/firestore';

export async function POST(req: Request) {
  const { id, approved, reviewerId } = await req.json();

  console.log('🧪 Review request received:', { id, approved, reviewerId });

  try {
    // TODO: Initialize Firebase Admin SDK with your service account credentials
    // const db = getFirestore();
    
    // Update blog submission status
    // const submissionRef = db.collection('blog_submissions').doc(id);
    // await submissionRef.update({
    //   status: approved ? 'approved' : 'rejected',
    //   reviewed_at: new Date().toISOString(),
    //   reviewed_by: reviewerId,
    // });

    if (approved) {
      // Get submission data for blog creation
      // const submissionDoc = await submissionRef.get();
      // const submissionData = submissionDoc.data();
      
      // if (submissionData) {
      //   const { title, content, slug, username, user_id } = submissionData;
      //   
      //   // Insert into blogs collection
      //   await db.collection('blogs').add({
      //     title,
      //     content,
      //     user_id,
      //     slug,
      //     written_by: username,
      //     created_at: new Date().toISOString(),
      //   });
      // }
    }

    // TODO: Remove this return statement once Firebase is configured
    return NextResponse.json({ success: false, error: 'Firebase not configured yet' });

    // return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error in review submission:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' });
  }
}
