import ky, { type KyResponse } from 'ky';

import { createApiClient } from '@/core/api';
import { headers } from 'next/headers';
import { type UserListResponseDto } from '@repo/api';

const apiClient = createApiClient();

export const fetchUsers = async (): Promise<UserListResponseDto> => {
  try {
    const response: KyResponse<UserListResponseDto> =
      await apiClient.get('users');

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch users', error);

    throw error;
  }
};

export const fetchUsersFromApi = async (): Promise<UserListResponseDto> => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const headersList = await headers();

  const response: KyResponse<UserListResponseDto> = await ky.get(
    `${baseUrl}/api/users`,
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
