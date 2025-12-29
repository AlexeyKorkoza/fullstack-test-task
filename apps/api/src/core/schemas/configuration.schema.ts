import { z } from 'zod';

import {
  DEFAULT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  DEFAULT_ACCESS_TOKEN_SECRET,
  DEFAULT_AWS_REGION,
  DEFAULT_BASE_URL,
  DEFAULT_CORS_ORIGIN,
  DEFAULT_PASSWORD_SALT_ROUNDS,
  DEFAULT_PORT, DEFAULT_RABBITMQ_URL,
  DEFAULT_REDIS_HOST,
  DEFAULT_REDIS_PORT,
  DEFAULT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
  DEFAULT_REFRESH_TOKEN_SECRET,
  DEFAULT_USER_SESSION_PREFIX,
  DEFAULT_USER_SESSION_TTL
} from '@/core/constants/environment.constant';

const isProduction = process.env.NODE_ENV === 'production';

export const validationSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.string().default(DEFAULT_PORT),
  API_PREFIX: z.string().default('api'),
  BASE_URL: z.string().default(DEFAULT_BASE_URL),

  ACCESS_TOKEN_SECRET: isProduction
    ? z.string().min(32)
    : z.string().default(DEFAULT_ACCESS_TOKEN_SECRET),
  ACCESS_TOKEN_SECRET_EXPIRES_IN_SECONDS: z.string().default(DEFAULT_ACCESS_TOKEN_EXPIRES_IN_SECONDS),
  REFRESH_TOKEN_SECRET: isProduction
    ? z.string().min(32)
    : z.string().default(DEFAULT_REFRESH_TOKEN_SECRET),
  REFRESH_TOKEN_SECRET_EXPIRES_IN_SECONDS: z.string().default(DEFAULT_REFRESH_TOKEN_EXPIRES_IN_SECONDS),

  DATABASE_URL: z.string(),

  REDIS_HOST: isProduction
    ? z.string()
    : z.string().default(DEFAULT_REDIS_HOST),
  REDIS_PORT: isProduction
    ? z.string()
    : z.string().default(DEFAULT_REDIS_PORT),

  PASSWORD_SALT_RADIUS: z.string().default(DEFAULT_PASSWORD_SALT_ROUNDS),
  USER_SESSION_PREFIX: z.string().default(DEFAULT_USER_SESSION_PREFIX),
  USER_SESSION_TTL_IN_SECONDS: z.string().default(DEFAULT_USER_SESSION_TTL),

  AWS_REGION: z.string().default(DEFAULT_AWS_REGION),
  AWS_SES_VERIFIED_EMAIL: z.string(),

  RABBITMQ_URL: z.string().default(DEFAULT_RABBITMQ_URL),
  CORS_ORIGIN: z.string().default(DEFAULT_CORS_ORIGIN),
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
      throw new Error(`Configuration validation failed:\n${messages.join('\n')}`);
    }
    throw error;
  }
}
