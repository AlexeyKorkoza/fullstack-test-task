import { NextRequest, NextResponse } from 'next/server';
import { signUpUser } from '@/auth/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call your external authentication service
    const externalResponse = await signUpUser(body);

    const data = await externalResponse.json();

    // Create response
    const response = NextResponse.json({ success: true, data });

    return response;
  } catch (error: any) {
    const status = error?.response?.status || 500;
    let errorMessage = 'Registration failed';

    if (error?.response?.json) {
      try {
        const body = await error.response.json();
        errorMessage = body.message || body.error || 'Registration failed';
      } catch {
        // If JSON parsing fails, use default message
        errorMessage = 'Registration failed';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status },
    );
  }
}
