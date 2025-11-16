import ky, {
  type AfterResponseState,
  type KyInstance,
  type KyRequest,
  type KyResponse,
  type NormalizedOptions,
} from 'ky';
import { NextRequest } from 'next/server';

import { generateCookies, getCookies } from '@/core/cookies';

export const createApiClient = (): KyInstance => {
  const prefixUrl = process.env.NEXT_PUBLIC_API_URL;

  return ky.create({
    prefixUrl,
    credentials: 'include',
    hooks: {
      beforeRequest: [
        async (request: KyRequest): Promise<void> => {
          if (!request.headers.get('cookie')) {
            const { accessTokenCookie, refreshTokenCookie, sessionIdCookie } =
              await getCookies();

            const generatedCookies = generateCookies({
              accessTokenCookie,
              refreshTokenCookie,
              sessionIdCookie,
            });

            if (generatedCookies) {
              request.headers.set('cookie', generatedCookies);
            }
          }
        },
      ],
      afterResponse: [
        async (
          request: KyRequest,
          options: NormalizedOptions,
          response: KyResponse,
          state: AfterResponseState,
        ): Promise<any> => {
          if (response.status === 401 && state.retryCount === 0) {
            throw {
              response,
              options,
            };
          }
        },
      ],
    },
    retry: {
      limit: 1,
      statusCodes: [401],
    },
  });
};

export const retryRequest = async ({
  request,
  options,
}: {
  request: NextRequest;
  options: NormalizedOptions;
}): Promise<KyResponse> => {
  const {
    accessTokenCookie: newAccessToken,
    refreshTokenCookie: newRefreshToken,
    sessionIdCookie: newSessionId,
  } = await getCookies();
  const cookie = generateCookies({
    accessTokenCookie: newAccessToken,
    refreshTokenCookie: newRefreshToken,
    sessionIdCookie: newSessionId,
  });

  const { prefixUrl, ...restOptions } = options;

  return ky(request.url, {
    ...restOptions,
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      cookie,
    },
    credentials: 'include',
    retry: 0,
  });
};
