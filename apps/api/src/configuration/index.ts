import {
  DEFAULT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  DEFAULT_ACCESS_TOKEN_SECRET,
  DEFAULT_API_PREFIX,
  DEFAULT_AWS_REGION,
  DEFAULT_BASE_URL,
  DEFAULT_CORS_ORIGIN,
  DEFAULT_DATABASE_URL,
  DEFAULT_PASSWORD_SALT_ROUNDS,
  DEFAULT_PORT,
  DEFAULT_RABBITMQ_URL,
  DEFAULT_REDIS_HOST,
  DEFAULT_REDIS_PORT,
  DEFAULT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
  DEFAULT_REFRESH_TOKEN_SALT_ROUNDS,
  DEFAULT_REFRESH_TOKEN_SECRET,
  DEFAULT_USER_SESSION_PREFIX,
  DEFAULT_USER_SESSION_TTL
} from '@/core/constants/environment.constant';

export default () => ({
  port: parseInt(process.env.PORT || DEFAULT_PORT, 10),
  databaseUrl: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
  apiPrefix: process.env.API_PREFIX || DEFAULT_API_PREFIX,
  baseUrl: process.env.BASE_URL || DEFAULT_BASE_URL,
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET || DEFAULT_ACCESS_TOKEN_SECRET,
    expiresIn: parseInt(
      process.env.ACCESS_TOKEN_SECRET_EXPIRES_IN_SECONDS || DEFAULT_ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      10,
    ),
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || DEFAULT_REFRESH_TOKEN_SECRET,
    expiresIn: parseInt(
      process.env.REFRESH_TOKEN_SECRET_EXPIRES_IN_SECONDS || DEFAULT_REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      10,
    ),
    saltRounds: parseInt(process.env.PASSWORD_SALT_RADIUS || DEFAULT_REFRESH_TOKEN_SALT_ROUNDS, 10),
  },
  password: {
    saltRounds: parseInt(process.env.PASSWORD_SALT_RADIUS || DEFAULT_PASSWORD_SALT_ROUNDS, 10),
  },
  redis: {
    host: process.env.REDIS_HOST || DEFAULT_REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || DEFAULT_REDIS_PORT, 10),
  },
  userSession: {
    prefix: process.env.USER_SESSION_PREFIX || DEFAULT_USER_SESSION_PREFIX,
    ttl: parseInt(process.env.USER_SESSION_TTL_IN_SECONDS || DEFAULT_USER_SESSION_TTL, 10),
  },
  aws: {
    region: process.env.AWS_REGION || DEFAULT_AWS_REGION,
    verifiedEmail: process.env.AWS_SES_VERIFIED_EMAIL,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || DEFAULT_RABBITMQ_URL,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || DEFAULT_CORS_ORIGIN,
  },
});
