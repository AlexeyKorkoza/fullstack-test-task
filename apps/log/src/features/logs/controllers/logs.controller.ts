import { Logger, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { type SendLogRequestDto } from '@repo/api';
import { Log } from '@/features/logs/schemas/log.schema';
import { LogsService } from '@/features/logs/services/logs.service';
import { ROUTINE_KEYS } from '@/core/constants/routine-keys.constant';

@Controller()
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @MessagePattern(`${ROUTINE_KEYS.LOG.KEY}.*`)
  async createLog(@Payload() log: SendLogRequestDto): Promise<Log> {
    Logger.log('Received message in createLog', log);

    return this.logsService.createLog(log);
  }
}
