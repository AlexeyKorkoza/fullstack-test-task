import { NextRequest, NextResponse } from 'next/server';

import { refreshAccessToken } from '@/core/cookies';
import { fetchUsers } from '@/users/api';
import { retryRequest } from '@/core/api';
import { isApiError } from '@/core/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const data = await fetchUsers();

    return Response.json(data, { status: 200 });
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
        console.error('Token refresh failed:', refreshError);

        let refreshStatus = 401;
        let refreshErrorMessage = 'Authentication failed';

        if (isApiError(refreshError)) {
          refreshStatus = refreshError.response?.status ?? 401;
          if (typeof refreshError.response?.json === 'function') {
            try {
              const body = await refreshError.response.json();
              refreshErrorMessage =
                body.message || body.error || 'Authentication failed';
            } catch {
              refreshErrorMessage = 'Authentication failed';
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
    let errorMessage = 'Failed to fetch users';

    if (isApiError(error)) {
      status = error.response?.status ?? 500;

      if (typeof error.response?.json === 'function') {
        try {
          const body = await error.response.json();
          errorMessage = body.message || body.error || 'Failed to fetch users';
        } catch {
          errorMessage = 'Failed to fetch users';
        }
      }
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
