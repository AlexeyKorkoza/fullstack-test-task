import { Profile } from '@/profile/components';
import ky, { type KyResponse } from 'ky';
import { headers } from 'next/headers';

import type { UserInfoResponseDto } from '@/profile/models';

export default async function ProfilePage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    const headersList = await headers();

    const response: KyResponse<UserInfoResponseDto> = await ky.get(
      `${baseUrl}/api/profile`,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: headersList.get('cookie') || '',
        },
        credentials: 'include',
      },
    );

    const data = await response.json();

    return <Profile user={data.user} />;
  } catch (error) {
    console.error('Failed to fetch profile:', error);

    return <div>Error loading profile. Please try again.</div>;
  }
}
