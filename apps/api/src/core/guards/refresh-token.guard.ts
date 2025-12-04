import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { REFRESH_TOKEN_COOKIE_NAME } from '@/constants/cookies.constant';
import { LogService } from '@/core/services/log.service';
import { SendLogTypeEnum } from '@repo/api';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly logService: LogService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;
    if (!refreshToken) {
      this.logService.sendLog({
        message: 'No refresh token',
        type: SendLogTypeEnum.success,
      });
      throw new UnauthorizedException('No refresh token');
    }

    request.refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME] as string;

    return true;
  }
}
