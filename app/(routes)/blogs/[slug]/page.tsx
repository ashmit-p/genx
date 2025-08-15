import { notFound } from 'next/navigation'
import { markdownToSafeHTML } from '@/lib/markdown-to-text';
import { Separator } from '@radix-ui/react-separator';
// import ReactMarkdown from 'react-markdown'

async function getBlogBySlug(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${slug}`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch blog')
  }
  
  return res.json()
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  try {
    const { blog } = await getBlogBySlug(params.slug)
    
    if (!blog) return notFound()
    
    const contentHtml = await markdownToSafeHTML(blog.content)

    return (
      <div className="bg-gradient-to-b from-[#1e2e28] to-[#2f4f4f] min-h-screen text-white">
        <div className="max-w-3xl mx-auto p-6 pt-32">
          <div>
            <h1 className="text-4xl !font-semibold mb-2 montserrat-one">{blog.title}</h1>
            <p className="text-gray-300 mb-6 alumni-sans-pinstripe-regular-italic">{blog.description}</p>
            <div className='w-full flex justify-between items-center'>
              <p className="text-gray-400  alumni-sans-pinstripe-regular-italic">Written by : {blog.written_by} </p>
              <p className="text-gray-400 alumni-sans-pinstripe-regular-italic ">
                {new Date(blog.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Separator 
              orientation="horizontal"
              className="my-6 h-px w-full bg-gray-600"
            />
            <div className="max-w-none">
              <div
                className="[&_h2]:italic space-y-4 [&_h2]:text-3xl [&_h2]:font-light [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-sm [&_p]:text-sm [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          </div>
          {blog.iframe_link && (
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg mt-12">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                src={blog.iframe_link}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching blog:', error)
    return notFound()
  }
}
