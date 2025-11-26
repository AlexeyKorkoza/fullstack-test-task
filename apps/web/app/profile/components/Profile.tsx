import { type FC } from 'react';
import { format } from 'date-fns';

import { DATE_FORMAT } from '@/constants/date-format.constant';
import { Card } from '@/shared/Card';
import { type UserInfoResponseDto } from '@repo/api';
import './Profile.scss';

type Props = {
  user: UserInfoResponseDto['user'];
};

export const Profile: FC<Props> = ({ user }) => {
  const lastActivity = format(new Date(user.lastActivity), DATE_FORMAT);
  const createdAt = format(new Date(user.createdAt), DATE_FORMAT);

  return (
    <Card title="User Profile" variant="borderless">
      <div className="profile-content">
        <div className="profile-content_item">
          <span>Email: </span>
          <span>{user.email}</span>
        </div>

        <div className="profile-content_item">
          <span>Last Activity: </span>
          <span>{lastActivity}</span>
        </div>

        <div className="profile-content_item">
          <span>Created At: </span>
          <span>{createdAt}</span>
        </div>

        {user?.userAgent && (
          <div className="profile-content_item">
            <span>User Agent: </span>
            <span>{user.userAgent}</span>
          </div>
        )}

        {user?.ipAddress && (
          <div className="profile-content_item">
            <span>Ip Address: </span>
            <span>{user.ipAddress}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
