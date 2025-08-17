'use client';

import React, { useMemo } from 'react';
import { ArrowRight, MessageCircle, Users, BookOpen, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

const navigationCards = [
  {
    title: "Couples Therapy",
    description: "Relationships can be complex, beautiful and challenging. They bring us joy, worry, excitement, and pain.",
    iconType: 'message',
    route: "/blogs/couples",
    bgColor: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
    iconColors: "from-pink-400 to-rose-500"
  },
  {
    title: "AI Therapist",
    description: "In every relationship, its history matters: what marked the connection, but also the disconnection.",
    iconType: 'message',
    route: "/chat",
    bgColor: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20",
    iconColors: "from-purple-400 to-indigo-500"
  },
  {
    title: "Community Chat", 
    description: "We invite you to our center, where we specialize in couples psychotherapy. We have specialized in working with...",
    iconType: 'users',
    route: "/community",
    bgColor: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    iconColors: "from-blue-400 to-cyan-500"
  },
  {
    title: "All Blogs",
    description: "Explore our comprehensive collection of mental health resources, tips, and professional insights.",
    iconType: 'book',
    route: "/blogs",
    bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    iconColors: "from-emerald-400 to-teal-500"
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const IconComponent = React.memo(({ type, colors }: { type: string, colors: string }) => {
  const IconElement = useMemo(() => {
    switch (type) {
      case 'message': return MessageCircle;
      case 'users': return Users;
      case 'book': return BookOpen;
      default: return MessageCircle;
    }
  }, [type]);

  return (
    <div className={`w-16 h-16 bg-gradient-to-br ${colors} rounded-full flex items-center justify-center`}>
      <IconElement className="w-8 h-8 text-white" />
    </div>
  );
});

IconComponent.displayName = 'IconComponent';

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen bg-[#406047]">
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-16 pt-32">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold montserrat-one text-slate-800 dark:text-white leading-tight">
            You{' '}
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-bold">
              deserve
            </span>{' '}
            to be happy
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 montserrat-one font-light">
            What are you looking for?
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-300 to-purple-300 mx-auto rounded-full"></div>
        </motion.div>

        {/* Navigation Cards */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {navigationCards.map((card, i) => (
            <motion.div
              key={card.route}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group"
            >
              <Link
                href={card.route}
                className={`block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 h-[320px] bg-gradient-to-br ${card.bgColor} backdrop-blur-sm border border-white/20 p-6 will-change-transform`}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <IconComponent type={card.iconType} colors={card.iconColors} />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-white">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 flex-grow">
                    {card.description}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Explore
                    </span>
                    <ArrowRight
                      size={20}
                      className="text-slate-600 dark:text-slate-400 group-hover:translate-x-2 group-hover:text-rose-500 transition-transform duration-200"
                    />
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-rose-200/50 dark:group-hover:border-purple-400/50 transition-colors duration-200"></div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-12"
        >
          <Link
            href="/profile"
            className="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 border border-white/20 group will-change-transform"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">View Profile</span>
            <ArrowRight size={16} className="text-slate-600 dark:text-slate-400 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;