import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './features/auth/auth.module';
import configuration from '@/configuration';
import { CacheModule } from '@/core/cache/cache.module';
import { UsersModule } from '@/features/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CacheModule,
    JwtModule.register({}),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
