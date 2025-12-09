import { Injectable } from '@nestjs/common';

import { LogsRepository } from '@/features/logs/services/logs.repository';
import { type SendLogRequestDto } from '@repo/api';
import { Log } from '@/features/logs/schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(private readonly logsRepository: LogsRepository) {}

  async createLog(logDto: SendLogRequestDto): Promise<Log> {
    return this.logsRepository.createLog(logDto);
  }
}
