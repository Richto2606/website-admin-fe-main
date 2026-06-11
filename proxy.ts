import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Ambil token dan pastikan role dibaca sebagai huruf kecil semua
  const token = request.cookies.get('TOKEN_AUTH')?.value;
  const role = request.cookies.get('USER_ROLE')?.value?.toLowerCase();

  // Variabel untuk mengecek apakah user sudah memiliki sesi valid sebagai admin
  const isLoggedInAsAdmin = token && role === 'admin';

  // 1. Jika mengakses path '/' atau '/login'
  if (path === '/' || path.startsWith('/login')) {
    if (isLoggedInAsAdmin) {
      // Jika sudah login, langsung "terbangkan" ke dashboard!
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Jika belum login dan mencoba mengakses '/', arahkan ke '/login'
    if (path === '/') {
       return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Jika belum login dan di '/login', biarkan lewat untuk memunculkan form
    return NextResponse.next();
  }

  // 2. Proteksi khusus folder dashboard
  if (path.startsWith('/dashboard')) {
    if (!isLoggedInAsAdmin) {
      // Jika belum login (atau token kadaluarsa), lempar kembali ke halaman login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Biarkan file statis/gambar Next.js lewat
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};