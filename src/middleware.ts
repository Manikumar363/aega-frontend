import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const isLocalOrDev = hostname === 'localhost' || 
                       hostname === '127.0.0.1' || 
                       hostname.startsWith('192.168.') || 
                       hostname === 'aega-frontend.vercel.app' ||
                       hostname.endsWith('.vercel.app');
  
  const isProduction = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_APP_MODE === 'production';
  if (!isLocalOrDev && isProduction) {
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
