/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import useUser from '@/lib/hooks/useUser';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';

type Blog = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function MyBlogsPage() {
  const { user } = useUser();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function handleDelete(id: string) {
  const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
  if (!confirmDelete) return;

  toast.promise(
    fetch(`/api/blogs/delete/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(d.error));
        return res.json();
      })
      .then(() => {
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      }),
    {
      loading: 'Deleting...',
      success: 'Blog deleted successfully!',
      error: (err) => err || 'Failed to delete blog',
    }
  );
}

  useEffect(() => {
    async function fetchBlogs() {
      if (!user?.id) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/my-blogs/${user.username}`);
        const data = await res.json();


        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch blogs');
        }

        setBlogs(data.blogs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, [user?.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 py-32">
      {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 */}
      {blogs.length === 0 ? (
        <div className="flex items-center justify-center h-[70vh] w-full">
          <p className="text-lg">Start sharing your thoughts...</p>
        </div>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="bg-white shadow-md rounded-lg p-4 border">
            <h2 className="text-xl font-bold">{blog.title}</h2>
            <p className="text-gray-600 mt-2 line-clamp-3">{blog.content}</p>
            <div className="w-full flex justify-between items-center">
              <p className="text-xs text-gray-400 mt-4">
                Posted on {new Date(blog.created_at).toLocaleDateString()}
              </p>
              <button className='cursor-pointer' onClick={() => handleDelete(blog.id)}>
                <Trash size={20} className='mt-4'/>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
