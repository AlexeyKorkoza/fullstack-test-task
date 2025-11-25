import { NextRequest, NextResponse } from 'next/server';
import setCookie from 'set-cookie-parser';
import { type KyResponse } from 'ky';

import { deleteCookies, setCookies } from '@/auth/services/auth.service';
import { type LoginResponseDto } from '@repo/api';
import { signInUser } from '@/auth/api';

export async function POST(request: NextRequest) {
  try {
    await deleteCookies();

    const body = await request.json();
    const externalResponse: KyResponse<LoginResponseDto> =
      await signInUser(body);
    // @ts-ignore
    const parsedCookies = setCookie.parse(externalResponse);

    const data = await externalResponse.json();
    await setCookies(parsedCookies);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    let errorMessage = 'Authentication failed';

    if (error?.response?.json) {
      try {
        const body = await error.response.json();
        errorMessage = body.message || body.error || 'Authentication failed';
      } catch {
        errorMessage = 'Authentication failed';
      }
    }

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
