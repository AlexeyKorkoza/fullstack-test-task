import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from '@/core/services/token.service';
import { AUTH_TOKEN_COOKIE_NAME } from '@/constants/cookies.constant';
import { type AccessTokenPayload } from '@/features/auth/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies[AUTH_TOKEN_COOKIE_NAME] as string;
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload =
        await this.tokenService.decodeAccessToken<AccessTokenPayload>(token);

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
