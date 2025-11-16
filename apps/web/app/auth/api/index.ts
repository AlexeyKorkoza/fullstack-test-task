'use server';
import ky, { type KyResponse } from 'ky';

import { createApiClient } from '@/core/api';
import { type SignUpBodyDto, type SignUpResponseDto } from 'app/signup/dto';
import { type SignInBodyDto, type SignInResponseDto } from 'app/signin/dto';
import { headers } from 'next/headers';

const apiClient = createApiClient();

const AUTH_PREFIX = 'auth';

export const signUpUser = async (
  body: SignUpBodyDto,
): Promise<KyResponse<SignUpResponseDto>> => {
  const response = await apiClient.post<SignUpResponseDto>(
    `${AUTH_PREFIX}/register`,
    {
      json: body,
    },
  );

  return response;
};

export const signInUser = async (body: SignInBodyDto): Promise<any> => {
  const response = await apiClient.post<{ message: string }>(
    `${AUTH_PREFIX}/login`,
    {
      json: body,
      credentials: 'include',
    },
  );

  return response;
};

export const signOutUser = async (): Promise<any> => {
  const response = await apiClient.post(`${AUTH_PREFIX}/logout`, {
    credentials: 'include',
  });

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
