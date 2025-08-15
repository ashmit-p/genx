// 'use client'
import SubmitBlogForm from '@/components/SubmitBlogForm'
// import useUser from '@/lib/hooks/useUser'

export default function SubmitBlogPage() {
  // const { user } = useUser() 

  // if (!user) {
  //   return <div className="text-center text-red-500">Please log in to submit a blog.</div>
  // }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24 ">
      <h1 className="text-2xl font-bold mb-4">Submit a Blog</h1>
      <SubmitBlogForm 
      // userId={user.id} 
      />
    </div>
  )
}
