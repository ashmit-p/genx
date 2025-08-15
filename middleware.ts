// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareSupabaseClient({ req, res });
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return NextResponse.redirect(new URL('/unauthorized', req.url));
//   }

//   const { data: profile } = await supabase
//     .from('users')
//     .select('role')
//     .eq('id', user.id)
//     .single();

//     console.log('User ID:', user.id);
// console.log('Profile:', profile);


//   if (!profile || !['mod', 'admin'].includes(profile.role)) {
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   return res;
// }

// export const config = {
//   matcher: ['/admin/blog-review'],
//   runtime: 'nodejs',
// };
// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // No session? redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role check
  if (request.nextUrl.pathname.startsWith("/admin")) {
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id) // or matching column
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
}

  return response;
}

export const config = {
  matcher: ["/admin/:path*"], // Apply middleware to all /admin routes
};
