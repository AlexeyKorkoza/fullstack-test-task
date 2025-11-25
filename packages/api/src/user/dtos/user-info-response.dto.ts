import { type UserSession } from '../../auth/entities/user-session.entity';

export interface UserInfoResponseDto {
  user: UserSession;
}
