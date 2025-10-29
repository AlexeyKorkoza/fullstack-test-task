import { z } from 'zod';
import {
  EMAIL_INVALID_ERROR,
  MIN_PASSWORD_LENGTH,
  PASSWORD_INVALID_ERROR
} from '@/features/auth/constants/validation.constant';

export const signUpSchema = z
  .object({
    email: z.email({
      error: EMAIL_INVALID_ERROR,
    }),
    password: z.string().min(MIN_PASSWORD_LENGTH, {
      error: PASSWORD_INVALID_ERROR(MIN_PASSWORD_LENGTH),
    }),
  })
    .required();


