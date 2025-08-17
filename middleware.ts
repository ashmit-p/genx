// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next();

//   const authToken = request.cookies.get('__session')?.value || 
//                    request.headers.get('Authorization')?.replace('Bearer ', '');

//   if (!authToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   //  verify token server-side
//   //  assume the token is valid if present
  
//   if (request.nextUrl.pathname.startsWith("/admin")) {
//     // TODO: Fetch user role from Firestore using Firebase Admin SDK
//     // For now, we'll allow access if authenticated
//     // In production, you should verify the user role from Firestore
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/admin/:path*"], 
// };
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("__session")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`,
      audience: process.env.FIREBASE_PROJECT_ID,
    });

    // payload.uid is your Firebase user ID
    const uid = payload.sub as string;

    // 🔹 You cannot query Firestore here (edge limitation)
    // Instead, either:
    //  1. Use custom claims in the token (preferred)
    //  2. Or do a DB check via API route (Node, not Edge)

    if (pathname.startsWith("/admin")) {
      const role = (payload.role as string) || "user"; // if you add custom claims
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verify failed", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*"
  ],
  // Explicitly exclude API routes, static files, and socket connections
  unstable_allowDynamic: [
    '/api/**',
    '/_next/**',
    '/socket.io/**',
    '/static/**'
  ]
};
