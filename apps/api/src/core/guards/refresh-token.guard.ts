import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { REFRESH_TOKEN_COOKIE_NAME } from '@/constants/cookies.constant';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    request.refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;

    return true;
  }
}
