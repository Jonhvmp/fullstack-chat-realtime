// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isSitePage = request.nextUrl.pathname.startsWith('/site');

  if (!token && isSitePage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/site/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/site/:path*', '/auth/:path*']
};
