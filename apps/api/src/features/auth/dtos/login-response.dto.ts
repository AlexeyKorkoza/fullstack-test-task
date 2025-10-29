import { type UserEntity } from '@/features/auth/entities';

export interface LoginResponseDto {
  accessToken: string;
  user: Omit<UserEntity, 'password' | 'updatedAt'>;
}
