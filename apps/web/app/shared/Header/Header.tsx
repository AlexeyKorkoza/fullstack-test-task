'use client';

import { type FC } from 'react';
import { Layout, Dropdown, notification, Space } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

import { ROUTERS } from '@/constants/router.constant';
import './Header.scss';

const { Header: AntHeader } = Layout;

type Props = {
  isAuthenticated: boolean;
  signOutApiAction: () => Promise<any>;
};

export const Header: FC<Props> = ({ isAuthenticated, signOutApiAction }) => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const onLogout = async () => {
    try {
      const response = await signOutApiAction();
      const { message } = response;

      api.open({
        message,
        duration: 0,
        type: 'success',
      });
      router.push(ROUTERS.signin);
    } catch (error: unknown) {
      const body = await error?.response?.json();
      const { message } = body;
      api.open({
        message,
        duration: 0,
        type: 'error',
      });
    }
  };

  const redirectToProfile = () => {
    router.push(ROUTERS.profile);
  };

  const redirectToUsers = () => {
    router.push(ROUTERS.users);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: redirectToProfile,
    },
    {
      key: 'users',
      icon: <OrderedListOutlined />,
      label: 'Users',
      onClick: redirectToUsers,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: onLogout,
    },
  ];

  return (
    <>
      {contextHolder}
      <AntHeader className="header">
        <div className="dropdown-wrapper">
          {isAuthenticated && (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  Menu
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          )}
        </div>
      </AntHeader>
    </>
  );
};
