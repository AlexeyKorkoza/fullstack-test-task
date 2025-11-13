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

  private hashRefreshToken(refreshToken: string): Promise<string> {
    const refreshTokenSaltRounds = this.configService.get<number>(
      'refreshToken.saltRounds',
    );

    return bcrypt.hash(refreshToken, refreshTokenSaltRounds);
  }

  async findRefreshToken({
    refreshToken,
    userId,
  }: {
    refreshToken: string;
    userId: number;
  }): Promise<RefreshTokenEntity> {
    const activeRefreshTokens =
      await this.refreshTokenRepository.findAllActiveRefreshTokens(userId);
    let validStoredToken: RefreshTokenEntity | null = null;

    for (const activeRefreshToken of activeRefreshTokens) {
      const isMatch = await bcrypt.compare(
        refreshToken,
        activeRefreshToken.token_hash,
      );

      if (isMatch) {
        validStoredToken = activeRefreshToken;
        break;
      }
    }

    return validStoredToken;
  }

  async createRefreshToken(userId: number): Promise<RefreshTokenEntity> {
    const refresh_token = await this.tokenService.generateRefreshToken({
      id: userId,
    });
    const refreshTokenExpiresIn = this.configService.get<number>(
      'refreshToken.expiresIn',
    );

    const token_hash = await this.hashRefreshToken(refresh_token);
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

  async revokeRefreshToken(refreshToken: string): Promise<RefreshTokenEntity> {
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);

    return this.refreshTokenRepository.revokeRefreshToken(hashedRefreshToken);
  }
}
