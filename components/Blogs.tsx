'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import LikeButton from './LikeButton'
import useUser from '@/lib/hooks/useUser'

type Blog = {
  id: string
  slug: string
  title: string
  description: string
  created_at: string
  likes: number
}

export default function Blogs({ search }: { search: string }) {
  const [blogs, setBlogs] = useState<Blog[] | null>(null)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useUser()

   useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs?search=${encodeURIComponent(search)}`,{
          headers: {
          Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        const json = await res.json();
        setBlogs(json.blogs);
        setLikedIds(json.likedIds || [])
      } catch (e) {
        console.error('Error fetching blogs:', e);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [search, user?.accessToken]);


  // Likes are now fetched through the API route above, so we can remove the direct Supabase call


  return (
    <div className="max-w-7xl mx-auto p-6">
      {loading && (
        <div className="space-y-4 animate-pulse w-full flex justify-around flex-wrap">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 w-64 bg-zinc-800 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && blogs && blogs.length > 0 && (
        <ul className="space-y-6">
          {blogs.map(blog => (
            <li
              key={blog.slug}
              className="bg-white/10 w-full flex items-center justify-between shadow-md hover:shadow-xl transition-shadow duration-300 p-5 rounded-xl border border-orange-100"
            >
              <Link href={`/blogs/${blog.slug}`} className="block hover:text-pink-500 transition-all">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-300 mt-1">{blog.description}</p>
                <span className="text-sm text-zinc-400">
                  {new Date(blog.created_at).toLocaleDateString('en-GB')}
                </span>
              </Link>

              { user && <LikeButton
                blogId={blog.id}
                initialLiked={likedIds.includes(blog.id)}
              />}
            </li>
          ))}
        </ul>
      )}

      {!loading && blogs?.length === 0 && (
        <div className="text-center text-gray-500 mt-6">No blogs found.</div>
      )}
    </div>
  )
}
