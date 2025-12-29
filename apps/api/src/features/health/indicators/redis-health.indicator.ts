import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  type HealthIndicatorResult,
  HealthCheckError,
  HealthIndicator,
} from '@nestjs/terminus';
import { type Redis } from 'ioredis';

import { REDIS_CLIENT } from '@/core/providers/redis.provider';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(RedisHealthIndicator.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      if (this.redis.status !== 'ready' && this.redis.status !== 'connect') {
        throw new Error(`Redis connection status: ${this.redis.status}`);
      }

      const result = await Promise.race([
        this.redis.ping(),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error('Redis PING timeout')), 5000),
        ),
      ]);

      const isHealthy = result === 'PONG';
      if (!isHealthy) {
        throw new Error(`Redis PING returned unexpected result: ${result}`);
      }

      return this.getStatus(key, true, {
        message: 'Redis is healthy',
        responseTime: 'ok',
      });
    } catch (error: any) {
      this.logger.error(`Redis health check failed: ${error?.message}`, error?.stack);

      const result = this.getStatus(key, false, {
        message: error?.message || 'Redis connection failed',
        status: this.redis.status || 'unknown',
      });

      throw new HealthCheckError('Redis check failed', result);
    }
  }
}

