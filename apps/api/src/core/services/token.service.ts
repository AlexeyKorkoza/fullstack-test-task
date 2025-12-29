import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { type AppConfig } from '@/core/interfaces';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async generateAccessToken<T extends object>(payload: T): Promise<string> {
    const accessTokenSecret = this.configService.get('accessToken.secret', { infer: true });
    const accessTokenExpiresIn = this.configService.get(
      'accessToken.expiresIn',  { infer: true }
    );

    return this.jwtService.signAsync(payload, {
      expiresIn: accessTokenExpiresIn,
      secret: accessTokenSecret,
    });
  }

  async generateRefreshToken<T extends object>(payload: T): Promise<string> {
    const refreshTokenSecret = this.configService.get('refreshToken.secret', { infer: true });
    const refreshTokenExpiresIn = this.configService.get(
      'refreshToken.expiresIn',  { infer: true }
    );

    return this.jwtService.signAsync(payload, {
      expiresIn: refreshTokenExpiresIn,
      secret: refreshTokenSecret,
    });
  }

  async decodeAccessToken<T extends object>(token: string): Promise<T> {
    const accessTokenSecret = this.configService.get('accessToken.secret',  { infer: true });

    return this.jwtService.verifyAsync(token, {
      secret: accessTokenSecret,
    });
  }
}
