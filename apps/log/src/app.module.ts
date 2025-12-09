import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LogsModule } from '@/features/logs/logs.module';
import { CoreModule } from '@/core/core.module';
import configuration from '@/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CoreModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
