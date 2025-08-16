import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authToken = request.cookies.get('__session')?.value || 
                   request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //  verify token server-side
  //  assume the token is valid if present
  
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // TODO: Fetch user role from Firestore using Firebase Admin SDK
    // For now, we'll allow access if authenticated
    // In production, you should verify the user role from Firestore
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"], 
};
