import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { type SendLogRequestDto } from '@repo/api';
import { ROUTINE_KEYS } from '@/core/constants/routine-keys.constant';
import { API_SERVICE } from '@/core/constants/symbols.constant';

@Injectable()
export class LogService {
  constructor(@Inject(API_SERVICE) private readonly client: ClientProxy) {}

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
    const key = `${ROUTINE_KEYS.LOG.KEY}.${type}`;

    this.client.emit(key, body);
  }
}
