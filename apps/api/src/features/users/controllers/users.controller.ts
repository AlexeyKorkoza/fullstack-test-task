import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { type UserInfoResponseDto, type UserListResponseDto } from '@repo/api';
import { UsersService } from '@/features/users/services/users.service';
import { AuthGuard } from '@/core/guards/auth.guard';
import { UserSessionGuard } from '@/core/guards/user-session.guard';
import type { AccessTokenPayload } from '@/features/auth/interfaces';
import {
  SwaggerUserListResponseDto,
  SwaggerUserInfoResponseDto,
} from '@/features/users/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: SwaggerUserListResponseDto,
  })
  @UseGuards(AuthGuard)
  async findAllUsers(): Promise<UserListResponseDto> {
    const users = await this.usersService.findAllUsers();

    return { users };
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get info about the current user' })
  @ApiResponse({
    status: 200,
    description: 'Information about the current user',
    type: SwaggerUserInfoResponseDto,
  })
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
