import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionService } from '@/core/services/user-session.service';

@Injectable()
export class UserSessionGuard implements CanActivate {
  constructor(private readonly userSessionService: UserSessionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = this.extractSessionId(request);

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

  private extractSessionId(request: any): string | null {
    return (
      request.headers['x-session-id'] ||
      request.cookies?.session_id ||
      request.query.session_id
    );
  }
}
