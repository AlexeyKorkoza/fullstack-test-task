import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { TokenService } from '@/core/services/token.service';
import { RefreshTokenRepository } from '@/features/auth/repositories/refresh-token.repository';
import { type RefreshTokenEntity } from '@/features/auth/entities';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async createRefreshToken(userId: number): Promise<RefreshTokenEntity> {
    const refresh_token = await this.tokenService.generateRefreshToken({
      id: userId,
    });
    const refreshTokenExpiresIn = this.configService.get<number>(
      'refreshToken.expiresIn',
    );

    const saltRounds = this.configService.get<number>(
      'refreshToken.saltRounds',
    );
    const token_hash = await bcrypt.hash(refresh_token, saltRounds);
    const expiresAt = new Date(Date.now() + refreshTokenExpiresIn);
    const body: Pick<
      RefreshTokenEntity,
      'userId' | 'token_hash' | 'expiresAt'
    > = {
      userId,
      token_hash,
      expiresAt,
    };

    return this.refreshTokenRepository.createRefreshToken(body);
  }

  async revokeRefreshToken(id: number): Promise<RefreshTokenEntity> {
    return this.refreshTokenRepository.revokeRefreshToken(id);
  }
}
