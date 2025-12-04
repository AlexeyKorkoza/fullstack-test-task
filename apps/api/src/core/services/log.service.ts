import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { type SendLogRequestDto } from '@repo/api';

@Injectable()
export class LogService {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    const rabbitMQUrl = configService.get<string>('rabbitmq.url');

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
