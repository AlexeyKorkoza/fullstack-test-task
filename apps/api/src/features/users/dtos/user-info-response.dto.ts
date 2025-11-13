import { type UserSession } from '@/features/auth/interfaces';

export interface UserInfoResponseDto {
  user: UserSession;
}
