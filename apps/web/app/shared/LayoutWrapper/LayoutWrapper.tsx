import { type ReactNode, type FC } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';

import { Layout } from '@/shared/Layout';
import { Header } from '@/shared/Header';
import { signOutUserApi } from '@/auth/api';
import { Content } from '@/shared/Content';
import { getCookiesStore } from '@/core/cookies';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';

type Props = {
  children: ReactNode;
};

export const LayoutWrapper: FC<Props> = async ({ children }) => {
  const cookies = await getCookiesStore();
  const isAuthenticated = !!cookies.get(REFRESH_TOKEN_COOKIE_NAME);

  return (
    <AntdRegistry>
      <Layout>
        <Header
          isAuthenticated={isAuthenticated}
          signOutApiAction={signOutUserApi}
        />
        <Content>{children}</Content>
      </Layout>
    </AntdRegistry>
  );
};
