import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';

import { PrismaService } from '@/core/services/prisma.service';
import { PasswordService } from '@/features/auth/services/password.service';
import { TokenService } from '@/core/services/token.service';
import { UserSessionService } from '@/core/services/user-session.service';
import { EmailService } from '@/core/services/email.service';
import { SesService } from '@/core/services/ses.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
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
    EmailService,
    JwtService,
    PrismaService,
    PasswordService,
    SesService,
    TokenService,
    UserSessionService,
  ],
  exports: [
    'REDIS_CLIENT',
    EmailService,
    JwtService,
    PrismaService,
    PasswordService,
    TokenService,
    UserSessionService,
  ],
})
export class CoreModule {}
