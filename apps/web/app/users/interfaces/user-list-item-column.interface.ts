import { type UserListItemInterface } from './user-list-item.interface';

export type UserListItemColumnInterface = Omit<
  UserListItemInterface,
  'createdAt'
> & {
  createdAt: string;
  key: string;
};
