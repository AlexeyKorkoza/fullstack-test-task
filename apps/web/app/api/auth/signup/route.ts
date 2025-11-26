import { NextRequest, NextResponse } from 'next/server';

import { signUpUser } from '@/auth/api';
import { isApiError } from '@/core/api/helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await signUpUser(body);

    const response = NextResponse.json({ success: true, data });

    return response;
  } catch (error: unknown) {
    let status = 500;
    let errorMessage = 'Registration failed';

    if (isApiError(error)) {
      status = error.response?.status ?? 500;

      if (typeof error.response?.json === 'function') {
        try {
          const body = await error.response.json();
          errorMessage = body.message || body.error || 'Registration failed';
        } catch {
          errorMessage = 'Registration failed';
        }
      }
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
