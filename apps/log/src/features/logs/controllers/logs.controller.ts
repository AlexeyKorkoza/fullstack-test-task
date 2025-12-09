import { Logger, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { type SendLogRequestDto } from '@repo/api';
import { LogsService } from '@/features/logs/repositories/logs.service';
import { Log } from '@/features/logs/schemas/log.schema';

@Controller()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @MessagePattern('send_log')
  async createLog(log: SendLogRequestDto): Promise<Log> {
    Logger.log('Received message: send_log body', log);

    return this.logsService.createLog(log);
  }
}
