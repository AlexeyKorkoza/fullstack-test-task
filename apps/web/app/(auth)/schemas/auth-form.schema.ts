import { z } from 'zod';

import {
  EMAIL_INVALID_ERROR,
  MIN_PASSWORD_LENGTH,
  PASSWORD_INVALID_ERROR,
} from '@/(auth)/constants/validation.constant';

export const authFormSchema = z
  .object({
    email: z.email({
      error: EMAIL_INVALID_ERROR,
    }),
    password: z.string().min(MIN_PASSWORD_LENGTH, {
      error: PASSWORD_INVALID_ERROR(MIN_PASSWORD_LENGTH),
    }),
  })
  .required();
