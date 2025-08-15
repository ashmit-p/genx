import { getBlogSubmissionBySlug } from '@/lib/blogSubmission';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ReviewPage({ params }: PageProps) {

  const submission = await getBlogSubmissionBySlug(params.slug);
  // console.log("SLUG", params.slug);
  

  if (!submission) {
    return <div className="p-6">Submission not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{submission.title}</h1>
      <p className="text-sm text-gray-500 mb-4">Submitted by: {submission.username}</p>
      <div className="prose max-w-none">
        <article dangerouslySetInnerHTML={{ __html: submission.content }} />
      </div>
    </div>
  );
}
