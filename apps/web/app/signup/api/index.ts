import { createApiClient } from '@/(core)/api';
import { type SignUpDto } from '@/signup/models';

const apiClient = createApiClient();

export const sendSignUpBody = async (
  body: SignUpDto,
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('auth/register', {
    json: body,
  });

  const { message } = await response.json();

  return { message };
};
