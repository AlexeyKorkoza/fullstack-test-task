import type { UserEntity } from '@repo/api';

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
}
