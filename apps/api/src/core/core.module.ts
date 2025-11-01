import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '@/core/services/prisma.service';
import { PasswordService } from '@/features/auth/services/password.service';
import { TokenService } from '@/core/services/token.service';
import { UserSessionService } from '@/core/services/user-session.service';

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
    JwtService,
    PrismaService,
    PasswordService,
    TokenService,
    UserSessionService,
  ],
  exports: [
    'REDIS_CLIENT',
    JwtService,
    PrismaService,
    PasswordService,
    TokenService,
    UserSessionService,
  ],
})
export class CoreModule {}
