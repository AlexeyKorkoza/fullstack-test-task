import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { type ReactNode } from 'react';

import { Header } from '@/shared/Header';
import { Layout } from '@/shared/Layout';
import { Content } from '@/shared/Content';
import { signOutUserApi } from '@/auth/api';
import { getCookiesStore } from '@/core/cookies';
import { REFRESH_TOKEN_COOKIE_NAME } from '@/constants/cookie.constant';
import './layout.scss';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookies = await getCookiesStore();
  const isAuthenticated = !!cookies.get(REFRESH_TOKEN_COOKIE_NAME);

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Layout>
            <Header
              isAuthenticated={isAuthenticated}
              signOutApiAction={signOutUserApi}
            />
            <Content>{children}</Content>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
