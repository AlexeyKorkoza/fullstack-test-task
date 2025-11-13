import { NextRequest, NextResponse } from 'next/server';

import { fetchCurrentUserProfile } from '@/profile/api';
import { refreshAccessToken } from '@/(core)/cookies';

export async function GET(request: NextRequest) {
  try {
    const externalResponse = await fetchCurrentUserProfile();
    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    if (error?.response?.status === 401) {
      try {
        const retryResponse = await refreshAccessToken({
          request,
          options: error.options,
        });

        if (retryResponse) {
          const data = await retryResponse.json();

          return NextResponse.json(data);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 },
    );
  }
}
