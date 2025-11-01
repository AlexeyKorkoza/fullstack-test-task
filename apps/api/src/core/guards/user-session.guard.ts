import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionService } from '@/core/services/user-session.service';
import { SESSION_ID_COOKIE_NAME } from '@/constants/cookies.constant';

@Injectable()
export class UserSessionGuard implements CanActivate {
  constructor(private readonly userSessionService: UserSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.cookies[SESSION_ID_COOKIE_NAME] as string;
    if (!sessionId) {
      throw new UnauthorizedException('Session required');
    }

    const session = await this.userSessionService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    await this.userSessionService.updateActivity(sessionId);

    request.session = session;
    request.sessionId = sessionId;

    return true;
  }
}
