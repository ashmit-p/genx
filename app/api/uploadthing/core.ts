import { createUploadthing, type FileRouter } from 'uploadthing/server'
import { cookies } from 'next/headers'
import { adminAuth } from '@/lib/firebase-admin'

const f = createUploadthing()

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => {
      const cookieStore = await cookies(); 
      
      // Get Firebase auth token from cookies and verify
      const authToken = cookieStore.get('__session')?.value;
      
      if (!authToken) {
        throw new Error('Unauthorized: No auth token');
      }

      try {
        // Verify Firebase token using Admin SDK
        const decodedToken = await adminAuth.verifyIdToken(authToken);
        return { userId: decodedToken.uid };
      } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Unauthorized: Invalid token');
      }
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log('Upload complete:', file.url, 'by user:', metadata.userId);

     const res = await fetch(new URL('/api/avatar', process.env.NEXT_PUBLIC_SITE_URL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
          userId: metadata.userId,
          avatarUrl: file.url
        }),
      });

      if (!res.ok) {
        console.error('Failed to update avatar', await res.text());
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
