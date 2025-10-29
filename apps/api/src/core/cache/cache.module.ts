import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          port: configService.get('redis.port'),
          host: configService.get('redis.host'),
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class CacheModule {}
