import type { UserEntity } from './user.entity';

export type UserListItem = Omit<UserEntity, 'password' | 'updatedAt'>;
