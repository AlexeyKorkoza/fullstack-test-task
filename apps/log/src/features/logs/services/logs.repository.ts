import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Log, type LogDocument } from '@/features/logs/schemas/log.schema';
import { type SendLogRequestDto } from '@repo/api';

@Injectable()
export class LogsRepository {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
  ) {}

  async createLog(logDto: SendLogRequestDto): Promise<Log> {
    const createdLog = new this.logModel(logDto);

    return createdLog.save();
  }
}
