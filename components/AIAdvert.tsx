'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bot } from 'lucide-react';

const AIAdvert = () => {
  return (
    <section className="w-full px-6 py-16 space-y-12">
      {/* AI Therapist Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl text-center"
      >
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
          <Bot className="w-12 h-12 md:w-14 md:h-14 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Talk to Our AI Therapist
          </h2>
          <p className="text-lg max-w-xl text-white/90">
            Need a safe space to vent or get guidance? Our AI-powered therapist is
            available 24/7 to listen, reflect, and help you feel better.
          </p>
          <Link
            href="/talk/chat"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Start Talking
            <Bot className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>

      {/* Community Chat Section */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-xl text-center"
      >
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
          <Users className="w-12 h-12 md:w-14 md:h-14 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold">
            Join the Conversation
          </h2>
          <p className="text-lg max-w-xl text-white/90">
            Dive into our community chat and connect with people who care.
            Share, support, and grow—together.
          </p>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Join Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div> */}
    </section>
  );
};

export default AIAdvert;
