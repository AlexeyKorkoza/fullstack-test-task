import ky, { type KyResponse } from 'ky';

import { type UsersListResponseDto } from 'app/users/(dtos)';
import { createApiClient } from '@/(core)/api';
import { headers } from 'next/headers';

const apiClient = createApiClient();

export const fetchUsers = async (): Promise<UsersListResponseDto> => {
  try {
    const response: KyResponse<UsersListResponseDto> =
      await apiClient.get('users');

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch users', error);

    throw error;
  }
};

export const fetchUsersFromApi = async (): Promise<UsersListResponseDto> => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const headersList = await headers();

  const response: KyResponse<UsersListResponseDto> = await ky.get(
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
