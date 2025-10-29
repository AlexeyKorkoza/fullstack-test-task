import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken<T extends object>(payload: T): Promise<string> {
    const accessTokenSecret = this.configService.get('accessToken.secret');
    const accessTokenExpiresIn = this.configService.get(
      'accessToken.expiresIn',
    );

    return this.jwtService.signAsync(payload, {
      expiresIn: accessTokenExpiresIn,
      secret: accessTokenSecret,
    });
  }

  async generateRefreshToken<T extends object>(payload: T): Promise<string> {
    const refreshTokenSecret = this.configService.get('refreshToken.secret');
    const refreshTokenExpiresIn = this.configService.get(
      'refreshToken.expiresIn',
    );

    return this.jwtService.signAsync(payload, {
      expiresIn: refreshTokenExpiresIn,
      secret: refreshTokenSecret,
    });
  }

  async decodeAccessToken<T extends object>(token: string): Promise<T> {
    const accessTokenSecret = this.configService.get('accessToken.secret');

    return this.jwtService.verifyAsync(token, {
      secret: accessTokenSecret,
    });
  }
}
