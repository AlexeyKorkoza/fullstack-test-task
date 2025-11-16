import type { TableProps } from 'antd';

import { type UserListItemColumnInterface } from '@/users/interfaces';

export const USERS_TABLE_COLUMNS: TableProps<UserListItemColumnInterface>['columns'] =
  [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];
