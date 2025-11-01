import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './features/auth/auth.module';
import configuration from '@/configuration';
import { UsersModule } from '@/features/users/users.module';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CoreModule,
    JwtModule.register({}),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
