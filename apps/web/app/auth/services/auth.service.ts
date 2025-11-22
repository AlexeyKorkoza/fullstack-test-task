import type { Cookie } from 'set-cookie-parser';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
} from '@/constants/cookie.constant';
import { getCookiesStore } from '@/core/cookies';

const COOKIES_LIST_TO_DELETE = [
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
];

export const deleteCookies = async (): Promise<void> => {
  const cookiesStore = await getCookiesStore();
  COOKIES_LIST_TO_DELETE.forEach((cookieName) => {
    if (cookiesStore.has(cookieName)) {
      const cookie = cookiesStore.get(cookieName);
      if (cookie) {
        const { name } = cookie;
        cookiesStore.delete(name);
      }
    }
  });
};

export const setCookies = async (parsedCookies: Cookie[]): Promise<void> => {
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
};
