import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { CommonHelper } from '@/core/helpers/common.helper';

@Injectable()
export class CacheService {
  private readonly cacheClient: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly commonHelper: CommonHelper,
  ) {
    this.cacheClient = new Redis({
      port: configService.get('redis.port'),
      host: configService.get('redis.host'),
    });
  }

  async setValue(key: string, value: string | number): Promise<void> {
    await this.cacheClient.set(key, value);
  }

  async getValue(key: string, parse = false): Promise<object | null | string> {
    const data = await this.cacheClient.get(key);

    return parse ? this.commonHelper.parseJSONSafe(data) : data;
  }
}
