'use client'

import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

type UserData = {
  id: string
  email: string
  username: string
  role: string
  avatar_url: string | null;
  accessToken?: string | undefined
  recommended_bot?: string | null;
}

export default function useUser() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const getUser = async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const userDoc = doc(db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userDoc)
      
      if (userSnap.exists()) {
        const profile = userSnap.data()
        setUser({
          id: firebaseUser.uid,
          role: profile.role || '',
          username: profile.username || '',
          email: firebaseUser.email || '',
          avatar_url: profile.avatar_url || '',
          recommended_bot: profile.recommended_bot,
          accessToken: await firebaseUser.getIdToken()
        })
      }
    } catch (error) {
      console.error('[useUser] Error fetching user profile:', error)
    }

    setLoading(false)
  }

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      getUser(firebaseUser)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { user, loading, refetch: () => getUser(getAuth().currentUser) }
}
