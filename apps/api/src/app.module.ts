import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './features/auth/auth.module';
import configuration from '@/configuration';
import { UsersModule } from '@/features/users/users.module';
import { CoreModule } from '@/core/core.module';
import { validateConfig, validationSchema } from '@/core/schemas/configuration.schema';
import { HealthModule } from '@/features/health/health.module';

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
    HealthModule,
    JwtModule.register({}),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
