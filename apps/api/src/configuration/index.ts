export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL,
  apiPrefix: process.env.API_PREFIX || 'api',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET || 'access_token_secret',
    expiresIn: parseInt(
      process.env.ACCESS_TOKEN_SECRET_EXPIRES_IN_SECONDS || '900',
      10,
    ),
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret',
    expiresIn: parseInt(
      process.env.REFRESH_TOKEN_SECRET_EXPIRES_IN_SECONDS || '144000',
      10,
    ),
    saltRounds: parseInt(process.env.PASSWORD_SALT_RADIUS || '10', 10),
  },
  password: {
    saltRounds: parseInt(process.env.PASSWORD_SALT_RADIUS || '10', 10),
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  userSession: {
    prefix: process.env.USER_SESSION_PREFIX || 'session',
    ttl: parseInt(process.env.USER_SESSION_TTL_IN_SECONDS || '86400', 10),
  },
});
