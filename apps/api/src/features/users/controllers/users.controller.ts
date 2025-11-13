import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';

import { UsersService } from '@/features/users/services/users.service';
import { AuthGuard } from '@/core/guards/auth.guard';
import { UserSessionGuard } from '@/core/guards/user-session.guard';
import type { AccessTokenPayload } from '@/features/auth/interfaces';
import {
  type UserInfoResponseDto,
  type UserListResponseDto,
} from '@/features/users/dtos';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users')
  @UseGuards(AuthGuard)
  async findAllUsers(): Promise<UserListResponseDto> {
    const users = await this.usersService.findAllUsers();

    return { users };
  }

  @Get('/me')
  @UseGuards(AuthGuard, UserSessionGuard)
  async findMe(
    @Req()
    request: Request & {
      sessionId: string;
      user: AccessTokenPayload;
    },
  ): Promise<UserInfoResponseDto> {
    const sessionId = request.sessionId;

    const user = await this.usersService.findInfoAboutMe(sessionId);

    return { user };
  }
}
