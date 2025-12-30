import { Module, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';

import { PrismaService } from '@/core/services/prisma.service';
import { PasswordService } from '@/features/auth/services/password.service';
import { TokenService } from '@/core/services/token.service';
import { UserSessionService } from '@/core/services/user-session.service';
import { EmailService } from '@/core/services/email.service';
import { SesService } from '@/core/services/ses.service';
import { LogService } from '@/core/services/log.service';
import { RedisProvider, REDIS_CLIENT } from '@/core/providers/redis.provider';
import { type AppConfig } from '@/core/interfaces';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        connection: {
          host: configService.get('redis.host', { infer: true }),
          port: configService.get('redis.port', { infer: true }),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [
    RedisProvider,
    EmailService,
    JwtService,
    LogService,
    PrismaService,
    PasswordService,
    SesService,
    TokenService,
    UserSessionService,
  ],
  exports: [
    REDIS_CLIENT,
    EmailService,
    JwtService,
    LogService,
    PrismaService,
    PasswordService,
    TokenService,
    UserSessionService,
  ],
})
export class CoreModule implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
