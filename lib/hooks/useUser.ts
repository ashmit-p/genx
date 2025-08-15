'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type UserData = {
  id: string
  email: string
  username: string
  role: string
  avatar_url: string | null;
  accessToken?: string | undefined
}

// export default function useUser() {
//   const [user, setUser] = useState<UserData | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const getUser = async () => {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession()

//       if (!session?.user) {
//         setUser(null)
//         setLoading(false)
//         return
//       }

//       const { data: authData, error: authError } = await supabase.auth.getUser()
//       const { data: profile, error: profileError } = await supabase
//         .from('users')
//         .select('id, role, username, avatar_url')
//         .eq('id', session.user.id)
//         .single()

//       if (!authError && !profileError && profile && authData?.user) {
//         setUser({
//           id: profile.id,
//           role: profile.role,
//           username: profile.username || '',
//           email: authData.user.email || '',
//           avatar_url: profile.avatar_url || '',
//           accessToken: session.access_token
//         })
//       }

//       setLoading(false)
//     }

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (session) {
//           getUser()
//         } else {
//           setUser(null)
//         }
//       }
//     )

//     getUser()

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [])

  

//   return { user, loading }
// }
export default function useUser() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const getUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      setUser(null)
      setLoading(false)
      return
    }

    const { data: authData, error: authError } = await supabase.auth.getUser()
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, role, username, avatar_url')
      .eq('id', session.user.id)
      .single()

    if (authError) console.error('[useUser] authError:', authError)
if (profileError) console.error('[useUser] profileError:', profileError)


    if (!authError && !profileError && profile && authData?.user) {
      setUser({
        id: profile.id,
        role: profile.role,
        username: profile.username || '',
        email: authData.user.email || '',
        accessToken: session.access_token,
        avatar_url: profile.avatar_url || '',
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          getUser()
        } else {
          setUser(null)
        }
      }
    )

    getUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading, refetch: getUser } // 🆕 add refetch
}
