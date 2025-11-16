import { QueryClient } from '@tanstack/react-query';

export const buildReactQueryClient = () => {
  const queryClient = new QueryClient();

  return queryClient;
};
