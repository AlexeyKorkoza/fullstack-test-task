import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  type LoginDto,
  type RefreshAccessTokenResponseDto,
  type SignUpDto,
} from '@/features/auth/dtos';
import { AuthRepository } from '@/features/auth/repositories/auth.repository';
import { TokenService } from '@/core/services/token.service';
import { PasswordService } from '@/features/auth/services/password.service';
import { RefreshTokenService } from '@/features/auth/services/refresh-token.service';
import {
  type AuthLoginResponse,
  type AccessTokenPayload,
} from '@/features/auth/interfaces';
import { UserSessionService } from '@/core/services/user-session.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userSessionService: UserSessionService,
  ) {}

  async signUp(body: SignUpDto) {
    try {
      const { email, password } = body;
      const user = await this.authRepository.findUser(email);
      if (user) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await this.passwordService.hashPassword(password);
      await this.authRepository.createUser({
        email,
        password: hashedPassword,
      });

      return { message: 'User created successfully' };
    } catch (error) {
      Logger.error('Something went wrong when signing up user', error);

      throw new HttpException(
        'Something went wrong when signing up user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(body: LoginDto): Promise<AuthLoginResponse> {
    try {
      const { email, password } = body;

      const user = await this.authRepository.findUser(email);
      if (!user) {
        throw new Error('User not found');
      }

      const { id: userId } = user;
      const isPasswordValid = await this.passwordService.comparePasswords(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
      }

      const refreshToken = await this.tokenService.generateRefreshToken({
        id: userId,
      });
      if (!refreshToken) {
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
  }): Promise<RefreshAccessTokenResponseDto> {
    try {
      const userSession = await this.userSessionService.getSession(sessionId);
      const { userId, email } = userSession;

      const foundRefreshToken = await this.refreshTokenService.findRefreshToken(
        { refreshToken, userId },
      );
      if (!foundRefreshToken) {
        throw new NotFoundException('Refresh token not found');
      }

      const accessToken =
        await this.tokenService.generateAccessToken<AccessTokenPayload>({
          userId,
          email,
        });

      return { accessToken };
    } catch (error) {
      Logger.error('Something went wrong when refreshing access token', error);

      throw new HttpException(
        'Something went wrong when refreshing access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logoutUser(refreshToken: string): Promise<void> {
    try {
      await this.refreshTokenService.revokeRefreshToken(refreshToken);
    } catch (error) {
      Logger.error('Something went wrong when logging out user', error);

      throw new HttpException(
        'Something went wrong when logging out user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
