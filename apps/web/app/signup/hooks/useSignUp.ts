import { useMutation } from '@tanstack/react-query';

import { type SignUpBodyDto } from 'app/signup/dto';
import { signUpUser } from '@/auth/api';

export const useSignUp = () => {
  return useMutation({
    mutationFn: (body: SignUpBodyDto) => signUpUser(body),
  });
};
