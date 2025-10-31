import {
  Body,
  Controller,
  Post,
  UsePipes,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { type Response, type Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '@/features/auth/services/auth.service';
import {
  type LoginDto,
  type LoginResponseDto,
  type SignUpDto,
} from '@/features/auth/dtos';
import { ZodValidationPipe } from '@/core/pipes/zod-validation.pipe';
import { signUpSchema } from '@/features/auth/schemas/sign-up.schema';
import { loginSchema } from '@/features/auth/schemas/login.schema';
import { AuthGuard } from '@/core/guards/auth.guard';
import { UserSessionService } from '@/core/services/user-session.service';
import {
  type AccessTokenPayload,
  type UserSession,
} from '@/features/auth/interfaces';
import { UserSessionGuard } from '@/core/guards/user-session.guard';
import {
  AUTH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
} from '@/constants/cookies.constant';

@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userSessionService: UserSessionService,
  ) {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  @HttpCode(HttpStatus.OK)
  @Post('/register')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() body: LoginDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<LoginResponseDto>> {
    const { accessToken, user } = await this.authService.login(body);

    const { id: userId, email, createdAt } = user;
    const userAgent = request.headers['user-agent'] ?? '';
    const ipAddress = request.ip ?? '';

    const existingSessionId =
      await this.userSessionService.findSessionByUserAndDevice(
        userAgent,
        ipAddress,
      );
    if (existingSessionId) {
      return response.json({
        user: { id: userId, email, createdAt },
        message: 'Already logged in from this device',
      });
    }

    const sessionId = await this.userSessionService.createSession({
      ipAddress,
      userAgent,
      user,
    });
    const userSessionTtl = this.configService.get<number>('userSession.ttl');
    response.cookie(SESSION_ID_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: this.isProduction,
      maxAge: userSessionTtl * 1000,
    });

    const accessTokenExpiresIn = this.configService.get<number>(
      'accessToken.expiresIn',
    );
    response.cookie(AUTH_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      maxAge: accessTokenExpiresIn * 1000,
    });

    return response.json({
      user: {
        id: userId,
        email,
        createdAt,
      },
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('/refresh')
  refreshAccessToken(@Req() request: Request) {
    const payload = request['user'] as AccessTokenPayload;

    return this.authService.refreshAccessToken(payload);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, UserSessionGuard)
  @Post('/logout')
  async logout(
    @Req()
    request: Request & {
      sessionId: string;
      session: UserSession;
      user: AccessTokenPayload;
    },
    @Res() response: Response,
  ) {
    const sessionId = request.sessionId;
    const { refreshTokenId } = request.user;

    await this.userSessionService.destroySession(sessionId);
    await this.authService.logoutUser(refreshTokenId);

    response.clearCookie('session_id');
    response.clearCookie('access_token');

    return response.json({ message: 'User logged out successfully' });
  }
}
