'use client';

import { type FC, useState, useEffect } from 'react';
import { Layout, Dropdown, notification, Space } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';

import { IS_AUTHENTICATED } from '@/constants/local-storage-keys.constant';
import { ROUTERS } from '@/constants/router.constant';
import { isApiError } from '@/core/api/helpers';
import { type BasicResponseDto } from '@repo/api';
import './Header.scss';

const { Header: AntHeader } = Layout;

type Props = {
  signOutApiAction: () => Promise<BasicResponseDto>;
};

export const Header: FC<Props> = ({ signOutApiAction }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(IS_AUTHENTICATED);
    }
    return false;
  });
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuthenticated(!!localStorage.getItem(IS_AUTHENTICATED));
    }
  }, [pathname]);

  const onLogout = async () => {
    try {
      const response = await signOutApiAction();
      const { message } = response;

      api.open({
        message,
        duration: 0,
        type: 'success',
      });

      localStorage.removeItem(IS_AUTHENTICATED);
      setIsAuthenticated(false);
      router.push(ROUTERS.signin);
    } catch (error: unknown) {
      if (isApiError(error)) {
        const body = await error?.response?.json();
        const message = body?.error || 'An error occurred';

        api.open({
          message,
          duration: 0,
          type: 'error',
        });
      }
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
