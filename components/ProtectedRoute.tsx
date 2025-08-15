'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUser from '@/lib/hooks/useUser'
// import { useParams, usePathname } from 'next/navigation'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useUser()
  const router = useRouter()
  // const pathname = usePathname();
  // const isModPage = pathname.startsWith('/admin') || pathname.startsWith('/mod'); 

  useEffect(() => {
    if (!loading && !user ) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <>{children}</>
}
