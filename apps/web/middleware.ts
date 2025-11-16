import { NextResponse, NextRequest } from 'next/server';

import { ROUTERS } from '@/(constants)/router.constant';
import { generateCookies, getCookies } from '@/(core)/cookies';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === ROUTERS.signin ||
    pathname === ROUTERS.signup
  ) {
    return NextResponse.next();
  }

  const { accessTokenCookie, refreshTokenCookie, sessionIdCookie } =
    await getCookies();

  const generatedCookies = generateCookies({
    accessTokenCookie,
    refreshTokenCookie,
    sessionIdCookie,
  });

  if (!generatedCookies || generatedCookies.trim() === '') {
    const signinUrl = new URL(ROUTERS.signin, request.url);

    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    ROUTERS.profile,
    `${ROUTERS.profile}/:path*`,
    ROUTERS.users,
    `${ROUTERS.users}/:path*`,
  ],
};
