import { type UserEntity } from '../../user/entities';
import { type BasicResponseDto } from '../../core/dtos';

export interface LoginResponseDto extends BasicResponseDto {
  user: Omit<UserEntity, 'password' | 'updatedAt'>;
}
