'use client';
import { type FC, type ReactNode } from 'react';
import { Layout as AntdLayout } from 'antd';

import './Layout.scss';

type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => (
  <AntdLayout className="layout">{children}</AntdLayout>
);
