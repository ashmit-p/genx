import Blogs from '@/components/Blogs';
import SearchBlogs from '@/components/SearchBlogs';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

export default async function BlogList({ searchParams }: { searchParams: { search?: string } }) {
  const search = searchParams.search ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e2e28] to-[#2f4f4f] text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 pb-16 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white montserrat-one">
            Read up!
          </h1>
          <SearchBlogs initialSearch={search} />
        </div>

        <Blogs search={search} />

        <Link
          href="/blogs/submit"
          className="fixed bottom-6 right-6 z-50 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-4 shadow-xl hover:scale-105 transition"
          aria-label="Write a new blog"
        >
          <Pencil size={20} />
        </Link>
      </div>
    </div>
  );
}
