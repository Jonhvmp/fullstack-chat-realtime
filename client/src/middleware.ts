import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const cookieToken = request.cookies.get('auth_token');

  // Se não tiver cookie, verifica se tem um token no header (que vem do localStorage via api.ts)
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;

  // Se tiver qualquer um dos tokens, permite o acesso
  if (cookieToken?.value || bearerToken) {
    // Se não tiver cookie mas tiver bearer token, configura o cookie
    if (!cookieToken?.value && bearerToken) {
      const response = NextResponse.next();
      response.cookies.set('auth_token', bearerToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      return response;
    }
    return NextResponse.next();
  }

  // Se não tiver nenhum token, redireciona para login
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/chat', '/user']
};
