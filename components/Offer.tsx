'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Bot, MessageCircleHeart } from 'lucide-react';
import type { Variants } from 'framer-motion';

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl h-72 w-full" />
);

const Offer = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        const json = await res.json();
        setBlogs(json.blogs.slice(0, 3));
      } catch (e) {
        console.error('Error fetching blogs:', e);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="w-full px-6 py-16 bg-gradient-to-b from-[#f8f5f0] to-[#e9dfd0] dark:from-[#1f1b16] dark:to-[#15120e]">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Support When You Need It — Your Way
        </h2>
        <p className="text-gray-600 dark:text-gray-200">
          Whether you&apos;re looking for expert guidance or a community that listens, we&apos;re here for you.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {loading
          ? [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
          : blogs.map((blog, i) => (
              <motion.div
                key={blog.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <Link href={`/blogs/${blog.slug}`}>
                  {/* {blog.coverImage && (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                  )} */}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-3">
                      {blog.description}
                    </p>
                    <div className="mt-4 flex items-center text-pink-500 hover:underline">
                      <span>Read more</span>
                      <ArrowRight className="ml-1" size={18} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>

      {/* Two CTA Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Community Chat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-xl text-center"
        >
          <div className="flex flex-col items-center space-y-6">
            <MessageCircleHeart className="w-12 h-12" />
            <h3 className="text-3xl font-bold">Join the Conversation</h3>
            <p className="text-lg">
              Dive into our community chat and connect with people who care.
            </p>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 hover:-translate-y-0.5 active:scale-95 transition"
            >
              Join Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>

        {/* AI Therapist */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl text-center"
        >
          <div className="flex flex-col items-center space-y-6">
            <Bot className="w-12 h-12" />
            <h3 className="text-3xl font-bold">Talk to Our AI Therapist</h3>
            <p className="text-lg max-w-xl text-white/90">
              Our AI-powered therapist is available 24/7 to listen and guide you.
            </p>
            <Link
              href="/talk/chat"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 hover:-translate-y-0.5 active:scale-95 transition"
            >
              Start Talking
              <Bot className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Offer;
