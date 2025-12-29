import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { type SendLogRequestDto } from '@repo/api';
import { type AppConfig } from '@/core/interfaces';

@Injectable()
export class LogService {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService<AppConfig>) {
    const rabbitMQUrl = configService.get<string>('rabbitmq.url', { infer: true });

    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMQUrl],
        queue: 'logs_queue',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  sendLog({
    endpoint = '',
    data = {},
    message,
    type,
  }: SendLogRequestDto): void {
    const body = {
      endpoint,
      data,
      message,
      type,
    };

    this.client.emit('send_log', body);
  }
}
