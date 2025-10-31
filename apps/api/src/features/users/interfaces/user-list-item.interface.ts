import type { UserEntity } from '@/features/auth/entities';

export type UserListItem = Omit<UserEntity, 'password' | 'updatedAt'>;
