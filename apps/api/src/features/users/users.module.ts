import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersController } from '@/features/users/controllers/users.controller';
import { UsersService } from '@/features/users/services/users.service';
import { UsersRepository } from '@/features/users/repositories/users.repository';
import { UserSessionService } from '@/core/services/user-session.service';
import { PrismaService } from '@/core/services/prisma.service';
import { TokenService } from '@/core/services/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [
    ConfigService,
    UsersService,
    UsersRepository,
    UserSessionService,
    PrismaService,
    TokenService,
    JwtService,
  ],
})
export class UsersModule {}
