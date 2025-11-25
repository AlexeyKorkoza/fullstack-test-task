import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/core/services/prisma.service';
import { type SignUpRequestDto } from '@repo/api';
import { type UserEntity } from '@repo/api';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createUser(body: SignUpRequestDto): Promise<UserEntity> {
    return this.prismaService.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
  }

  findUser(email: string): Promise<UserEntity> {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
