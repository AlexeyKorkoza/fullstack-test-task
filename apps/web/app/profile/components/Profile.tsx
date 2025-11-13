import { type FC } from 'react';

import { type UserInfoResponseDto } from '@/profile/models';
import Card from '@/profile/components/Card';
import './Profile.scss';

type Props = {
  user: UserInfoResponseDto['user'];
};

export const Profile: FC<Props> = ({ user }) => {
  const lastActivity = new Date(user.lastActivity).toISOString();
  const createdAt = new Date(user.createdAt).toISOString();

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
