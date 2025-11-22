import { redirect } from 'next/navigation';

import { Profile } from '@/profile/components';
import { fetchProfileFromApi } from '@/profile/api';
import { ROUTERS } from '@/constants/router.constant';

export default async function ProfilePage() {
  try {
    const data = await fetchProfileFromApi();

    return <Profile user={data.user} />;
  } catch (error: any) {
    console.error('Failed to fetch profile:', error.response.error);

    if (error?.response?.status === 400) {
      redirect(ROUTERS.signin);
    }

    if (error?.response?.status === 401) {
      return <div>Please sign in to view profile.</div>;
    }

    return <div>Error loading profile. Please try again.</div>;
  }
}
