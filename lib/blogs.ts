import { db } from './firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

export async function getBlogs() {
  const blogsRef = collection(db, 'blogs');
  const q = query(blogsRef, orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
