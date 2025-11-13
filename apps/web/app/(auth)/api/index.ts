import { type KyResponse } from 'ky';

import { createApiClient } from '@/(core)/api';
import { type SignUpBodyDto, type SignUpResponseDto } from '@/signup/models';
import { type SignInBodyDto, type SignInResponseDto } from '@/signin/models';

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
