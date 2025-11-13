import { NextRequest, NextResponse } from 'next/server';
import { signUpUser } from '@/(auth)/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call your external authentication service
    const externalResponse = await signUpUser(body);

    const data = await externalResponse.json();

    // Create response
    const response = NextResponse.json({ success: true, data });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 },
    );
  }
}
