import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import {
  QUEUE_KEYS,
  EXCHANGE_KEYS,
} from '@/core/constants/queue-keys.constant';

async function bootstrap() {
  const configService = new ConfigService();
  const rabbitMQUrl = configService.get<string>('RABBITMQ_URL', {
    infer: true,
  });
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
    },
  );
  await app.listen();

  logger.log('Logs microservice is started');
}

void bootstrap();
