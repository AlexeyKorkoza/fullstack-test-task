import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthRepository } from './repositories/auth.repository';
import { PrismaService } from '@/core/services/prisma.service';
import { PasswordService } from '@/features/auth/services/password.service';
import { TokenService } from '@/core/services/token.service';
import { UserSessionService } from '@/core/services/user-session.service';
import { RefreshTokenService } from '@/features/auth/services/refresh-token.service';
import { RefreshTokenRepository } from '@/features/auth/repositories/refresh-token.repository';

@Module({
  controllers: [AuthController],
  providers: [
    ConfigService,
    JwtService,
    AuthService,
    AuthRepository,
    PrismaService,
    PasswordService,
    TokenService,
    UserSessionService,
    RefreshTokenService,
    RefreshTokenRepository,
  ],
})
export class AuthModule {}
