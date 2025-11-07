'use client';

import React from 'react';
import { Layout, Menu, Button, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

import './Header.scss';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const onLogout = () => {};
  const onMenuToggle = () => {};
  const user = false;

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: onLogout,
    },
  ];

  const mainMenuItems: MenuProps['items'] = [
    {
      key: 'home',
      label: 'Home',
    },
    {
      key: 'products',
      label: 'Products',
    },
    {
      key: 'about',
      label: 'About',
    },
    {
      key: 'contact',
      label: 'Contact',
    },
  ];

  return (
    <AntHeader className="header">
      <div>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onMenuToggle}
          style={{ marginRight: 16 }}
        />
        <div>Your App</div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          items={mainMenuItems}
          // style={{ minWidth: 0, flex: 'auto', border: 'none' }}
        />
      </div>

      <div>
        {user && (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          />
        )}
      </div>
    </AntHeader>
  );
};
