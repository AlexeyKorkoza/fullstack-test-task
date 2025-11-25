'use server';

import ky, { type KyResponse } from 'ky';
import { headers } from 'next/headers';

import { createApiClient } from '@/core/api';
import {
  type BasicResponseDto,
  type LoginRequestDto,
  type LoginResponseDto,
  type SignUpRequestDto,
} from '@repo/api';

const apiClient = createApiClient();

const AUTH_PREFIX = 'auth';

export const signUpUser = async (
  body: SignUpRequestDto,
): Promise<BasicResponseDto> => {
  try {
    const response: KyResponse<BasicResponseDto> =
      await apiClient.post<BasicResponseDto>(`${AUTH_PREFIX}/register`, {
        json: body,
      });

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    console.error('Failed to sign up user:', error);

    throw error;
  }
};

export const signInUser = async (
  body: LoginRequestDto,
): Promise<KyResponse<LoginResponseDto>> => {
  try {
    const response: KyResponse<LoginResponseDto> = await apiClient.post(
      `${AUTH_PREFIX}/login`,
      {
        json: body,
      },
    );

    return response;
  } catch (error: unknown) {
    console.error('Failed to sign in user:', error);

    throw error;
  }
};

export const signOutUser = async (): Promise<BasicResponseDto> => {
  try {
    const response: KyResponse<BasicResponseDto> = await apiClient.post(
      `${AUTH_PREFIX}/logout`,
      {},
    );

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    console.error('Failed to sign out user:', error);

    throw error;
  }
};

export const signOutUserApi = async (): Promise<BasicResponseDto> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    const headersList = await headers();

    const response: KyResponse<BasicResponseDto> = await ky.post(
      `${baseUrl}/api/auth/logout`,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: headersList.get('cookie') || '',
        },
        credentials: 'include',
      },
    );

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    console.error('Failed to sign out user:', error);

    throw error;
  }
};
