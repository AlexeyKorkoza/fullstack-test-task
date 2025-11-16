import type { TableProps } from 'antd';

import type { UserListItemModel } from 'app/users/(dtos)';

export const USERS_TABLE_COLUMNS: TableProps<UserListItemModel>['columns'] = [
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
