import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl.pathname

  if (!session?.user) {
    if (url.startsWith('/dashboard') || url.startsWith('/mod') || url.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const role = profile?.role

  if (url.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  if (url.startsWith('/mod') && !['admin', 'mod'].includes(role)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  return res
}

export const config = {
   matcher: [
    '/api/like-blog',              
    '/dashboard/:path*',
    '/admin/:path*',
    '/mod/:path*',
  ],
}
