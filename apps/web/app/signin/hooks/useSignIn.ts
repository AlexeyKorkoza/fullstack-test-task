import { useMutation } from '@tanstack/react-query';

import { signInUser } from '@/auth/api';
import { type SignInBodyDto } from 'app/signin/dto';

export const useSignIn = () => {
  return useMutation({
    mutationFn: (body: SignInBodyDto) => signInUser(body),
  });
};
