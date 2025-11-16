import { NextRequest, NextResponse } from 'next/server';

import { signOutUser } from '@/auth/api';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
} from '@/constants/cookie.constant';
import { getCookiesStore, refreshAccessToken } from '@/core/cookies';
import { retryRequest } from '@/core/api';

const LIST_COOKIES_TO_DELETE = [
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
];

export async function POST(request: NextRequest) {
  try {
    const externalResponse = await signOutUser();
    if (!externalResponse.ok) {
      throw new Error('Failed to sign out');
    }

    const cookiesStore = await getCookiesStore();
    LIST_COOKIES_TO_DELETE.forEach((name: string) => {
      cookiesStore.delete(name);
    });

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        await refreshAccessToken();

        const retryResponse = await retryRequest({
          request,
          options: error.options,
        });
        const retryData = await retryResponse.json();

        return Response.json(retryData, { status: 200 });
      } catch (refreshError) {
        console.error('Logout failed:', refreshError);

        return NextResponse.json({ error: 'Logout failed' }, { status: 401 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}
