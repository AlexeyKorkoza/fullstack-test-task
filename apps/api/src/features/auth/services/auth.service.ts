import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import {
  type LoginDto,
  type LoginResponseDto,
  type RefreshAccessTokenResponseDto,
  type SignUpDto,
} from '@/features/auth/dtos';
import { AuthRepository } from '@/features/auth/repositories/auth.repository';
import { TokenService } from '@/core/services/token.service';
import { PasswordService } from '@/features/auth/services/password.service';
import { RefreshTokenService } from '@/features/auth/services/refresh-token.service';
import { AccessTokenPayloadEntity } from '@/features/auth/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
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

  async login(body: LoginDto): Promise<LoginResponseDto> {
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
      const { id: refreshTokenId } =
        await this.refreshTokenService.createRefreshToken(userId);

      const accessToken =
        await this.tokenService.generateAccessToken<AccessTokenPayloadEntity>({
          userId,
          email: user.email,
          refreshTokenId,
        });
      if (!accessToken) {
        throw new HttpException(
          'Something went wrong when creating access token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        accessToken,
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

  async refreshAccessToken(
    payload: AccessTokenPayloadEntity,
  ): Promise<RefreshAccessTokenResponseDto> {
    try {
      const { userId, email, refreshTokenId } = payload;
      const accessToken =
        await this.tokenService.generateAccessToken<AccessTokenPayloadEntity>({
          userId,
          email,
          refreshTokenId,
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

  async logoutUser(refreshTokenId: number): Promise<void> {
    try {
      await this.refreshTokenService.revokeRefreshToken(refreshTokenId);
    } catch (error) {
      Logger.error('Something went wrong when logging out user', error);

      throw new HttpException(
        'Something went wrong when logging out user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
