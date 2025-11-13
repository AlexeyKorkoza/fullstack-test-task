import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from '@/core/services/token.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '@/constants/cookies.constant';
import { type AccessTokenPayload } from '@/features/auth/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.cookies[ACCESS_TOKEN_COOKIE_NAME] as string;
    if (!accessToken) {
      throw new UnauthorizedException('No access token');
    }

    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      const payload =
        await this.tokenService.decodeAccessToken<AccessTokenPayload>(
          accessToken,
        );
      const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;

      request.user = payload;
      request.refreshToken = refreshToken;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
