import { type UserSession } from '@/features/auth/interfaces';

export type UserInfoResponseDto = {
  user: UserSession;
};
