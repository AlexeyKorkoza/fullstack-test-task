import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LogsController } from '@/features/logs/controllers/logs.controller';
import { Log, LogSchema } from '@/features/logs/schemas/log.schema';
import { LogsService } from '@/features/logs/services/logs.service';
import { LogsRepository } from '@/features/logs/repositories/logs.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  controllers: [LogsController],
  providers: [LogsService, LogsRepository],
})
export class LogsModule {}
