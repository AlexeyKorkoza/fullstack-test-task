import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Redis } from 'ioredis';
import crypto from 'crypto';

import { type UserSession } from '@/features/auth/interfaces';
import { type UserEntity } from '@repo/api';
import { REDIS_CLIENT } from '@/core/providers/redis.provider';
import { REDIS_KEYS } from '@/core/constants/redis-keys.constant';
import { type AppConfig } from '@/core/interfaces';

@Injectable()
export class UserSessionService {
  private readonly logger = new Logger(UserSessionService.name);
  private readonly sessionTtl: number;
  private readonly sessionPrefix: string;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.sessionTtl = this.configService.get<number>('userSession.ttl', { infer: true });
    this.sessionPrefix = this.configService.get<string>('userSession.prefix', { infer: true });
  }

  async createSession({
    user,
    ipAddress,
    userAgent,
  }: {
    user: UserEntity;
    ipAddress: string;
    userAgent: string;
  }): Promise<string> {
    try {
      const { id: userId, email, createdAt } = user;
      const sessionId = this.generateDeviceHash(userAgent, ipAddress);
      const userSession = {
        userId,
        email,
        createdAt,
        lastActivity: new Date(),
        ipAddress: ipAddress ?? '',
        userAgent: userAgent ?? '',
      };

      const pipeline = this.redis.pipeline();
      pipeline.setex(
        REDIS_KEYS.SESSION(sessionId),
        this.sessionTtl,
        JSON.stringify(userSession),
      );
      pipeline.sadd(REDIS_KEYS.USER_SESSIONS(userId), sessionId);
      pipeline.expire(REDIS_KEYS.USER_SESSIONS(userId), this.sessionTtl);

      await pipeline.exec();

      return sessionId;
    } catch (error) {
      this.logger.error('Failed to create session', error);

      throw error;
    }
  }

  async getSession(sessionId: string): Promise<UserSession | null> {
    try {
      const key = `${this.sessionPrefix}:${sessionId}`;
      const sessionData = await this.redis.get(key);

      if (!sessionData) {
        return null;
      }

      await this.redis.expire(key, this.sessionTtl);

      try {
        return JSON.parse(sessionData) as UserSession;
      } catch (parseError) {
        this.logger.error(
          `Failed to parse session data for ${sessionId}`,
          parseError,
        );

        await this.redis.del(key);

        return null;
      }
    } catch (error) {
      this.logger.error(`Redis error in getSession for ${sessionId}`, error);
      throw error;
    }
  }

  async updateActivity(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      session.lastActivity = new Date();
      await this.redis.setex(
        REDIS_KEYS.SESSION(sessionId),
        this.sessionTtl,
        JSON.stringify(session),
      );
    }
  }

  async destroySession(sessionId: string): Promise<void> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        return;
      }

      const pipeline = this.redis.pipeline();
      pipeline.del(REDIS_KEYS.SESSION(sessionId));
      pipeline.srem(REDIS_KEYS.USER_SESSIONS(session.userId), sessionId);

      await pipeline.exec();
    } catch (error) {
      this.logger.error(`Failed to destroy session ${sessionId}`, error);
      throw error;
    }
  }

  generateSessionId(userAgent: string, ipAddress: string): string {
    return `${this.sessionPrefix}:${this.generateDeviceHash(userAgent, ipAddress)}`;
  }

  findSessionByUserAndDevice(sessionId: string): Promise<string | null> {
    return this.redis.get(sessionId);
  }

  private generateDeviceHash(userAgent: string, ipAddress: string): string {
    return crypto
      .createHash('sha256')
      .update(`${this.sessionPrefix}:${userAgent}:${ipAddress}`)
      .digest('hex');
  }
}
