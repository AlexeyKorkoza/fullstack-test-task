import { Module, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { type Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';

import { PrismaService } from '@/core/services/prisma.service';
import { PasswordService } from '@/features/auth/services/password.service';
import { TokenService } from '@/core/services/token.service';
import { UserSessionService } from '@/core/services/user-session.service';
import { EmailService } from '@/core/services/email.service';
import { SesService } from '@/core/services/ses.service';
import { LogService } from '@/core/services/log.service';
import { RedisProvider } from '@/core/providers/redis.provider';
import { API_SERVICE, REDIS_CLIENT } from '@/core/constants/symbols.constant';
import {
  QUEUE_KEYS,
  EXCHANGE_KEYS,
} from '@/core/constants/queue-keys.constant';
import type { AppConfig } from '@/core/interfaces';

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
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: API_SERVICE,
        useFactory: async (configService: ConfigService) => {
          const rabbitMQUrl = configService.get<string>('rabbitmq.url', {
            infer: true,
          });

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMQUrl],
              queue: QUEUE_KEYS.LOG,
              exchange: EXCHANGE_KEYS.LOG,
              exchangeType: 'topic',
              queueOptions: {
                durable: true,
              },
              wildcards: true,
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
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
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(API_SERVICE) private readonly client: ClientProxy,
  ) {}

  async onModuleDestroy() {
    await this.redis.quit();
    await this.client.close();
  }
}
