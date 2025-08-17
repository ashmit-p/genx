'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Coffee } from 'lucide-react';

export type PersonalityType = 'Supportive Therapist' | 'Practical Coach' | 'Friendly Companion';

interface PersonalitySelectorProps {
  selectedPersonality: PersonalityType;
  onPersonalityChange: (personality: PersonalityType) => void;
  recommendedBot?: PersonalityType | null;
}

const personalities = {
  supportive: {
    name: "Supportive Therapist",
    description: "Gentle, encouraging, focused on emotional support",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    bgColor: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20"
  },
  practical: {
    name: "Practical Coach", 
    description: "Solution-oriented, gives actionable steps",
    icon: Target,
    color: "from-blue-400 to-indigo-500",
    bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
  },
  friendly: {
    name: "Friendly Companion",
    description: "Casual, empathetic, like a supportive friend",
    icon: Coffee,
    color: "from-emerald-400 to-teal-500", 
    bgColor: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
  }
};

const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  selectedPersonality,
  onPersonalityChange,
  recommendedBot
}) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Choose Your AI Therapist Style
        </h3>
        {recommendedBot && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Based on your preferences, we&rsquo;ve highlighted a recommended option
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(personalities).map(([key, personality]) => {
          const IconComponent = personality.icon;
          const isSelected = selectedPersonality === key;
          const isRecommended = recommendedBot === key;
          
          return (
            <motion.button
              key={key}
              onClick={() => onPersonalityChange(key as PersonalityType)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left relative ${
                isSelected 
                  ? 'border-rose-300 dark:border-purple-400 shadow-md' 
                  : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'
              } bg-gradient-to-br ${personality.bgColor}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Recommended Badge */}
              {isRecommended && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                  Recommended
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${personality.color} flex-shrink-0`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm mb-1 ${
                    isSelected 
                      ? 'text-slate-900 dark:text-white' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {personality.name}
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    isSelected 
                      ? 'text-slate-600 dark:text-slate-400' 
                      : 'text-slate-500 dark:text-slate-500'
                  }`}>
                    {personality.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalitySelector;
