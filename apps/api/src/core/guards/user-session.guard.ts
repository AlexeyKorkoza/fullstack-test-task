import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { UserSessionService } from '@/core/services/user-session.service';
import { SESSION_ID_COOKIE_NAME } from '@/constants/cookies.constant';
import { LogService } from '@/core/services/log.service';
import { SendLogTypeEnum } from '@repo/api';

@Injectable()
export class UserSessionGuard implements CanActivate {
  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly logService: LogService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.cookies[SESSION_ID_COOKIE_NAME] as string;
    if (!sessionId) {
      this.logService.sendLog({
        message: 'Session required',
        type: SendLogTypeEnum.error,
      });

      throw new UnauthorizedException('Session required');
    }

    const session = await this.userSessionService.getSession(sessionId);
    if (!session) {
      this.logService.sendLog({
        message: 'Invalid session',
        type: SendLogTypeEnum.error,
      });
      throw new UnauthorizedException('Invalid session');
    }

    await this.userSessionService.updateActivity(sessionId);

    request.session = session;
    request.sessionId = sessionId;

    return true;
  }
}
