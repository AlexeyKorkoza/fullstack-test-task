import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { type ReactNode } from 'react';

import { Header } from '@/shared/Header';
import Providers from '@/(providers)';
import { Layout } from '@/shared/Layout';
import { Content } from '@/shared/Content';
import './layout.scss';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AntdRegistry>
            <Layout>
              <Header />
              <Content>{children}</Content>
            </Layout>
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
