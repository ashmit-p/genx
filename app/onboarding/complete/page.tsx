'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingComplete() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-rose-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check size={40} className="text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-slate-800 dark:text-white mb-4"
        >
          Welcome to GenX!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed"
        >
          Thank you for completing your profile! We&rsquo;ve personalized your experience based on your responses. You&rsquo;re all set to start your mental wellness journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-rose-500" size={20} />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              What&rsquo;s next?
            </span>
          </div>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 text-left">
            <li>• Start a conversation with our AI therapy assistant</li>
            <li>• Join community discussions for peer support</li>
            <li>• Explore our mental health resources and articles</li>
            <li>• Track your progress and mood over time</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-3"
        >
          <Link
            href="/chat"
            className="block w-full px-6 py-3 bg-gradient-to-r from-rose-400 to-purple-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
          >
            Start Your First Chat
          </Link>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200"
          >
            Explore the Platform
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-xs text-slate-500 mt-4"
        >
          You&rsquo;ll be automatically redirected to the main page in a few seconds...
        </motion.p>
      </motion.div>
    </div>
  );
}
