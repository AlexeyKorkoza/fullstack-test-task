import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type Response } from 'express';
import { isBefore } from 'date-fns';

import {
  type BasicResponseDto,
  type LoginRequestDto,
  SendLogTypeEnum,
  type SignUpRequestDto,
} from '@repo/api';
import { AuthRepository } from '@/features/auth/repositories/auth.repository';
import { TokenService } from '@/core/services/token.service';
import { PasswordService } from '@/features/auth/services/password.service';
import { RefreshTokenService } from '@/features/auth/services/refresh-token.service';
import {
  type AccessTokenPayload,
  type AuthLoginResponse,
} from '@/features/auth/interfaces';
import { UserSessionService } from '@/core/services/user-session.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_ID_COOKIE_NAME,
} from '@/core/constants/cookies.constant';
import { EmailService } from '@/core/services/email.service';
import { LogService } from '@/core/services/log.service';
import { type AppConfig } from '@/core/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService<AppConfig>,
    private readonly emailService: EmailService,
    private readonly logService: LogService,
    private readonly passwordService: PasswordService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly tokenService: TokenService,
    private readonly userSessionService: UserSessionService,
  ) {}

  setCookiesInSignIn({
    accessToken,
    isProduction,
    refreshToken,
    response,
    sessionId,
  }: {
    accessToken: string;
    isProduction: boolean;
    refreshToken: string;
    response: Response;
    sessionId: string;
  }): void {
    const userSessionTtl = this.configService.get<number>('userSession.ttl', { infer: true });
    const accessTokenExpiresIn = this.configService.get<number>(
      'accessToken.expiresIn', { infer: true }
    );
    const refreshTokenExpiresIn = this.configService.get<number>(
      'refreshToken.expiresIn', { infer: true }
    );

    const commonCookieOptions = {
      httpOnly: true,
      secure: isProduction,
      domain: isProduction ? undefined : 'localhost',
      path: '/',
    };

    response.cookie(SESSION_ID_COOKIE_NAME, sessionId, {
      ...commonCookieOptions,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: userSessionTtl * 1000,
    });

    response.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
      ...commonCookieOptions,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: accessTokenExpiresIn * 1000,
    });

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      ...commonCookieOptions,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: refreshTokenExpiresIn * 1000,
    });
  }

  async signUp(body: SignUpRequestDto): Promise<BasicResponseDto> {
    try {
      const { email, password } = body;
      const user = await this.authRepository.findUser(email);
      if (user) {
        const data = {
          email,
          id: user.id,
          createdAt: user.createdAt,
        };
        this.logService.sendLog({
          data,
          endpoint: '/auth/register',
          message: 'User already exists',
          type: SendLogTypeEnum.error,
        });
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await this.passwordService.hashPassword(password);
      await this.authRepository.createUser({
        email,
        password: hashedPassword,
      });

      await this.emailService.sendWelcomeEmail(body);

      this.logService.sendLog({
        endpoint: '/auth/register',
        message: 'User created successfully',
        type: SendLogTypeEnum.success,
      });

      return { message: 'User created successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      Logger.error('Something went wrong when signing up user', error);

      throw new HttpException(
        'Something went wrong when signing up user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(body: LoginRequestDto): Promise<AuthLoginResponse> {
    try {
      const { email, password } = body;

      const user = await this.authRepository.findUser(email);
      if (!user) {
        this.logService.sendLog({
          data: {
            email,
          },
          endpoint: '/auth/login',
          message: 'Invalid credentials',
          type: SendLogTypeEnum.error,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      const { id: userId } = user;
      const isPasswordValid = await this.passwordService.comparePasswords(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        this.logService.sendLog({
          data: {
            email,
            id: user.id,
            createdAt: user.createdAt,
          },
          endpoint: '/auth/login',
          message: 'Invalid credentials',
          type: SendLogTypeEnum.error,
        });
        throw new UnauthorizedException('Invalid credentials');
      }

      const refreshToken = await this.tokenService.generateRefreshToken({
        id: userId,
      });
      if (!refreshToken) {
        this.logService.sendLog({
          data: {
            email,
            id: user.id,
            createdAt: user.createdAt,
          },
          endpoint: '/auth/login',
          message: 'Something went wrong when creating refresh token',
          type: SendLogTypeEnum.error,
        });
        throw new HttpException(
          'Something went wrong when creating refresh token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.refreshTokenService.createRefreshToken(userId);

      const accessToken =
        await this.tokenService.generateAccessToken<AccessTokenPayload>({
          userId,
          email: user.email,
        });
      if (!accessToken) {
        this.logService.sendLog({
          data: {
            email,
            id: user.id,
            createdAt: user.createdAt,
          },
          endpoint: '/auth/login',
          message: 'Something went wrong when creating access token',
          type: SendLogTypeEnum.error,
        });
        throw new HttpException(
          'Something went wrong when creating access token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      Logger.error('Something went wrong when logging in user', error);

      throw new HttpException(
        'Something went wrong when logging in user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshAccessToken({
    refreshToken,
    sessionId,
  }: {
    refreshToken: string;
    sessionId: string;
  }): Promise<{ accessToken: string }> {
    try {
      const userSession = await this.userSessionService.getSession(sessionId);
      const { userId, email } = userSession;

      const foundRefreshToken = await this.refreshTokenService.findRefreshToken(
        { refreshToken, userId },
      );
      if (!foundRefreshToken) {
        this.logService.sendLog({
          data: {
            sessionId,
          },
          endpoint: '/auth/refresh',
          message: 'Refresh token not found',
          type: SendLogTypeEnum.error,
        });
        throw new NotFoundException('Refresh token not found');
      }

      const expiresAtDate = new Date(foundRefreshToken.expiresAt);
      const currentDate = new Date();

      const isRefreshTokenExpired = isBefore(expiresAtDate, currentDate);
      if (isRefreshTokenExpired) {
        this.logService.sendLog({
          data: {
            sessionId,
          },
          endpoint: '/auth/refresh',
          message: 'Refresh token expired',
          type: SendLogTypeEnum.error,
        });
        throw new HttpException(
          'Refresh token expired',
          HttpStatus.BAD_REQUEST,
        );
      }

      const accessToken =
        await this.tokenService.generateAccessToken<AccessTokenPayload>({
          userId,
          email,
        });

      return { accessToken };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      Logger.error('Something went wrong when refreshing access token', error);

      throw new HttpException(
        'Something went wrong when refreshing access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logoutUser({
    refreshToken,
    sessionId,
  }: {
    refreshToken: string;
    sessionId: string;
  }): Promise<void> {
    try {
      const userSession = await this.userSessionService.getSession(sessionId);
      const { userId } = userSession;

      const foundRefreshToken = await this.refreshTokenService.findRefreshToken(
        { refreshToken, userId },
      );
      if (!foundRefreshToken) {
        this.logService.sendLog({
          data: {
            sessionId,
          },
          endpoint: '/auth/logout',
          message: 'Refresh token not found',
          type: SendLogTypeEnum.error,
        });
        throw new NotFoundException('Refresh token not found');
      }

      const { token_hash: tokenHash } = foundRefreshToken;

      await this.refreshTokenService.revokeRefreshToken(tokenHash);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      Logger.error('Something went wrong when logging out user', error);

      throw new HttpException(
        'Something went wrong when logging out user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
