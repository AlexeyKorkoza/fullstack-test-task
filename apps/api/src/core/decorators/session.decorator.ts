import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserSession } from '@/features/auth/interfaces';

export const Session = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserSession => {
    const request = ctx.switchToHttp().getRequest();

    return request.session;
  },
);
