import ky, { type KyResponse } from 'ky';
import { headers } from 'next/headers';

import { createApiClient } from '@/core/api';
import { type UserInfoResponseDto } from 'app/profile/dto';

const apiClient = createApiClient();

export const fetchCurrentUserProfile =
  async (): Promise<UserInfoResponseDto> => {
    try {
      const response: KyResponse<UserInfoResponseDto> = await apiClient.get(
        'me',
        {
          credentials: 'include',
        },
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Failed to fetch current user profile:', error);

      throw error;
    }
  };

export const fetchProfileFromApi = async (): Promise<UserInfoResponseDto> => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const headersList = await headers();

  const response: KyResponse<UserInfoResponseDto> = await ky.get(
    `${baseUrl}/api/profile`,
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
