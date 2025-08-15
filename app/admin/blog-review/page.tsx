  'use client';

  import { useEffect, useState } from 'react';
  import BlogReviewCard from '@/components/BlogReviewCard';
  import type { BlogSubmission } from '@/lib/blogSubmission';
  import { getPendingBlogSubmissions  } from '@/lib/blogSubmission';
  import { DockDemo } from '@/components/Dock';
  import useUser from '@/lib/hooks/useUser';

  export default function BlogReviewDashboard() {
    const { user } = useUser(); 

    const [submissions, setSubmissions] = useState<BlogSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      getPendingBlogSubmissions()
        .then((data) => {
          setSubmissions(data || []);
        })
        .catch((error) => {
          console.error('❌ Failed to fetch submissions:', error);
        })
        .finally(() => setLoading(false));
    }, []);


    const handleDecision = async (id: string, approved: boolean) => {
      try {
        const res = await fetch('/api/review-submission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, approved, reviewerId: user?.id }),
        });

        const result = await res.json();

        if (!result.success) {
          console.error('❌ API error:', result.error);
          return;
        }

        setSubmissions((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Error updating blog submission:', error);
      }
    };


    if (loading) return <p className="p-4">Loading...</p>;

    return (
      <div className='min-h-screen relative bg-gradient-to-b from-[#1e2e28] to-[#2f4f4f]'>
        <DockDemo />
        <div className="p-6 max-w-8xl mx-auto pt-24">
          <h1 className="text-2xl font-bold mb-6 text-white funnel-display-one ">Blog Submissions for Review</h1>
          <div className='flex flex-wrap gap-4'>
            {submissions.length === 0 ? (
              <p>No pending submissions.</p>
            ) : (
              submissions.map((submission) => (
                // <Link
                // href={`/admin/blog-review/${submission.slug}`}
                // className='cursor-pointer'
                // >
                  <BlogReviewCard
                    key={submission.id}
                    id={submission.id}
                    title={submission.title}
                    content={submission.content}
                    userName={submission.username || 'Unknown'}
                    onApprove={() => handleDecision(submission.id, true)}
                    onReject={() => handleDecision(submission.id, false)}
                    slug={submission.slug}
                  />
                // </Link>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }
