import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/core/services/prisma.service';
import type { RefreshTokenEntity } from '@/features/auth/entities';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAllActiveRefreshTokens(userId: number): Promise<RefreshTokenEntity[]> {
    return this.prismaService.refreshToken.findMany({
      where: {
        userId,
        is_revoked: false,
      },
    });
  }

  createRefreshToken(
    data: Pick<RefreshTokenEntity, 'userId' | 'token_hash' | 'expiresAt'>,
  ): Promise<RefreshTokenEntity> {
    return this.prismaService.refreshToken.create({
      data,
    });
  }

  revokeRefreshToken(tokenHash: string): Promise<RefreshTokenEntity> {
    return this.prismaService.refreshToken.update({
      where: {
        token_hash: tokenHash,
      },
      data: {
        is_revoked: true,
      },
    });
  }

  revokeAllRefreshTokens(userId: number): Promise<any> {
    return this.prismaService.refreshToken.updateMany({
      where: {
        userId,
      },
      data: {
        is_revoked: true,
      },
    });
  }
}
