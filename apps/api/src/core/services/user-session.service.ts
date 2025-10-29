import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Redis } from 'ioredis';

import { type UserSession } from '@/features/auth/interfaces';

@Injectable()
export class UserSessionService {
  private readonly sessionTtl: number;
  private readonly sessionPrefix: string;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.sessionTtl = this.configService.get<number>('userSession.ttl');
    this.sessionPrefix = this.configService.get<string>('userSession.prefix');
  }

  async createSession(userSession: UserSession): Promise<string> {
    const sessionId = this.generateSessionId();

    await this.redis.setex(
      `${this.sessionPrefix}${sessionId}`,
      this.sessionTtl,
      JSON.stringify(userSession),
    );

    await this.redis.sadd(`user_sessions:${userSession.userId}`, sessionId);
    await this.redis.expire(
      `user_sessions:${userSession.userId}`,
      this.sessionTtl,
    );

    return sessionId;
  }

  async getSession(sessionId: string): Promise<UserSession | null> {
    const key = `${this.sessionPrefix}${sessionId}`;
    const sessionData = await this.redis.get(key);

    if (!sessionData) {
      return null;
    }

    await this.redis.expire(key, this.sessionTtl);

    return JSON.parse(sessionData);
  }

  async updateActivity(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.lastActivity = new Date();
      await this.redis.setex(
        `${this.sessionPrefix}${sessionId}`,
        this.sessionTtl,
        JSON.stringify(session),
      );
    }
  }

  async destroySession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      await this.redis.del(`${this.sessionPrefix}${sessionId}`);
      await this.redis.srem(`user_sessions:${session.userId}`, sessionId);
    }
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
