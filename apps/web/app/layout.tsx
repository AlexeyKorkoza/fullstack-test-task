import '@ant-design/v5-patch-for-react-19';
import { type ReactNode } from 'react';

import { LayoutWrapper } from '@/shared/LayoutWrapper';
import './layout.scss';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
