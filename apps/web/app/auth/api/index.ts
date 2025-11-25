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
): Promise<KyResponse<BasicResponseDto>> => {
  const response = await apiClient.post<BasicResponseDto>(
    `${AUTH_PREFIX}/register`,
    {
      json: body,
    },
  );

  return response;
};

export const signInUser = async (
  body: LoginRequestDto,
): Promise<KyResponse<LoginResponseDto>> => {
  const response = await apiClient.post(`${AUTH_PREFIX}/login`, {
    json: body,
  });

  return response;
};

export const signOutUser = async (): Promise<KyResponse<BasicResponseDto>> => {
  const response = await apiClient.post(`${AUTH_PREFIX}/logout`, {});

  return response;
};

export const signOutUserApi = async (): Promise<any> => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const headersList = await headers();

  const response: KyResponse<any> = await ky.post(
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
};
