import { NextRequest, NextResponse } from 'next/server';

import { signOutUser } from '@/auth/api';
import { refreshAccessToken } from '@/core/cookies';
import { retryRequest } from '@/core/api';
import { deleteCookies } from '@/auth/services/auth.service';
import { isApiError } from '@/core/api/helpers';

export async function POST(request: NextRequest) {
  try {
    const data = await signOutUser();
    await deleteCookies();

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    if (isApiError(error) && error.response?.status === 401) {
      try {
        await refreshAccessToken();

        const retryResponse = await retryRequest({
          request,
          options: error.options,
        });
        const retryData = await retryResponse.json();

        return Response.json(retryData, { status: 200 });
      } catch (refreshError: unknown) {
        console.error('Logout failed:', refreshError);

        let refreshStatus = 401;
        let refreshErrorMessage = 'Logout failed';

        if (isApiError(refreshError)) {
          refreshStatus = refreshError.response?.status ?? 401;
          if (typeof refreshError.response?.json === 'function') {
            try {
              const body = await refreshError.response.json();
              refreshErrorMessage =
                body.message || body.error || 'Logout failed';
            } catch {
              refreshErrorMessage = 'Logout failed';
            }
          }
        }

        return NextResponse.json(
          { error: refreshErrorMessage },
          { status: refreshStatus },
        );
      }
    }

    let status = 500;
    let errorMessage = 'Logout failed';

    if (isApiError(error)) {
      status = error.response?.status ?? 500;

      if (typeof error.response?.json === 'function') {
        try {
          const body = await error.response.json();
          errorMessage = body.message || body.error || 'Logout failed';
        } catch {
          errorMessage = 'Logout failed';
        }
      }
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
