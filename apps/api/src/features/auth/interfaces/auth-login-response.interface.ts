import type { UserEntity } from '@/features/auth/entities';

export interface AuthLoginResponse {
  accessToken: string;
  user: UserEntity;
}
