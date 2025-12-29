import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type AccessTokenPayload } from '@/features/auth/interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccessTokenPayload => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
