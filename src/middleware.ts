import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("TOKEN_AUTH")?.value;
  const path = request.nextUrl.pathname;
  
  if (path === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (publicRoutes.includes(path)) {
    // If user is already logged in and tries to access login/signup, redirect to dashboard
    if (token) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }
  
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Local validation: Check if token exists and has correct format (3 parts)
  // We can't easily verify the signature here without a heavy library like jose,
  // but we can at least check if it's expired by decoding the payload.
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) throw new Error("Invalid token format");
    
    const payload = JSON.parse(atob(payloadBase64));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("TOKEN_AUTH");
      return response;
    }
  } catch (error) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("TOKEN_AUTH");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};