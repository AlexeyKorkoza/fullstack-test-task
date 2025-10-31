import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/core/services/prisma.service';
import { type UserListItem } from '@/features/users/interfaces';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAllUsers(): Promise<UserListItem[]> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }
}
