import { useMutation } from '@tanstack/react-query';

import { signInUser } from '@/(auth)/api';
import { type SignInDto } from '@/signin/models';

export const useSignIn = () => {
  return useMutation({
    mutationFn: (body: SignInDto) => signInUser(body),
  });
};
