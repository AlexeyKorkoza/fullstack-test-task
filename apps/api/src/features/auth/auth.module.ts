import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { RefreshTokenService } from '@/features/auth/services/refresh-token.service';
import { RefreshTokenRepository } from '@/features/auth/repositories/refresh-token.repository';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    AuthRepository,
    RefreshTokenService,
    RefreshTokenRepository,
  ],
})
export class AuthModule {}
