'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

export interface OnboardingData {
  // Demographics
  age_range: string;
  gender: string;
  location_type: string;
  
  // Mental Health Background
  therapy_experience: string;
  current_support: string[];
  comfort_level: number;
  
  // Goals & Preferences
  primary_goals: string[];
  preferred_approach: string;
  communication_style: string;
  
  // Current Challenges
  main_challenges: string[];
  stress_level: number;
  
  // Platform Preferences
  preferred_features: string[];
  privacy_comfort: number;
  time_availability: string;
}

interface OnboardingQuestionnaireProps {
  onComplete: (data: OnboardingData) => void;
  loading?: boolean;
}

const OnboardingQuestionnaire: React.FC<OnboardingQuestionnaireProps> = ({ 
  onComplete, 
  loading = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});

  const updateFormData = (key: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const questions = [
    {
      title: "Let's get to know you better",
      subtitle: "This helps us personalize your experience",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              What&rsquo;s your age range?
            </label>
            <div className="space-y-2">
              {['18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'Prefer not to say'].map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="age_range"
                    value={option}
                    checked={formData.age_range === option}
                    onChange={(e) => updateFormData('age_range', e.target.value)}
                    className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              How do you identify?
            </label>
            <div className="space-y-2">
              {['Woman', 'Man', 'Non-binary', 'Other', 'Prefer not to say'].map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Your mental health journey",
      subtitle: "Understanding your background helps us support you better",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Have you tried therapy or counseling before?
            </label>
            <div className="space-y-2">
              {['Never', 'Once or twice', 'Several times', 'Currently in therapy', 'Regular therapy user'].map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="therapy_experience"
                    value={option}
                    checked={formData.therapy_experience === option}
                    onChange={(e) => updateFormData('therapy_experience', e.target.value)}
                    className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              How comfortable are you discussing personal topics?
            </label>
            <div className="flex justify-between items-center space-x-2 mt-4">
              {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name="comfort_level"
                    value={num}
                    checked={formData.comfort_level === num}
                    onChange={(e) => updateFormData('comfort_level', parseInt(e.target.value))}
                    className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500 mb-1"
                  />
                  <span className="text-xs text-slate-500">{num}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Very uncomfortable</span>
              <span>Very comfortable</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "What brings you here?",
      subtitle: "Let's understand your goals and preferences",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              What are your main goals? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[
                'Manage anxiety or stress',
                'Overcome depression', 
                'Improve relationships',
                'Build self-confidence',
                'Cope with life changes',
                'Develop coping strategies',
                'Just someone to talk to'
              ].map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(formData.primary_goals) && formData.primary_goals.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(formData.primary_goals) ? formData.primary_goals : [];
                      if (e.target.checked) {
                        updateFormData('primary_goals', [...currentValues, option]);
                      } else {
                        updateFormData('primary_goals', currentValues.filter(v => v !== option));
                      }
                    }}
                    className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Almost done!",
      subtitle: "Just a few more questions",
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Which features interest you most? (Select all that apply)
            </label>
            <div className="space-y-2">
              {[
                'AI Therapy Chat',
                'Community discussions',
                'Educational articles',
                'Self-help resources',
                'Progress tracking'
              ].map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(formData.preferred_features) && formData.preferred_features.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(formData.preferred_features) ? formData.preferred_features : [];
                      if (e.target.checked) {
                        updateFormData('preferred_features', [...currentValues, option]);
                      } else {
                        updateFormData('preferred_features', currentValues.filter(v => v !== option));
                      }
                    }}
                    className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              How important is privacy to you when seeking support?
            </label>
            <div className="flex justify-between items-center space-x-2 mt-4">
              {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name="privacy_comfort"
                    value={num}
                    checked={formData.privacy_comfort === num}
                    onChange={(e) => updateFormData('privacy_comfort', parseInt(e.target.value))}
                    className="w-4 h-4 text-rose-500 border-slate-300 focus:ring-rose-500 mb-1"
                  />
                  <span className="text-xs text-slate-500">{num}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Not important</span>
              <span>Extremely important</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Fill in default values for missing fields
      const completeData: OnboardingData = {
        age_range: formData.age_range || '',
        gender: formData.gender || '',
        location_type: formData.location_type || '',
        therapy_experience: formData.therapy_experience || '',
        current_support: formData.current_support || [],
        comfort_level: formData.comfort_level || 3,
        primary_goals: formData.primary_goals || [],
        preferred_approach: formData.preferred_approach || '',
        communication_style: formData.communication_style || '',
        main_challenges: formData.main_challenges || [],
        stress_level: formData.stress_level || 5,
        preferred_features: formData.preferred_features || [],
        privacy_comfort: formData.privacy_comfort || 3,
        time_availability: formData.time_availability || ''
      };
      onComplete(completeData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return formData.age_range && formData.gender;
      case 1:
        return formData.therapy_experience && formData.comfort_level;
      case 2:
        return formData.primary_goals && formData.primary_goals.length > 0;
      case 3:
        return formData.preferred_features && formData.preferred_features.length > 0 && formData.privacy_comfort;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-rose-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Step {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% complete</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-rose-400 to-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              {questions[currentStep].title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {questions[currentStep].subtitle}
            </p>
          </div>

          <div className="mb-8">
            {questions[currentStep].content}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepComplete() || loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-400 to-purple-400 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>Loading...</>
              ) : currentStep === questions.length - 1 ? (
                <>
                  Complete <Check size={16} />
                </>
              ) : (
                <>
                  Next <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;
