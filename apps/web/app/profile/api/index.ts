import { type KyResponse } from 'ky';

import { createApiClient } from '@/(core)/api';
import { type UserInfoResponseDto } from '@/profile/models';

const apiClient = createApiClient();

export const fetchCurrentUserProfile = async (): Promise<
  KyResponse<UserInfoResponseDto>
> => {
  try {
    const currentUser: KyResponse<UserInfoResponseDto> = await apiClient.get(
      'me',
      {
        credentials: 'include',
      },
    );

    return currentUser;
  } catch (error) {
    console.error('Failed to fetch current user profile:', error);

    throw error;
  }
};
