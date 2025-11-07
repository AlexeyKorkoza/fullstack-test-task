'use client';

import { type ReactNode, type FC } from 'react';
import { Layout } from 'antd';

import './Content.scss';

const { Content: AntdContent } = Layout;

type Props = {
  children: ReactNode;
};

export const Content: FC<Props> = ({ children }) => {
  return <AntdContent className="content">{children}</AntdContent>;
};
