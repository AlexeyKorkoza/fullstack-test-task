import { type UserListItem } from '../entities/user-list-item.entity';

export type UserListResponseDto = {
  users: UserListItem[];
};
