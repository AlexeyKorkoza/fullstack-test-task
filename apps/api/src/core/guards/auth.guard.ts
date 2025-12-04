import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenService } from '@/core/services/token.service';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/constants/cookies.constant';
import { type AccessTokenPayload } from '@/features/auth/interfaces';
import { LogService } from '@/core/services/log.service';
import { SendLogTypeEnum } from '@repo/api';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly logService: LogService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.cookies[ACCESS_TOKEN_COOKIE_NAME] as string;
    if (!accessToken) {
      this.logService.sendLog({
        message: 'No access token',
        type: SendLogTypeEnum.error,
      });

      throw new UnauthorizedException('No access token');
    }

    try {
      const payload =
        await this.tokenService.decodeAccessToken<AccessTokenPayload>(
          accessToken,
        );

      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
