import { Module } from '@nestjs/common';

import { LogsModule } from '@/features/logs/logs.module';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [CoreModule, LogsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
