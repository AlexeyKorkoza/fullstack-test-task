import { NextRequest, NextResponse } from 'next/server';

import { refreshAccessToken } from '@/(core)/cookies';
import { fetchUsers } from '@/users/(api)';
import { retryRequest } from '@/(core)/api';

export async function GET(request: NextRequest) {
  try {
    const data = await fetchUsers();

    return Response.json(data, { status: 200 });
  } catch (error: any) {
    console.error('NextRequest error:', {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.response?.url,
    });

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
        console.error('Token refresh failed:', refreshError);

        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 },
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    );
  }
}
