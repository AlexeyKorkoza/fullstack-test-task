import { type UserEntity } from '@/features/auth/entities';

export interface LoginResponseDto {
  user: Omit<UserEntity, 'password' | 'updatedAt'>;
}
