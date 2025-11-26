import { format } from 'date-fns';
import { redirect } from 'next/navigation';

import { USERS_TABLE_COLUMNS } from '@/users/constants/users-table-columns.constant';
import { fetchUsersFromApi } from '@/users/api';
import { DATE_FORMAT } from '@/constants/date-format.constant';
import type {
  UserListItemInterface,
  UserListItemColumnInterface,
} from '@/users/interfaces';
import { Table } from '@/shared/Table';
import { ROUTERS } from '@/constants/router.constant';
import { isApiError } from '@/core/api/helpers';

export default async function UsersPage() {
  try {
    const data = await fetchUsersFromApi();
    const { users } = data;

    const finalUsers = users.map((user: UserListItemInterface) => {
      const { createdAt, id, email } = user;
      const formattedDate = format(new Date(createdAt), DATE_FORMAT);

      return {
        createdAt: formattedDate,
        email,
        id,
        key: `${email}-${id}`,
      };
    });

    return (
      <Table<UserListItemColumnInterface>
        columns={USERS_TABLE_COLUMNS}
        dataSource={finalUsers}
      />
    );
  } catch (error: unknown) {
    console.error('Failed to fetch users:', error);

    if (isApiError(error)) {
      if (error?.response?.status === 400) {
        redirect(ROUTERS.signin);
      }

      if (error?.response?.status === 401) {
        return <div>Please sign in to view users.</div>;
      }
    }

    return <div>Error loading users. Please try again.</div>;
  }
}
