import { db } from './firebase';
import { collection, getDocs, query, where, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import TurndownService from 'turndown';
import slugify from 'slugify';

export type BlogSubmission = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  submitted_at: string;
  username: string;
  slug: string;
  description: string;
};

const turndownService = new TurndownService();

export async function getPendingBlogSubmissions() {
  const submissionsRef = collection(db, 'blog_submissions');
  const q = query(submissionsRef, where('status', '==', 'pending'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateBlogSubmissionStatus(params: { id: string; approved: boolean; reviewerId: string; }) {
  const { id, approved, reviewerId } = params;
  console.log('🔍 Starting blog submission update...');

  const submissionRef = doc(db, 'blog_submissions', id);
  if (!approved) {
    console.log('🟥 Submission is being rejected...');
    await updateDoc(submissionRef, {
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    });
    console.log('✅ Rejected successfully.');
    return;
  }

  console.log('🟩 Submission is being approved...');
  const submissionSnap = await getDoc(submissionRef);
  if (!submissionSnap.exists()) {
    throw new Error('Submission not found');
  }
  const submission = submissionSnap.data();
  const markdownContent = turndownService.turndown(submission.content);
  const slug = submission.slug || slugify(submission.title, { lower: true, strict: true });
  const blogRef = doc(collection(db, 'blogs'));
  await setDoc(blogRef, {
    title: submission.title,
    slug,
    content: markdownContent,
    written_by: submission.username,
    created_at: new Date().toISOString(),
    description: submission.description,
  });
  await updateDoc(submissionRef, {
    status: 'approved',
    reviewed_at: new Date().toISOString(),
    reviewed_by: reviewerId,
  });
}
