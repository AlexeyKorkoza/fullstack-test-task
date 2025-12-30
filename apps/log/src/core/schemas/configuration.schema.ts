import { z } from 'zod';

import {
  DEFAULT_MONGODB_URI,
  DEFAULT_RABBITMQ_URL,
} from '@/core/constants/environment.constant';

export const validationSchema = z.object({
  RABBITMQ_URL: z.string().default(DEFAULT_RABBITMQ_URL),
  MONGODB_URI: z.string().default(DEFAULT_MONGODB_URI),
});

export function validateConfig(config: Record<string, unknown>) {
  try {
    return validationSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // @ts-ignore
      const messages = error.errors.map((err) => {
        const path = err.path.join('.');

        return `${path}: ${err.message}`;
      });

      throw new Error(
        `Configuration validation failed:\n${messages.join('\n')}`,
      );
    }
    throw error;
  }
}
