import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LogsModule } from '@/features/logs/logs.module';
import { CoreModule } from '@/core/core.module';
import configuration from '@/configuration';
import {
  validateConfig,
  validationSchema,
} from '@/core/schemas/configuration.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate: validateConfig,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    CoreModule,
    LogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
