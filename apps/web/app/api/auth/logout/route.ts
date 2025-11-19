import { NextRequest, NextResponse } from 'next/server';

import { signOutUser } from '@/auth/api';
import { refreshAccessToken } from '@/core/cookies';
import { retryRequest } from '@/core/api';
import { deleteCookies } from '@/auth/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const externalResponse = await signOutUser();
    if (!externalResponse.ok) {
      throw new Error('Failed to sign out');
    }

    const data = await externalResponse.json();
    await deleteCookies();

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
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
        console.error('Logout failed:', refreshError);

        const refreshStatus = refreshError?.response?.status || 401;
        let refreshErrorMessage = 'Logout failed';

        if (refreshError?.response?.json) {
          try {
            const body = await refreshError.response.json();
            refreshErrorMessage = body.message || body.error || 'Logout failed';
          } catch {
            refreshErrorMessage = 'Logout failed';
          }
        }

        return NextResponse.json(
          { error: refreshErrorMessage },
          { status: refreshStatus },
        );
      }
    }

    const status = error?.response?.status || 500;
    let errorMessage = 'Logout failed';

    if (error?.response?.json) {
      try {
        const body = await error.response.json();
        errorMessage = body.message || body.error || 'Logout failed';
      } catch {
        errorMessage = 'Logout failed';
      }
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
