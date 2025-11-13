import { useQuery } from '@tanstack/react-query';

import { fetchCurrentUserProfile } from '@/profile/api';
import { profileFactoryKeys } from '@/profile/factories/profile-factory.keys';

export const useGetCurrentUserProfile = () => {
  return useQuery({
    queryKey: profileFactoryKeys.currentUserProfile(),
    queryFn: fetchCurrentUserProfile,
  });
};
