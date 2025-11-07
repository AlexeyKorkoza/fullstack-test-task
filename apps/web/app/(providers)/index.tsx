'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { buildReactQueryClient } from '@/(core)/react-query';
import { type ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = buildReactQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
