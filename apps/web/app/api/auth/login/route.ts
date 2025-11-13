import { NextRequest, NextResponse } from 'next/server';
import setCookie, { type Cookie } from 'set-cookie-parser';

import { signInUser } from '@/(auth)/api';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
} from '@/(constants)/cookie';
import { getCookiesStore } from '@/(core)/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const externalResponse = await signInUser(body);
    const parsedCookies = setCookie.parse(externalResponse);

    const authParsedCookies = parsedCookies.filter(
      (e) =>
        e.name === ACCESS_TOKEN_COOKIE_NAME ||
        e.name === REFRESH_TOKEN_COOKIE_NAME ||
        e.name === SESSION_ID_COOKIE_NAME,
    );

    const cookiesStore = await getCookiesStore();
    authParsedCookies.forEach((cookie: Cookie) => {
      const { name, value, sameSite, ...rest } = cookie;
      const cookieOptions = {
        ...rest,
        sameSite: sameSite as 'strict' | 'lax' | 'none' | undefined,
      };
      cookiesStore.set(name, value, cookieOptions);
    });

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 },
    );
  }
}
