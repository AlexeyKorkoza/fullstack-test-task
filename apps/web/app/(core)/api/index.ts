import ky, {
  type AfterResponseState,
  type KyInstance,
  type KyRequest,
  type KyResponse,
  type NormalizedOptions,
} from 'ky';

import { generateCookies, getCookies } from '@/(core)/cookies';

export const createApiClient = (): KyInstance => {
  const prefixUrl = process.env.NEXT_PUBLIC_API_URL;

  return ky.create({
    prefixUrl,
    credentials: 'include',
    hooks: {
      beforeRequest: [
        async (request: KyRequest): Promise<void> => {
          const { accessTokenCookie, refreshTokenCookie, sessionIdCookie } =
            await getCookies();

          const generatedCookies = generateCookies({
            accessTokenCookie,
            refreshTokenCookie,
            sessionIdCookie,
          });

          if (generatedCookies) {
            request.headers.set('Cookie', generatedCookies);
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
