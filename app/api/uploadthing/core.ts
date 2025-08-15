import { createUploadthing, type FileRouter } from 'uploadthing/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const f = createUploadthing()

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => {
      const cookieStore = await cookies(); 
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => cookieStore.getAll(), 
          },
        }
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Unauthorized');
      return { userId: user.id };
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
          // avatarUrl: file.ufsUrl, 
          avatarUrl: file.ufsUrl.replace(/https:\/\/[^.]+\.utfs\.io/, 'https://utfs.io')
        }),
      });

      if (!res.ok) {
        console.error('Failed to update avatar', await res.text());
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
