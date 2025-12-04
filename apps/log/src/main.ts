import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const configService = new ConfigService();
  const rabbitMQUrl = configService.get<string>('rabbitmq.url');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMQUrl],
      },
    },
  );
  await app.listen();
  console.log('Logs microservice is started');
}

void bootstrap();
