import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Ambil token dan pastikan role dibaca sebagai huruf kecil semua
  const token = request.cookies.get('TOKEN_AUTH')?.value;
  const role = request.cookies.get('USER_ROLE')?.value?.toLowerCase();

  const isAdmin = role === 'admin';
  const isBendahara = role === 'bendahara';
  const canAccessAdmin = Boolean(token && (isAdmin || isBendahara));
  const bendaharaAllowed = path.startsWith('/payments') || path.startsWith('/reports');

  // 1. Jika mengakses path '/' atau '/login'
  if (path === '/' || path.startsWith('/login')) {
    if (canAccessAdmin) {
      return NextResponse.redirect(new URL(isBendahara ? '/payments' : '/dashboard', request.url));
    }
    
    // Jika belum login dan mencoba mengakses '/', arahkan ke '/login'
    if (path === '/') {
       return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Jika belum login dan di '/login', biarkan lewat untuk memunculkan form
    return NextResponse.next();
  }

  if (!canAccessAdmin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isBendahara && !bendaharaAllowed) {
    return NextResponse.redirect(new URL('/payments', request.url));
  }

  // Biarkan file statis/gambar Next.js lewat
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};