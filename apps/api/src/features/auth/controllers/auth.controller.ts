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
import {
  type BasicResponseDto,
  type LoginRequestDto,
  type LoginResponseDto,
  type SignUpRequestDto,
} from '@repo/api';

import { AuthService } from '@/features/auth/services/auth.service';
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
import { RefreshTokenGuard } from '@/core/guards/refresh-token.guard';

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
  signUp(@Body() body: SignUpRequestDto): Promise<BasicResponseDto> {
    return this.authService.signUp(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() body: LoginRequestDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const { accessToken, refreshToken, user } =
      await this.authService.login(body);

    const { id: userId, email, createdAt } = user;
    const userAgent = request.headers['user-agent'] ?? '';
    const ipAddress = request.ip ?? '';

    const generatedExistedSessionId = this.userSessionService.generateSessionId(
      userAgent,
      ipAddress,
    );
    const existingSessionId =
      await this.userSessionService.findSessionByUserAndDevice(
        generatedExistedSessionId,
      );

    if (existingSessionId) {
      this.authService.setCookiesInSignIn({
        accessToken,
        isProduction: this.isProduction,
        refreshToken,
        response,
        sessionId: generatedExistedSessionId.split(':').at(1),
      });

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

    this.authService.setCookiesInSignIn({
      accessToken,
      isProduction: this.isProduction,
      refreshToken,
      response,
      sessionId,
    });

    return {
      message: 'User logged in successfully',
      user: { id: userId, email, createdAt },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard, UserSessionGuard)
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
  @UseGuards(AuthGuard, RefreshTokenGuard, UserSessionGuard)
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

    await this.authService.logoutUser({ refreshToken, sessionId });
    await this.userSessionService.destroySession(sessionId);

    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    response.clearCookie(SESSION_ID_COOKIE_NAME);

    return { message: 'User logged out successfully' };
  }
}
