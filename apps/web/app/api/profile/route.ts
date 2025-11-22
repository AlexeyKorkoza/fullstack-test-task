import { NextRequest, NextResponse } from 'next/server';

import { fetchCurrentUserProfile } from '@/profile/api';
import { refreshAccessToken } from '@/core/cookies';
import { retryRequest } from '@/core/api';

export async function GET(request: NextRequest) {
  try {
    const data = await fetchCurrentUserProfile();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('NextRequest error:', {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.response?.url,
    });

    if (error?.response?.status === 401) {
      try {
        await refreshAccessToken();

        const retryResponse = await retryRequest({
          request,
          options: error.options,
        });
        const retryData = await retryResponse.json();

        return Response.json(retryData, { status: 200 });
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError);

        const refreshStatus = refreshError?.response?.status || 401;
        let refreshErrorMessage = 'Authentication failed';

        if (refreshError?.response?.json) {
          try {
            const body = await refreshError.response.json();
            refreshErrorMessage =
              body.message || body.error || 'Authentication failed';
          } catch {
            // If JSON parsing fails, use default message
            refreshErrorMessage = 'Authentication failed';
          }
        }

        return NextResponse.json(
          { error: refreshErrorMessage },
          { status: refreshStatus },
        );
      }
    }

    const status = error?.response?.status || 500;
    let errorMessage = 'Failed to fetch profile';

    if (error?.response?.json) {
      try {
        const body = await error.response.json();
        errorMessage = body.message || body.error || 'Failed to fetch profile';
      } catch {
        // If JSON parsing fails, use default message
        errorMessage = 'Failed to fetch profile';
      }
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
