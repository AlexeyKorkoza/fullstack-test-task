import { createApiClient } from '@/(core)/api';
import { type SignUpDto } from '@/signup/models';
import { type SignInDto } from '@/signin/models';

const apiClient = createApiClient();

const AUTH_PREFIX = 'auth';

export const signUpUser = async (
  body: SignUpDto,
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `${AUTH_PREFIX}/register`,
    {
      json: body,
    },
  );

  const { message } = await response.json();

  return { message };
};

export const signInUser = async (
  body: SignInDto,
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `${AUTH_PREFIX}/login`,
    {
      json: body,
    },
  );

  const { message } = await response.json();

  return { message };
};
