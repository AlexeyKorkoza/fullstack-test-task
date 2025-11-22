import { type ReactNode, type FC } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { Layout } from '@/shared/Layout';
import { Header } from '@/shared/Header';
import { signOutUserApi } from '@/auth/api';
import { Content } from '@/shared/Content';

type Props = {
  children: ReactNode;
};

export const LayoutWrapper: FC<Props> = async ({ children }) => {
  return (
    <AntdRegistry>
      <Layout>
        <Header signOutApiAction={signOutUserApi} />
        <Content>{children}</Content>
      </Layout>
    </AntdRegistry>
  );
};
