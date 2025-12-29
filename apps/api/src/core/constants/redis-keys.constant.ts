export const REDIS_KEYS = {
  SESSION: (sessionId: string) => `session:${sessionId}`,
  USER_SESSIONS: (userId: number) => `user_sessions:${userId}`,
} as const;
