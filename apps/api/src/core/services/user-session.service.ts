import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Redis } from 'ioredis';
import crypto from 'crypto';

import { type UserSession } from '@/features/auth/interfaces';
import { type UserEntity } from '@/features/auth/entities';

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

  async createSession({
    user,
    ipAddress,
    userAgent,
  }: {
    user: UserEntity;
    ipAddress: string;
    userAgent: string;
  }): Promise<string> {
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

    await this.redis.setex(
      `${this.sessionPrefix}:${sessionId}`,
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
    const key = `${this.sessionPrefix}:${sessionId}`;
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
        `${this.sessionPrefix}:${sessionId}`,
        this.sessionTtl,
        JSON.stringify(session),
      );
    }
  }

  async destroySession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (session) {
      await this.redis.del(`${this.sessionPrefix}:${sessionId}`);
      await this.redis.srem(`user_sessions:${session.userId}`, sessionId);
    }
  }

  findSessionByUserAndDevice(
    userAgent: string,
    ipAddress: string,
  ): Promise<string | null> {
    const sessionKey = `${this.sessionPrefix}:${this.generateDeviceHash(userAgent, ipAddress)}`;

    return this.redis.get(sessionKey);
  }

  private generateDeviceHash(userAgent: string, ipAddress: string): string {
    return crypto
      .createHash('sha256')
      .update(`${this.sessionPrefix}:${userAgent}:${ipAddress}`)
      .digest('hex');
  }
}
