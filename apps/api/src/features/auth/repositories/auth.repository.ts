import { Injectable } from '@nestjs/common';

import { PrismaService } from "@/core/services/prisma.service";
import { type SignUpDto } from "@/features/auth/dtos";
import { type UserEntity } from '@/features/auth/entities';

@Injectable()
export class AuthRepository {
    constructor(private readonly prismaService: PrismaService) {}

    createUser(body: SignUpDto): Promise<UserEntity> {
        return this.prismaService.user.create({
            data: {
                email: body.email,
                password: body.password
            },
        })
    }

    findUser(email: string): Promise<UserEntity> {
      return this.prismaService.user.findUnique({
        where: {
          email
        }
      })
    }
}
