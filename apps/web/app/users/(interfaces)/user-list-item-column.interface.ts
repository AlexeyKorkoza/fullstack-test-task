import { type UserListItem } from './user-list-item.interface';

export type UserListItemColumn = Omit<UserListItem, 'createdAt'> & {
  createdAt: string;
  key: string;
};
