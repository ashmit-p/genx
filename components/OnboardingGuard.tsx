'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUser from '@/lib/hooks/useUser';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface OnboardingGuardProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean; // true means onboarding must be complete to access
}

export default function OnboardingGuard({ 
  children, 
  requiresOnboarding = true 
}: OnboardingGuardProps) {
  const { user, loading: userLoading } = useUser();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = doc(db, 'users', user.id);
        const userSnap = await getDoc(userDoc);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const hasOnboardingData = !!userData.onboarding_data;
          setOnboardingComplete(hasOnboardingData);
          
          // Redirect logic
          if (requiresOnboarding && !hasOnboardingData) {
            router.push('/onboarding');
          } else if (!requiresOnboarding && hasOnboardingData) {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user) {
      checkOnboardingStatus();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, router, requiresOnboarding]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-rose-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // For pages that require onboarding to be complete, don't render if it's not
  if (requiresOnboarding && onboardingComplete === false) {
    return null;
  }

  // For onboarding page itself, don't render if already complete
  if (!requiresOnboarding && onboardingComplete === true) {
    return null;
  }

  return <>{children}</>;
}
