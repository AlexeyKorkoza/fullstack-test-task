import { Profile } from '@/profile/components';
import { fetchProfileFromApi } from '@/profile/api';

export default async function ProfilePage() {
  try {
    const data = await fetchProfileFromApi();

    return <Profile user={data.user} />;
  } catch (error: any) {
    console.error('Failed to fetch profile:', error);

    if (error?.response?.status === 401) {
      return <div>Please sign in to view users.</div>;
    }

    return <div>Error loading profile. Please try again.</div>;
  }
}
