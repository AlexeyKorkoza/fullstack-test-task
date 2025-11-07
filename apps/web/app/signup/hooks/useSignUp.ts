import { useMutation } from '@tanstack/react-query';

import { type SignUpDto } from '@/signup/models';
import { sendSignUpBody } from '@/signup/api';

export const useSignUp = () => {
  return useMutation({
    mutationFn: (body: SignUpDto) => sendSignUpBody(body),
  });
};
