'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingQuestionnaire, { OnboardingData } from '@/components/OnboardingQuestionnaire';
import useUser from '@/lib/hooks/useUser';
import ProtectedRoute from '@/components/ProtectedRoute';

import OnboardingGuard from '@/components/OnboardingGuard';

import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user?.accessToken) return;

    setSaving(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success('Profile completed successfully!');
        router.push('/onboarding/complete');
      } else {
        console.error('Failed to save onboarding data');
        toast.error('Failed to save your responses. Please try again.');
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-rose-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <OnboardingGuard requiresOnboarding={false}>
        <OnboardingQuestionnaire 
          onComplete={handleOnboardingComplete}
          loading={saving}
        />
      </OnboardingGuard>
    </ProtectedRoute>
  );
}
