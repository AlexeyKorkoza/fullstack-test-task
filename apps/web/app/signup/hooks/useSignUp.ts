import { useMutation } from '@tanstack/react-query';

import { type SignUpDto } from '@/signup/models';
import { signUpUser } from '@/(auth)/api';

export const useSignUp = () => {
  return useMutation({
    mutationFn: (body: SignUpDto) => signUpUser(body),
  });
};
