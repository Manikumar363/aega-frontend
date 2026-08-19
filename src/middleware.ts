import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;
    
    const restrictedPaths = [
      '/login',
      '/signup',
      '/forgot-password',
      '/university/login'
    ];
    
    if (restrictedPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
      url.pathname = '/contact-us';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login/:path*',
    '/signup/:path*',
    '/forgot-password/:path*',
    '/university/login/:path*'
  ]
};
