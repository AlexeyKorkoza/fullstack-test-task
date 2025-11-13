import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { cookies } from 'next/headers';
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import ky, { type NormalizedOptions } from 'ky';
import setCookie from 'set-cookie-parser';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
} from '@/(constants)/cookie';
import { NextRequest } from 'next/server';

export const getCookiesStore = async (): Promise<ReadonlyRequestCookies> => {
  return await cookies();
};

export const getCookies = async (): Promise<{
  accessTokenCookie: RequestCookie | undefined;
  refreshTokenCookie: RequestCookie | undefined;
  sessionIdCookie: RequestCookie | undefined;
}> => {
  const cookiesStore = await getCookiesStore();
  const accessTokenCookie = cookiesStore.get(ACCESS_TOKEN_COOKIE_NAME);
  const refreshTokenCookie = cookiesStore.get(REFRESH_TOKEN_COOKIE_NAME);
  const sessionIdCookie = cookiesStore.get(SESSION_ID_COOKIE_NAME);

  return { accessTokenCookie, refreshTokenCookie, sessionIdCookie };
};

export const generateCookies = ({
  accessTokenCookie,
  refreshTokenCookie,
  sessionIdCookie,
}: {
  accessTokenCookie?: RequestCookie | undefined;
  refreshTokenCookie: RequestCookie | undefined;
  sessionIdCookie: RequestCookie | undefined;
}): string => {
  let cookieString = '';
  if (accessTokenCookie) {
    cookieString += `${ACCESS_TOKEN_COOKIE_NAME}=${accessTokenCookie.value}; `;
  }

  if (refreshTokenCookie) {
    cookieString += `${REFRESH_TOKEN_COOKIE_NAME}=${refreshTokenCookie.value}; `;
  }

  if (sessionIdCookie) {
    cookieString += `${SESSION_ID_COOKIE_NAME}=${sessionIdCookie.value}; `;
  }

  return cookieString;
};

export const refreshAccessToken = async ({
  request,
  options,
}: {
  request: NextRequest;
  options: NormalizedOptions;
}) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const { accessTokenCookie, refreshTokenCookie, sessionIdCookie } =
      await getCookies();

    const generatedCookies = generateCookies({
      accessTokenCookie,
      refreshTokenCookie,
      sessionIdCookie,
    });

    const refreshTokenResponse = await ky.post(`${apiUrl}/auth/refresh`, {
      headers: {
        'Content-Type': 'application/json',
        cookie: generatedCookies,
      },
      credentials: 'include',
    });

    if (!refreshTokenResponse.ok) {
      throw new Error('Failed to refresh token');
    }

    const parsedCookies = setCookie.parse(refreshTokenResponse);

    const newAccessTokenCookie = parsedCookies.find(
      (e) => e.name === ACCESS_TOKEN_COOKIE_NAME,
    );
    if (!newAccessTokenCookie) {
      throw new Error('Failed to find new access token cookie');
    }

    const { name, value, sameSite, ...restAccessTokenCookie } =
      newAccessTokenCookie;
    const cookieOptions = {
      ...restAccessTokenCookie,
      sameSite: sameSite as 'strict' | 'lax' | 'none' | undefined,
    };
    const cookiesStore = await getCookiesStore();
    cookiesStore.set(name, value, cookieOptions);

    const newGeneratedCookies = generateCookies({
      refreshTokenCookie,
      sessionIdCookie,
    });
    const newCookie = `${newAccessTokenCookie.name}=${newAccessTokenCookie.value}; ${newGeneratedCookies}`;

    const { prefixUrl, ...restOptions } = options;

    return ky(request.url, {
      ...restOptions,
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        cookie: newCookie,
      },
      credentials: 'include',
      retry: 0,
    });
  } catch (error) {
    console.error('Refresh access token is failed:', error);
  }
};
