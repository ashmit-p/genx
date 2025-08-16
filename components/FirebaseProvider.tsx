// components/FirebaseProvider.tsx
'use client'

import { createContext, useContext } from 'react'
import { auth } from '@/lib/firebase'
import { Auth } from 'firebase/auth'

const FirebaseContext = createContext<{ auth: Auth } | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseContext.Provider value={{ auth }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
