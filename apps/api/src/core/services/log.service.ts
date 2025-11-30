import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogService {
  sendLog({
    endpoint = '',
    data = {},
    message,
    type,
  }: {
    endpoint?: string;
    data?: unknown;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'debug' | 'verbose';
  }): void {
    // Logger.error(message, error?.stack || error?.toString() || '', 'AppLog');
  }
}
