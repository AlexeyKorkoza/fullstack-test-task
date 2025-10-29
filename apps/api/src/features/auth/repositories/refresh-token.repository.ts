import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/core/services/prisma.service';
import type { RefreshTokenEntity } from '@/features/auth/entities';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createRefreshToken(
    data: Pick<RefreshTokenEntity, 'userId' | 'token_hash' | 'expiresAt'>,
  ): Promise<RefreshTokenEntity> {
    return this.prismaService.refreshToken.create({
      data,
    });
  }

  revokeRefreshToken(id: number): Promise<RefreshTokenEntity> {
    return this.prismaService.refreshToken.update({
      where: {
        id,
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
