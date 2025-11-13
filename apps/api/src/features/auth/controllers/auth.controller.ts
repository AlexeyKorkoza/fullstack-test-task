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
  UnauthorizedException,
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
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
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
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body);

    const { id: userId, email, createdAt } = user;
    const userAgent = request.headers['user-agent'] ?? '';
    const ipAddress = request.ip ?? '';

    const existingSessionId =
      await this.userSessionService.findSessionByUserAndDevice(
        userAgent,
        ipAddress,
      );

    if (existingSessionId) {
      return {
        user: { id: userId, email, createdAt },
        message: 'Already logged in from this device',
      };
    }

    const sessionId = await this.userSessionService.createSession({
      ipAddress,
      userAgent,
      user,
    });

    const userSessionTtl = this.configService.get<number>('userSession.ttl');
    const accessTokenExpiresIn = this.configService.get<number>(
      'accessToken.expiresIn',
    );
    const refreshTokenExpiresIn = this.configService.get<number>(
      'refreshToken.expiresIn',
    );

    const commonCookieOptions = {
      httpOnly: true,
      secure: this.isProduction,
      domain: this.isProduction ? undefined : 'localhost',
      path: '/',
    };

    response.cookie(SESSION_ID_COOKIE_NAME, sessionId, {
      ...commonCookieOptions,
      sameSite: this.isProduction ? 'strict' : 'lax',
      maxAge: userSessionTtl * 1000,
    });

    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      ...commonCookieOptions,
      sameSite: this.isProduction ? 'strict' : 'lax',
      maxAge: accessTokenExpiresIn * 1000,
    });

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      ...commonCookieOptions,
      sameSite: this.isProduction ? 'strict' : 'lax',
      maxAge: refreshTokenExpiresIn * 1000,
    });

    return {
      message: 'User logged in successfully',
      user: { id: userId, email, createdAt },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(UserSessionGuard)
  @Post('/refresh')
  async refreshAccessToken(
    @Req()
    request: Request & {
      refreshToken: string;
      sessionId: string;
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const sessionId = request.sessionId;
    const { accessToken } = await this.authService.refreshAccessToken({
      refreshToken,
      sessionId,
    });
    const accessTokenExpiresIn = this.configService.get<number>(
      'accessToken.expiresIn',
    );
    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      maxAge: accessTokenExpiresIn,
      sameSite: 'none',
    });

    return {
      message: 'Token is refreshed successfully',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, UserSessionGuard)
  @Post('/logout')
  async logout(
    @Req()
    request: Request & {
      refreshToken: string;
      sessionId: string;
      session: UserSession;
      user: AccessTokenPayload;
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.sessionId;
    if (!sessionId) {
      throw new UnauthorizedException('Session not found');
    }

    const refreshToken = request.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    await this.userSessionService.destroySession(sessionId);
    await this.authService.logoutUser(refreshToken);

    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    response.clearCookie(SESSION_ID_COOKIE_NAME);

    return { message: 'User logged out successfully' };
  }
}
