import { format } from 'date-fns';

import Table from '@/users/(components)/Table';
import { USERS_TABLE_COLUMNS } from '@/users/(constants)/users-table-columns';
import { fetchUsersFromApi } from '@/users/(api)';
import { DATE_FORMAT } from '@/(constants)/date-format.constant';
import type { UserListItem, UserListItemColumn } from '@/users/(interfaces)';

export default async function UsersPage() {
  try {
    const data = await fetchUsersFromApi();
    const { users } = data;

    const finalUsers = users.map((user: UserListItem) => {
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
      <Table<UserListItemColumn>
        columns={USERS_TABLE_COLUMNS}
        dataSource={finalUsers}
      />
    );
  } catch (error: any) {
    console.error('Failed to fetch users:', error);

    if (error?.response?.status === 401) {
      return <div>Please sign in to view users.</div>;
    }

    return <div>Error loading users. Please try again.</div>;
  }
}
